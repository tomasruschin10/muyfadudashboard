import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LostObject } from '../../shared/models/lost-object.model';
import { LostObjectService } from './services/lost-object.service';
import { MyAlert } from '../../shared/static-functions/myFunctions';
import { userData } from '../../components/dash/header/header.component';
declare var $:any

@Component({
  selector: 'app-lost-object',
  templateUrl: './lost-object.component.html',
  styleUrls: ['./lost-object.component.scss']
})
export class LostObjectComponent implements OnInit {
  lostObjects: LostObject[] = []
  lostObject: LostObject | null
  formLostObject: FormGroup
  form
  page: number = 1

  constructor(
    private route: Router,
    private routeActive: ActivatedRoute,
    private lostObjectSv: LostObjectService,
  ) { 
    routeActive.queryParams.subscribe(data =>{
      this.form = data.form
      if(this.form) this.initFormLostObject()
    })
  }

  ngOnInit(): void {
    this.listLostObjects()
  }

  initFormLostObject(){
    this.lostObject = null
    this.formLostObject = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      user_id: new FormControl(userData.id, Validators.required),
      image: new FormControl('', Validators.required),
    })
    if(this.lostObjects?.length > 0 && this.form != 'create' && this.form){
      this.lostObject = this.lostObjects[this.form]
      this.formLostObject.patchValue(this.lostObject)

    }
  }

  listLostObjects(){
    this.lostObjectSv.getLostObjects().subscribe(({body}:any) =>{
      this.lostObjects = body
    })
  }

  async createOrEdit(form){
    if(this.formLostObject.invalid) return this.formLostObject.markAllAsTouched()
    const formdata = new FormData
    for(let [item, value] of Object.entries(form)){
      formdata.append(item, value as any)
    }
    try {
      if(this.lostObject?.id){
        const {body}:any = await this.lostObjectSv.putLostObject(formdata, this.lostObject.id).toPromise()
        this.lostObjects[this.form] = body
      }else{
        const {body}:any = await this.lostObjectSv.postLostObject(formdata).toPromise()
        this.lostObjects.unshift(body)
      }
      this.route.navigate([])
      MyAlert.alert(this.lostObject?.id ? 'Objeto editado' : 'Objeto creado')
    } catch (error:any) {
      MyAlert.alert(error.error.message, true)
    }
  }

  delete(id, i){
    Swal.fire({
      position: 'center',
      text: '¿Seguro que desea eliminar este objeto?',
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
        this.lostObjectSv.deleteLostObject(id).subscribe(data =>{
          this.lostObjects.splice(i, 1)
          MyAlert.alert('Objeto eliminado!')
        })
      }
    })
  }

  addImg(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const imgURL = URL.createObjectURL(file);
      this.formLostObject.get('image')?.patchValue(file)
      setTimeout(() => {
        $('#img').attr('src', imgURL)
      }, 10);
    }
  }

}
