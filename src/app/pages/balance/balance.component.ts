import { Component } from '@angular/core';
import { BalanceService } from './services/balance.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Balance } from '../../shared/models/balance.model';
import { OffersService } from '../offers/services/offers.service';
import { Offer } from 'src/app/shared/models/offer.model';
import { MyAlert } from '../../shared/static-functions/myFunctions';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styles: []
})
export class BalanceComponent {
  balance: Balance[] = []
  offers: Offer[]
  total: number
  formBalance: FormGroup
  balanceId: number | null
  form
  page:number = 1

  constructor(
    private route: Router,
    private routeActive: ActivatedRoute,
    private balanceSv: BalanceService,
    private offersSv: OffersService
  ) { 
    routeActive.queryParams.subscribe(data =>{
      this.form = data.form
      if(this.form) this.initFormBalance()
    })
  }

  ngOnInit(): void {
    this.listOffers()
    this.listBalance()
  }

  initFormBalance(){
    this.balanceId = null
    this.formBalance = new FormGroup({
      description: new FormControl(''),
      amount: new FormControl('', Validators.required),
      offer_id: new FormControl(null, Validators.required)
    })
    if(this.balance?.length > 0 && this.form != 'create' && this.form){
      this.balanceId = this.balance[this.form].id
      this.formBalance.patchValue(this.balance[this.form])
    }
  }

  listBalance(){
    this.balanceSv.getBalance().subscribe((data:any) =>{
      this.balance = data.body.data
      this.total = data.body.total || 0
    })
  }

  async listOffers(){
    const offers:any = await this.offersSv.getOffers().toPromise()
    const works:any = await this.offersSv.getOffersWork().toPromise()
    const courses:any = await this.offersSv.getOffersCourse().toPromise()
    this.offers = offers.body.concat(works.body.concat(courses.body))
  }

  createOrEdit(form, id){
    if(this.formBalance.invalid) return this.formBalance.markAllAsTouched()
    if(id){
      this.balanceSv.putBalance(form, id).toPromise().then((data:any) =>{
        this.balance[this.form] = data.body
        MyAlert.alert('Ganancia editada!')
        this.route.navigate([])
      }).catch(error =>{
        MyAlert.alert(error.error.mesaage, true)
      })
    }else{
      this.balanceSv.postBalance(form).toPromise().then((data:any) =>{
        this.balance.push(data.body)
        MyAlert.alert('Ganancia creada!')
        this.route.navigate([])
      }).catch(error =>{
        MyAlert.alert(error.error.message, true)
      })
    }
  }

  delete(id, i){
    Swal.fire({
      position: 'center',
      text: '¿Seguro que desea eliminar este recurso?',
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
        this.balanceSv.deleteBalance(id).subscribe(data =>{
          this.balance.splice(i, 1)
          MyAlert.alert('Ganancia eliminada!')
        })
      }
    })
  }

}
