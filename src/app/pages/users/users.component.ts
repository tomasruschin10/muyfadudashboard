import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';
import { User } from '../../shared/models/user.model'
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MyAlert } from '../../shared/static-functions/myFunctions';
import jwt_decode from 'jwt-decode';
declare var $: any

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[]
  formUser: FormGroup
  form
  userId: number | null

  constructor(
    private usersSv: UsersService,
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
  }

  initFormUser(i?){
    if(!this.form) this.route.navigate([], {queryParams: { form: i !== undefined ? i : 'create' }});
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
      role_id: new FormControl(1)
    })
    if(this.users?.length > 0 && this.form != 'create' && this.form){
      this.changePass()
      this.formUser.patchValue(this.users[this.form])
      this.userId = this.users[this.form].id
      setTimeout(() => {
        $('#img').attr('src', this.users[this.form].image.url)
      }, 10);
    }else{
      this.formUser.removeControl('newpassword')
    }
  }

  listUsers(){
    this.usersSv.getUsers(1).subscribe((data:any) =>{
      this.users = data.body
      if(this.form) this.initFormUser()
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
        MyAlert.alert('Usuario editado!')
        this.route.navigate([]);
      }).catch(error =>{
        MyAlert.alert(error.error.message, true)
      })
    }else{
      this.usersSv.postUsers(formdata).toPromise().then((data:any) =>{
        const newUser:any = jwt_decode(data.body.token)
        this.users.push(newUser.userData)
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
      text: '¿Seguro que desea eliminar este usuario?',
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

}
