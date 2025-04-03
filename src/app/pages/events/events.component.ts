import { Component, OnInit } from '@angular/core';
import { EventService } from './services/events.services';
import { Event as IEvent, EventPayload } from 'src/app/shared/models/event.model';
import { Meta } from 'src/app/shared/models/response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { CareerService } from '../college-career/services/career.service';
import { Career } from 'src/app/shared/models/career.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  events: IEvent[] = []
  event: IEvent | null
  form
  meta: Meta
  pageSize = 10
  page:number = 1
  totalItems:number = 0
  formEvent: FormGroup
  careers: Career[] = []
  selectedCareerId: string = ''

  constructor(
    private eventService: EventService, 
    private route: Router,
    private routeActive: ActivatedRoute,
    private careerService: CareerService
  ) {
    routeActive.queryParams.subscribe(data =>{
      this.form = data.form
      if(this.form) this.initFormEvent()
    })
  }

  ngOnInit(): void {
    this.routeActive.queryParams.subscribe(params => {
      this.form = params['form'];
      if (params['id'] && this.form === 'edit') {
        this.loadEvent(params['id']);
      }
    });
    this.getCareers()
    this.listEvents(this.page)
  }

  initFormEvent(){
    this.event = null
    this.formEvent = new FormGroup({
      name: new FormControl('', Validators.required),
      date: new FormControl(Date.now(), Validators.required),
      description: new FormControl('', Validators.required),
      careerId: new FormControl(null),
    })
  }

  listEvents(page: number = 1){
    this.eventService.getAllEvents(page, this.pageSize).subscribe(
      (response) => {
        this.events = response.data
        this.meta = response.meta
        this.totalItems = response.meta.total_elements
      },
      (error) => {
        console.log(error)
      }
    )
  }

  loadEvent(id: string) {
    this.eventService.getEvent(+id).subscribe(
      (event: any) => {
        this.event = event;
        this.formEvent.patchValue({
          name: event.name,
          description: event.description,
          date: this.formatDateForInput(event.date),
          careerId: event.career?.id || ''
        });
      },
      error => {
        MyAlert.alert('Error al cargar el evento', true);
      }
    );
  }

  formatDateForInput(date?: Date): string {
    if (!date) return '';

    const d = typeof date === 'string' ? new Date(date) : date;

    const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
  }

  getCareers() {
    this.careerService.getCareer().subscribe(
      (response:any) => {
        this.careers = response.body
      }
    )
  }

  getEventsFiltred() {
    this.eventService.getEventsByCareer(+this.selectedCareerId || 0).subscribe(
      (response:any) => {
        this.events = response
      }
    )
  }

  getEvent(id: number){
    this.eventService.getEvent(id).subscribe(
      (response) => {
        this.event = response
      },
      (error) => {
        console.log(error)
      }
    )
  }

  onPageChange(page: number) {
    this.page = +page
    this.listEvents(+page)
  }

  filterByCareer(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCareerId = selectElement.value;
    this.page = 1; // Reiniciar a la primera página al filtrar
    if (selectElement.value === '') {
      this.listEvents()
    } else {
      this.getEventsFiltred()
    }
  }

  async createOrEdit(form, id?: number){
    if(this.formEvent.invalid) return this.formEvent.markAllAsTouched()
    try {
      // La fecha del formulario ya está en UTC, no necesitamos convertirla
      const utcDate = new Date(form.date);

      const eventPayload: EventPayload = {
        ...form,
        date: utcDate.toISOString() // Enviar la fecha en formato ISO en UTC
      };

      if(id){
        const data = await this.eventService.updateEvent(eventPayload, id).toPromise()
        if(data) {
          this.route.navigate([])
        }
      } else {
        const data = await this.eventService.createEvent(eventPayload).toPromise()
        if(data) {
          this.route.navigate([])
        }
      }
      MyAlert.alert(id? 'Evento actualizado' : 'Evento creado')
      this.listEvents()
    } catch (error) {
      console.error('error ', error)
      MyAlert.alert('Ocurrio un error', true)
    }
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
          if(name == 'evento'){
            this.eventService.deleteEvent(id).subscribe(
              (data) => {
                MyAlert.alert('Evento eliminado!')
                this.listEvents(this.meta.current_page)
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
