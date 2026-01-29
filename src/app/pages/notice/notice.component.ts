import { Component, OnInit } from '@angular/core';
import { FacultyFilterService } from 'src/app/shared/services/faculty-filter.service';
import { Faculty } from 'src/app/shared/models/faculty.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NoticeService } from './services/notice.service';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { Notice } from '../../shared/models/notice.model';
import { CreateFile } from '../../shared/static-functions/myFunctions';
import { PromotionService } from '../promotions/services/promotions.service';
import { Promotion } from 'src/app/shared/models/promotion.model';
declare const $:any

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {
  news: Notice[] = []
  formNotice: FormGroup
  form
  newId: number | null
  page: number = 1
  promotions: Promotion[] = []

  selectedFaculty: Faculty | null = null;
  facultySubscription: any;
  constructor(
    private noticeSv: NoticeService,
    private route: Router,
    private routeActive: ActivatedRoute,
    private promotionSv: PromotionService,
    private facultyFilterService: FacultyFilterService
  ) { 
    routeActive.queryParams.subscribe(data =>{
      this.form = data.form
      if(this.form) this.initFormNotice()
    })
  }

  ngOnInit(): void {
    this.listNotice();
    this.listPromotions();
    this.facultySubscription = this.facultyFilterService.getSelectedFaculty().subscribe(faculty => {
      this.selectedFaculty = faculty;
      this.listNotice();
    });
  }

  initFormNotice(){
    this.newId = null
    this.formNotice = new FormGroup({
      name: new FormControl('', Validators.required),
      date_start: new FormControl('', Validators.required),
      date_end: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      promotion_id: new FormControl(null, ),
      url: new FormControl(null)
    })
    if(this.news?.length > 0 && this.form != 'create' && this.form){
      this.newId = this.news[this.form].id
      this.formNotice.patchValue({
        ...this.news[this.form], 
        date_start: this.news[this.form].date_start.toString().slice(0, 10),
        date_end: this.news[this.form].date_end.toString().slice(0, 10),
      })
      setTimeout(() => {
        $('#img').attr('src', this.news[this.form].image.url)
      }, 10);
    }
  }

  listNotice(){
    const facultyId = this.selectedFaculty ? this.selectedFaculty.id : undefined;
    this.noticeSv.getNotice(facultyId).subscribe((data:any) =>{
      this.news = data.body
      this.initFormNotice()
    })
  }

  listPromotions() {
    this.promotionSv.getAllPromotions().subscribe(
      (data) => {
        this.promotions = data
      }
    )
  }

  async createOrEdit(form, id){
    if(this.formNotice.invalid) return this.formNotice.markAllAsTouched()
    const formdata = new FormData
    for(let [item, value] of Object.entries(form)){
      formdata.append(item, value as any)
    }
    if (this.selectedFaculty && this.selectedFaculty.id) {
      formdata.append('faculty_id', this.selectedFaculty.id.toString());
    }
    try {
      if(id){
        const {body}:any = await this.noticeSv.putNotice(formdata, id).toPromise()
        this.news[this.form] = body
      }else{
        const {body}:any = await this.noticeSv.postNotice(formdata).toPromise()
        this.news.unshift(body)
      }
      this.route.navigate([])
      MyAlert.alert(id ? 'Noticia editada' : 'Noticia Creada')
    } catch (error:any) {
      MyAlert.alert(error.error.message, true)
    }
  }

  delete(id, i){
    Swal.fire({
      position: 'center',
      text: '¿Seguro que desea eliminar esta noticia?',
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
        this.noticeSv.deleteNotice(id).subscribe(data =>{
          this.news.splice(i, 1)
          MyAlert.alert('Noticia eliminada!')
        })
      }
    })
  }

  addImg(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const imgURL = URL.createObjectURL(file);
      this.formNotice.get('image')?.patchValue(file)
      setTimeout(() => {
        $('#img').attr('src', imgURL)
      }, 10);
    }
  }

  async copy(item){
    const img = await CreateFile.createFile(item.image.url)
    this.formNotice.patchValue({...item, image: img})
    this.createOrEdit(this.formNotice.value, null)
  }

}
