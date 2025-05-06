import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { AdPageService } from './services/rewards.service';
import { Partner } from 'src/app/shared/models/offer.model';
import { Meta } from 'src/app/shared/models/response.model';
import { Reward, RewardPayload } from 'src/app/shared/models/reward.model';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss']
})
export class RewardsComponent implements OnInit {
  rewards: Reward[] = []
  partnersFilter: Partner[]
  formReward: FormGroup
  form
  reward: Reward | null
  meta: Meta
  pageSize = 10
  page:number = 1
  totalItems:number = 0

  constructor(
    private adPageSv: AdPageService,
    private route: Router,
    private routeActive: ActivatedRoute,
  ) { 
    routeActive.queryParams.subscribe(data =>{
      this.form = data.form
      if(this.form) this.initFormAdvertisement()
    })
  }

  ngOnInit(): void {
    this.listRewards(this.page)
  }

  initFormAdvertisement(){
    this.reward = null
    this.formReward = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      image: new FormControl(null, Validators.required),
      points_to_be_claimed: new FormControl(0, Validators.required),
      amount: new FormControl(0, Validators.required),
    })
    if(this.rewards?.length > 0 && this.form != 'create' && this.form){
      this.adPageSv.getReward(+this.form).subscribe((data) => {
        if (data) {
          const {id, ...parsed} = data 
          this.reward = data
          this.formReward.patchValue({
            ...parsed,
          })
        }
      })
    }
  }

  listRewards(page: number, pageSize = this.pageSize){
    this.adPageSv.getRewards(page, pageSize).subscribe(
      (response) => {
        this.rewards = response.data
        this.meta = response.meta
        this.totalItems = response.meta.total_elements
        this.page = page
        // this.initFormAdvertisement()
      },
      (error) => {
        MyAlert.alert('Error al cargar los premios', true)
      }
    )
  }

  onPageChange(page: number) {
    this.page = +page
    this.listRewards(+page)
  }

  async createOrEdit(form, id){
    // if(this.formReward.invalid) return this.formReward.markAllAsTouched()
    try {
      if(id){
        const data = await this.adPageSv.updateReward(form as unknown as RewardPayload, id).toPromise()
        if(data) {
          this.rewards = this.rewards.map(reward => reward.id === id ? data : reward)
        }
      }else{
        const data = await this.adPageSv.createReward(form as unknown as RewardPayload).toPromise()
        if(data) {
          this.listRewards
        }
      }
      this.route.navigate([])
      MyAlert.alert(id ? 'Premio editado' : 'Premio Creado')
    } catch (error:any) {
      MyAlert.alert(error.error.message, true)
    }
    // Después de crear o editar, volvemos a cargar la primera página
    this.listRewards(1)
  }

  delete(id, i, name){
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
        if(name == 'premio'){
          this.adPageSv.deleteReward(id).subscribe(data =>{
            MyAlert.alert('Premio eliminado!')
            this.listRewards(this.meta.current_page)
          })
        }
      }
    })
  }
}