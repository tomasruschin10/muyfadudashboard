import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ResourcesService } from './services/resources.service';
import { Resource, ResourceCategory } from '../../shared/models/resource.model';
import { MyAlert, CreateFile } from '../../shared/static-functions/myFunctions';
import { userData } from 'src/app/components/dash/header/header.component';
import { CareerService } from '../college-career/services/career.service';
import { Subject, Career } from '../../shared/models/career.model';
declare var $:any

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  resources: Resource[] = []
  subjects: Subject[]
  careers: Career[]
  careerId
  resourceCategory: ResourceCategory[]
  resourceCategoryfilter: ResourceCategory[]
  formResource: FormGroup
  resource: object | any
  form
  page:number = 1

  constructor(
    private route: Router,
    private routeActive: ActivatedRoute,
    private resourceSv: ResourcesService,
    private careerSv: CareerService
  ) { 
    routeActive.queryParams.subscribe(data =>{
      this.form = data.form
      if(this.form) this.initFormResource()
    })
  }

  ngOnInit(): void {
    this.listResources()
    this.listResourceCategory()
    this.listSubject()
    this.listCareer()
  }

  initFormResource(){
    this.resource = null
    this.careerId = null
    this.formResource = new FormGroup({
      user_id: new FormControl(userData.id, Validators.required), 
      subject_id: new FormControl(null, Validators.required),
      resource_category_id: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required)
    })
    if(this.resources?.length > 0 && this.form != 'create' && this.form){
      this.resource = this.resources[this.form]
      this.formResource.patchValue(this.resources[this.form])
      setTimeout(() => {
        this.filterList('resource_category_id', this.resourceCategoryfilter)
        this.filterCareer()
      }, 100);
    }else{
      this.resourceCategory = this.resourceCategoryfilter
    }
  }

  listResources(){
    this.resourceSv.getResources().subscribe((data:any) =>{
      console.log(data.body)
      this.resources = data.body
      this.initFormResource()
    })
  }

  listResourceCategory(){
    this.resourceSv.getResourceCategory().subscribe((data:any) =>{
      this.resourceCategory = data.body
      this.resourceCategoryfilter = data.body
    })
  }

  listSubject(){
    this.careerSv.getSubject().subscribe((data:any) =>{
      this.subjects = data.body
    })
  }

  listCareer(){
    this.careerSv.getCareer().subscribe(({body}:any) =>{
      this.careers = body
    })
  }

  async createOrEdit(form, id){
    if(this.formResource.invalid) return this.formResource.markAllAsTouched()
    if(form.resource_category_id === true){
      try {
        const data:any = await this.resourceSv.postResourceCategory({name: $('#resource_category_id').val()}).toPromise()
        form.resource_category_id = data.body.id
        this.resourceCategoryfilter.unshift(data.body)
      } catch (error:any) {
        return MyAlert.alert(error.error.message, true)
      }
    }
    const formdata:any = new FormData
    for(let [item, value] of Object.entries(form)){
      formdata.append(item, value)
    }
    if(id){
      this.resourceSv.putResources(formdata, id).toPromise().then((data:any) =>{
        this.resources[this.form] = data.body
        MyAlert.alert('Recurso editado!')
        this.route.navigate([])
      }).catch(error =>{
        MyAlert.alert(error.error.message, true)
      })
    }else{
      this.resourceSv.postResources(formdata).toPromise().then((data:any) =>{
        this.resources.unshift(data.body)
        MyAlert.alert('Recurso creado!')
        this.route.navigate([])
      }).catch(error =>{
        MyAlert.alert(error.error.message, true)
      })
    }
  }

  delete(id, i, name){
    setTimeout(() => {$('#resource_category_id').trigger('click') }, 0);
    Swal.fire({
      position: 'center',
      text: '¿Seguro que desea eliminar '+name+'?',
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
        if(name == 'este recurso'){
          this.resourceSv.deleteResources(id).subscribe(data =>{
            this.resources.splice(i, 1)
            MyAlert.alert('Recurso eliminado!')
          })
        }else{
          this.resourceSv.deleteResourceCategory(id).subscribe(data =>{
            this.resourceCategoryfilter.splice(i, 1)
            MyAlert.alert('Categoria eliminada!')
          })
        }
      }
    })
  }

  filterList(id, filter, item?){
    this.resourceCategory = filter.filter( newList =>{
      return newList.name.toUpperCase().includes(item ? item.name.toUpperCase() : $('#'+id).val().toUpperCase())
    })
    setTimeout(() => {
      if(item ? item.name : $('#'+id).val().toUpperCase() == $('.item_'+id).html()?.toUpperCase()){
        this.formResource.controls[id].patchValue(item?.id || $('.item_'+id).val())
        $('#'+id).val($('.item_'+id).html())
      }else{
        this.formResource.controls[id].patchValue($('#'+id).val() ? true : '')
      }
      this.formResource.controls[id].markAsTouched()
    }, 10);
  }

  filterCareer(){
    const subject = this.subjects.find(x => x.id == this.formResource.controls.subject_id.value)
    this.careerId = subject?.subjectCategory?.career_id
  }

  addImg(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formResource.controls.image.patchValue(file)
    }
  }

  async copy(item){
    const img = await CreateFile.createFile(item.image.url)
    this.formResource.patchValue({...item, image: img})
    this.createOrEdit(this.formResource.value, null)
  }

  async changeAprovedStatus(id) {
    try {
      const response = await this.resourceSv.changeApprovedStatus(id).toPromise();
      console.log(response)
    } catch (error) {
      console.error("error ", error)
    }
  }
}
