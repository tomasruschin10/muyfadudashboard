import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { NotificationService } from './services/notifications.service';
import { Partner } from 'src/app/shared/models/offer.model';
import { Meta } from 'src/app/shared/models/response.model';
import { Notification, NotificationPayload } from 'src/app/shared/models/notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = []
  partnersFilter: Partner[]
  formNotification: FormGroup
  form
  notification: Notification | null
  meta: Meta
  pageSize = 10
  page:number = 1
  totalItems:number = 0

  constructor(
    private adPageSv: NotificationService,
    private route: Router,
    private routeActive: ActivatedRoute,
  ) { 
    routeActive.queryParams.subscribe(data =>{
      this.form = data.form
      if(this.form) this.initFormNotifications()
    })
  }

  ngOnInit(): void {
    this.listNotifications(this.page)
  }

  initFormNotifications(){
    this.notification = null
    this.formNotification = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      date: new FormControl(null),
    })
  }

  listNotifications(page: number, pageSize = this.pageSize){
    this.adPageSv.getNotifications(page, pageSize).subscribe(
      (response) => {
        this.notifications = response.data
        this.meta = response.meta
        this.totalItems = response.meta.total_elements
        this.page = page
        // this.initFormAdvertisement()
      },
      (error) => {
        MyAlert.alert('Error al cargar las notificaciones', true)
      }
    )
  }

  onPageChange(page: number) {
    this.page = +page
    this.listNotifications(+page)
  }

  async createOrEdit(form, id){
    // if(this.formNotification.invalid) return this.formNotification.markAllAsTouched()
    try {
      const localDate = new Date(form.date ?? '');
      // const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
      const formData = {
        ...form,
        date: form.date ? localDate.toISOString() : null
      };
      const data = await this.adPageSv.createNotification(formData as unknown as NotificationPayload).toPromise()
      if(data) {
        this.listNotifications
      }
      this.route.navigate([])
      MyAlert.alert(id ? 'Notificacion editada' : 'Notificacion Creada')
    } catch (error:any) {
      MyAlert.alert(error.error.message, true)
    }
    // Después de crear o editar, volvemos a cargar la primera página
    this.listNotifications(1)
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
        if(name == 'notificacion'){
          this.adPageSv.deleteNotification(id).subscribe(
            (data) => {
              MyAlert.alert('Notificacion eliminado!')
              this.listNotifications(this.meta.current_page)
            },
            (err) => {
              MyAlert.alert('Ocurrio un error al eliminar, intente de nuevo mas tarde', true)
            }
          )
        }
      }
    })
  }
}