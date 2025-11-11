import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Career } from 'src/app/shared/models/career.model';
import { map } from 'rxjs/operators';
import { SubjectCategory, SubjectCategoryPayload } from 'src/app/shared/models/subject-category.model';
import { Subject, SubjectPayload } from 'src/app/shared/models/subject.model';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  BASE_URL: string

  constructor(private http: HttpClient) {
    this.BASE_URL = environment.API_URL
  }

  getCareer(): Observable<Career[]>{
    return this.http.get<Career[]>(`${this.BASE_URL}/career/all`).pipe(
      map(response => response || null)
    )
  }

  getCareerById(id:number): Observable<Career>{
    return this.http.get<Career>(`${this.BASE_URL}/career/${id}`).pipe(
      map(response => response || null)
    )
  }
  postCareer(form){
    return this.http.post(`${this.BASE_URL}/career/create`, form,{
      observe: 'response'
    })
  }
  putCareer(form, id){
    return this.http.put(`${this.BASE_URL}/career/update/${id}`, form,{
      observe: 'response'
    })
  }
  deleteCareer(id){
    return this.http.delete(`${this.BASE_URL}/career/delete/${id}`, {
      observe: 'response'
    })
  }

  getSubject(){
    return this.http.get(`${this.BASE_URL}/subject/all`, {
      observe: 'response'
    })
  }
  postSubject(form){
    return this.http.post(`${this.BASE_URL}/subject/create`, form, {
      observe: 'response'
    })
  }
  putSubject(form){
    return this.http.put(`${this.BASE_URL}/subject/update`, form, {
      observe: 'response'
    })
  }
  deleteSubject(id){
    return this.http.delete(`${this.BASE_URL}/subject/delete/${id}`, {
      observe: 'response'
    })
  }

  getSubjectCategory(careerId:number){
    return this.http.get<SubjectCategory[]>(`${this.BASE_URL}/subject-category/all/${careerId}`).pipe(
      map(response => response || []) 
    )
  }
  createSubjectCategory(payload: SubjectCategoryPayload){
    return this.http.post<SubjectCategory>(`${this.BASE_URL}/subject-category/create`, payload).pipe(
      map(response => response || null)
    )
  }
  putSubjectCategory(form, id){
    return this.http.put(`${this.BASE_URL}/subject-category/update/${id}`, form, {
      observe: 'response'
    })
  }
  deleteSubjectCategory(id){
    return this.http.delete(`${this.BASE_URL}/subject-category/delete/${id}`, {
      observe: 'response'
    })
  }

  createManySubjects(subjects:SubjectPayload[]){
    return this.http.post<SubjectCategory[]>(`${this.BASE_URL}/subject/createMany`, {
      data: subjects
    }).pipe(
      map(response => response || [])
    )
  }

  getSubjectsByCareer(careerId:number){
    return this.http.get<Subject[]>(`${this.BASE_URL}/subject/career/${careerId}`).pipe(
      map(response => response || [])
    )
  }

  editSubject(subject: SubjectPayload, id:number){
    return this.http.put(`${this.BASE_URL}/subject/update/${id}`, subject, {
      observe: 'response'
    })
  }

}
