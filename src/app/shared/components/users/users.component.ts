import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from '../../../pages/users/services/users.service';
import { User } from '../../models/user.model'
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MyAlert } from '../../static-functions/myFunctions';
import jwt_decode from 'jwt-decode';
import { userData, setUserData } from 'src/app/components/dash/header/header.component';
import { CareerService } from '../../../pages/college-career/services/career.service';
import { Career } from '../../models/career.model';
import { Meta } from '../../models/response.model';
import { formatDate } from 'src/utils/helpers';
import * as XLSX from 'xlsx';
declare var $:any

@Component({
  selector: 'app-users-component',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @Input() role:number
  users: User[] = []
  careers: Career[]
  formUser: FormGroup
  form
  userId: number | null
  page: number = 1
  meta: Meta
  pageSize = 10
  totalItems:number = 0
  search: string = ''
  startDate: string = ''
  endDate: string = ''

  constructor(
    private usersSv: UsersService,
    private careerSv: CareerService,
    private route: Router,
    private routeActive: ActivatedRoute
  ) { 
    routeActive.queryParams.subscribe(data =>{
      this.form = data.form
      if(this.form) this.initFormUser()
    })
  }

  ngOnInit(): void {
    this.listUsers()
    if(this.role == 2) this.listCareer()
  }

  initFormUser(){
    this.userId = null
    this.formUser = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]),
      newpassword: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      active: new FormControl(1, Validators.required),
      role_id: new FormControl(this.role)
    })
    if(this.role == 2){
      this.formUser.addControl('instagram', new FormControl(''))
      this.formUser.addControl('web', new FormControl(''))
      this.formUser.addControl('career_id', new FormControl(''))
    }
    if(this.users?.length > 0 && this.form != 'create' && this.form){
      this.changePass()
      this.formUser.patchValue(this.users[this.form])
      this.formUser.controls.active.patchValue(this.formUser.controls.active.value ? 1 : 0)
      this.userId = this.users[this.form].id
      setTimeout(() => {
        $('#img').attr('src', this.users[this.form].image.url)
      }, 10);
    }else{
      this.formUser.removeControl('newpassword')
    }
  }

  listUsers(){
    const formatedStart = this.startDate ? formatDate(new Date(this.startDate)) : '';
    const formatedEnd = this.endDate ? formatDate(new Date(this.endDate)) : '';
    this.usersSv.getUsersPaginated(this.role, this.page, this.pageSize, this.search, formatedStart, formatedEnd).subscribe(
      (response) => {
        this.users = response.data
        this.meta = response.meta
        this.totalItems = response.meta.total_elements
        this.page = response.meta.current_page
      },
      (error) => {
        MyAlert.alert('Error al cargar los usuarios', true)
      }
    )
  }

  exportUsers() {
    const formatedStart = this.startDate ? formatDate(new Date(this.startDate)) : '';
    const formatedEnd = this.endDate ? formatDate(new Date(this.endDate)) : '';
    this.usersSv.getUsersForExport(this.role, this.search, formatedStart, formatedEnd).subscribe(
      (response: User[]) => {
        // Preparar los datos para Excel
        const data = response.map(user => ({
          'Nombre': user.name,
          'Apellido': user.lastname,
          'Email': user.email,
          'Teléfono': user.phone,
          'Nombre de usuario': user.username,
          'Estado': user.active ? 'Activo' : 'Inactivo',
          'Fecha de registro': new Date(user.created_at).toLocaleString()
        }));

        // Crear una hoja de trabajo
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

        // Crear un libro de trabajo
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

        // Generar nombre de archivo con fecha y hora
        const fileName = `Usuarios_${new Date().toISOString().split('T')[0]}.xlsx`;

        // Guardar el archivo
        XLSX.writeFile(wb, fileName);

        MyAlert.alert('Exportación completada con éxito', false);
      },
      (error) => {
        MyAlert.alert('Error al exportar los usuarios', true);
      }
    )
  }

  listCareer(){
    this.careerSv.getCareer().subscribe((data:any) =>{
      this.careers = data.body
    })
  }

  createOrEdit(form, id){
    if(this.formUser.invalid) return this.formUser.markAllAsTouched()
    const formdata:any = new FormData
    for(let [item, value] of Object.entries(form)){
      formdata.append(item, value)
    }
    if(id){
      this.usersSv.putUsers(formdata, id).toPromise().then((data:any) =>{
        this.users[this.form] = data.body 
        if(userData.id == data.body.id) setUserData(data.body)
        MyAlert.alert('Usuario editado!')
        this.route.navigate([]);
      }).catch(error =>{
        MyAlert.alert(error.error.message, true)
      })
    }else{
      this.usersSv.postUsers(formdata).toPromise().then((data:any) =>{
        const newUser:any = jwt_decode(data.body.token)
        this.users.unshift(newUser.userData)
        MyAlert.alert('Usuario creado!')
        this.route.navigate([]);
      }).catch(error =>{
        MyAlert.alert(error.error.message, true)
      })
    }
  }

  delete(id, i){
    Swal.fire({
      position: 'center',
      text: '¿Seguro que desea eliminar este '+ (this.role == 2 ? 'estudiante' : 'usuario') +'?',
      width: 350,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Eliminar',
      reverseButtons: true,
      customClass: {
        actions: 'mt-1',
        confirmButton: 'btn-danger'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersSv.deleteUseer(id).subscribe(data =>{
          this.users.splice(i, 1)
          MyAlert.alert('Usuario eliminado!')
        })
      }
    })
  }

  changePass(){
    setTimeout(() => {
      if($('.labelPass').hasClass('collapsed')){
        this.formUser.get('password')?.clearValidators()
        this.formUser.get('newpassword')?.clearValidators()
      }else{
        this.formUser.get('password')?.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(30)])
        this.formUser.get('newpassword')?.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(30)])
      }
      this.formUser.get('password')?.reset('')
      this.formUser.get('newpassword')?.reset('')
    }, 100);
  }

  addImg(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const imgURL = URL.createObjectURL(file);
      this.formUser.get('image')?.patchValue(file)
      setTimeout(() => {
        $('#img').attr('src', imgURL)
      }, 10);
    }
  }

  onPageChange(page: number) {
    this.page = +page
    this.listUsers()
  }

  onSearch() {
    this.page = 1; // Reset to first page when searching
    this.listUsers();
  }
}