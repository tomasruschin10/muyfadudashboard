import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Advertisement } from '../../shared/models/advertisement.model';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { AdPageService } from './services/ad-page.service';
import { OffersService } from '../offers/services/offers.service';
import { Partner } from 'src/app/shared/models/offer.model';
import { CareerService } from '../college-career/services/career.service';
import { Career, Subject } from 'src/app/shared/models/career.model';
import { CreateFile } from '../../shared/static-functions/myFunctions';
declare var $: any

@Component({
  selector: 'app-ad-page',
  templateUrl: './ad-page.component.html',
  styleUrls: ['./ad-page.component.scss']
})
export class AdPageComponent implements OnInit {
  advertisements: Advertisement[] = []
  partners: Partner[] = []
  careers: Career[]
  partnersFilter: Partner[]
  formAdvertisement: FormGroup
  form
  advertisement: Advertisement | null
  page: number = 1

  constructor(
    private adPageSv: AdPageService,
    private offertSv: OffersService,
    private careerSv: CareerService,
    private route: Router,
    private routeActive: ActivatedRoute,
  ) { 
    routeActive.queryParams.subscribe(data =>{
      this.form = data.form
      if(this.form) this.initFormAdvertisement()
    })
  }

  ngOnInit(): void {
    this.listAdvertisement()
    this.listPartner()
    this.listCareers()
  }

  initFormAdvertisement(){
    this.advertisement = null
    this.formAdvertisement = new FormGroup({
      url: new FormControl('', Validators.required),
      partner_id: new FormControl('', Validators.required),
      career_id: new FormControl(null, Validators.required),
      date_start: new FormControl('', Validators.required),
      date_end: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required)
    })
    if(this.advertisements?.length > 0 && this.form != 'create' && this.form){
      this.advertisement = this.advertisements[this.form]
      this.formAdvertisement.patchValue({
        ...this.advertisements[this.form],
        date_start: this.advertisements[this.form].date_start.toString().slice(0, 10),
        date_end: this.advertisements[this.form].date_end.toString().slice(0, 10),
      })
      setTimeout(() => {
        $('#img').attr('src', this.advertisements[this.form].image.url)
        this.filterList()
      }, 10);
    }else{
      this.partners = this.partnersFilter
    }
  }

  listAdvertisement(){
    this.adPageSv.getAdvertisement().subscribe(({body}:any) =>{
      this.advertisements = body
      this.initFormAdvertisement()
    })
  }

  listPartner(){
    this.offertSv.getPartner().subscribe(({body}:any) =>{
      this.partners = body
      this.partnersFilter = body
    })
  }

  listCareers(){
    this.careerSv.getCareer().subscribe(({body}:any) =>{
      this.careers = body
    })
  }

  async createOrEdit(form, id){
    if(this.formAdvertisement.invalid) return this.formAdvertisement.markAllAsTouched()
    try {
      if(form.partner_id === true){
        let dataPartner:any = await this.offertSv.postPartner({name: $('#partner').val()}).toPromise()
        form.partner_id = dataPartner?.body?.id
        this.partnersFilter.push(dataPartner.body)
      }
    } catch (error) {
      return MyAlert.alert('Ha ocurrido un error!', true)
    }
    const formdata = new FormData
    for(let [item, value] of Object.entries(form)){
      formdata.append(item, value as any)
    }
    try {
      if(id){
        const {body}:any = await this.adPageSv.putAdvertisement(formdata, id).toPromise()
        this.advertisements[this.form] = body
      }else{
        const {body}:any = await this.adPageSv.postAdvertisement(formdata).toPromise()
        this.advertisements.unshift(body)
      }
      this.route.navigate([])
      MyAlert.alert(id ? 'Anuncio editado' : 'Anuncio Creado')
    } catch (error:any) {
      MyAlert.alert(error.error.message, true)
    }
  }

  delete(id, i, name){
    setTimeout(() => {$('#partner').trigger('click')}, 0);
    Swal.fire({
      position: 'center',
      text: '¿Seguro que desea eliminar este '+name+'?',
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
        if(name == 'anuncio'){
          this.adPageSv.deleteAdvertisement(id).subscribe(data =>{
            this.advertisements.splice(i, 1)
            MyAlert.alert('Anuncio eliminada!')
          })
        }else{
          this.offertSv.deletePartner(id).subscribe(data =>{
            this.partners.splice(i, 1)
            MyAlert.alert('Patrocinador eliminado!')
          })
        }
      }
    })
  }

  filterList(item?){
    this.partners = this.partnersFilter.filter( newList =>{
      return newList.name.toUpperCase().includes(item ? item.name?.toUpperCase() : $('#partner').val()?.toUpperCase())
    })
    setTimeout(() => {
      if(item ? item.name : $('#partner').val()?.toUpperCase() == $('.item_partner').html()?.toUpperCase()){
        this.formAdvertisement.controls.partner_id.patchValue($('.item_partner').val())
        $('#partner').val($('.item_partner').html())
      }else{
        this.formAdvertisement.controls.partner_id.patchValue($('#partner').val() ? true : '')
      }
      this.formAdvertisement.controls.partner_id.markAsTouched()
    }, 10);
  }

  addImg(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const imgURL = URL.createObjectURL(file);
      this.formAdvertisement.get('image')?.patchValue(file)
      setTimeout(() => {
        $('#img').attr('src', imgURL)
      }, 10);
    }
  }

  async copy(item){
    const img = await CreateFile.createFile(item.image.url)
    this.formAdvertisement.patchValue({...item, image: img})
    this.createOrEdit(this.formAdvertisement.value, null)
  }

}
