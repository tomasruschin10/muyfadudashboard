import { Component, OnInit } from '@angular/core';
import { OpinionsService } from './services/opinions.service';
import { Opinion, OpinionAnswer, Tag } from '../../shared/models/opinion.model';
import { CareerService } from '../college-career/services/career.service';
import { Career, Subject } from 'src/app/shared/models/career.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MyAlert } from '../../shared/static-functions/myFunctions';
declare const $:any

@Component({
  selector: 'app-opinions',
  templateUrl: './opinions.component.html',
  styleUrls: ['./opinions.component.scss']
})
export class OpinionsComponent implements OnInit {
  opinions: Opinion[] = []
  opinion: Opinion
  answers: OpinionAnswer[] = []
  tags: Tag[]
  tagsFilter: Tag[]
  tagsSelected: Tag[] = []
  tagsId: number[] = []
  subjects: Subject[]
  offset = 0
  showAlert:boolean = false
  form
  searchValue = ''
  selectSubjectValue
  carrers: Career[] = []

  constructor(
    private opinionSv: OpinionsService,
    private careerSv: CareerService,
    private spinnerSv: NgxSpinnerService,
    private route: Router,
    private routeActive: ActivatedRoute
  ) { 
    routeActive.queryParams.subscribe(data =>{
      this.form = data.form
      this.answers = []
      if(this.form) this.initFormOpinions()
    })
  }

  ngOnInit(): void {
    this.listOpinions('', '')
    this.listSubjects()
    this.listTags()
    this.getCarrers()
  }

  initFormOpinions(){
    if(this.opinions?.length > 0 && this.form != 'create' && this.form){
      this.opinionSv.getOpinionsAnswer(this.opinions[this.form].id).subscribe((answer:any) =>{
        this.answers = answer.body
      })
    }
  }

  listOpinions(subjectId, search){
    if(subjectId != '') subjectId = '&subject_id='+subjectId
    if(search != '') search = '&search='+search
    let arrTags = ''
    if(this.tagsId.length > 0) {
      for(let item of this.tagsId){
        arrTags = arrTags+'&tags[]='+item
      }
    }
    this.opinionSv.getOpinions(this.offset, 12, subjectId, arrTags, search).subscribe((data:any) =>{
      this.opinions = this.opinions.concat(data.body)
      if(this.form) this.initFormOpinions()
      if(data.body.length == 0){
        this.showAlert = true
        setTimeout(() => {
          this.showAlert = false
        }, 1100);
      }
      this.offset+=12
    })
  }

  delete(id, i){
    Swal.fire({
      position: 'center',
      text: '¿Seguro que desea eliminar esta opinion?',
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
        this.opinionSv.deleteOpinion(id).subscribe(data =>{
          this.opinions.splice(i, 1)
          MyAlert.alert('Opinion eliminada!')
        })
      }
    })
  }

  filterSubjects(subjectId, search){
    this.opinions = []
    this.offset = 0
    this.answers = []
    this.selectSubjectValue = subjectId
    this.searchValue = search
    this.listOpinions(subjectId, search)
  }

  filterList(item?){
    this.tags = this.tagsFilter.filter( newList =>{
      return newList.name.toUpperCase().includes(item ? item.name?.toUpperCase() : $('#listTags').val()?.toUpperCase())
      && !this.tagsId.includes(newList.id)
    })
    setTimeout(() => {
      if(item){
        $('#listTags').val('')
        this.tagsSelected.push(item)
        this.tagsId.push(item.id)
      }
    }, 10);
  }

  listSubjects(){
    this.careerSv.getSubject().subscribe((data:any) =>{
      this.subjects = data.body
    })
  }

  getCarrers(){
    this.careerSv.getCareer().subscribe(
      (res:any) => {
        if (res.body) {
          this.carrers = res.body
        }
      },
      (err) => {
        
      }
    )
  }

  getCareerName(careerId: number): string {
    const career = this.carrers.find(c => c.id === careerId);
    return career ? career.name : 'No especificada';
  }

  listTags(){
    this.opinionSv.getTags().subscribe((data:any) =>{
      this.tags = data.body
      this.tags.sort((a, b) =>{
        if(a.name.toUpperCase() > b.name.toUpperCase()){
          return 1
        }else if(a.name.toUpperCase() < b.name.toUpperCase()){
          return -1
        }
        return 0
      })
      this.tagsFilter = this.tags
    })
  }

  createAnswer(input, i){
    const form = {
      description: input.value,
      opinion_id: this.opinions[i].id
    }
    this.opinionSv.postOpinionsAnswer(form).toPromise().then((data: any) =>{
      this.answers.push(data.body)
      input.value = ''
    }).catch(error =>{
      return 
    })
  }
}
