import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  BASE_URL: string

  constructor(private http: HttpClient) {
    this.BASE_URL = environment.API_URL
  }

  getCareer(){
    return this.http.get(`${this.BASE_URL}/career/all`, {
      observe: 'response'
    })
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

  getSubjectCategory(id){
    return this.http.get(`${this.BASE_URL}/subject-category/all/${id}`, {
      observe: 'response'
    })
  }
  postSubjectCategory(form){
    return this.http.post(`${this.BASE_URL}/subject-category/create`, form, {
      observe: 'response'
    })
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

}
