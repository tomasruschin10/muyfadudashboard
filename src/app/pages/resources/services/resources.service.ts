import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  BASE_URL: string

  constructor(private http: HttpClient) { 
    this.BASE_URL = environment.API_URL
  }

  getResources(){
    return this.http.get(`${this.BASE_URL}/resource/all`, {
      observe: 'response'
    })
  }
  postResources(form){
    return this.http.post(`${this.BASE_URL}/resource/create`, form, {
      observe: 'response'
    })
  }
  putResources(form, id){
    return this.http.put(`${this.BASE_URL}/resource/update/${id}`, form, {
      observe: 'response'
    })
  }
  deleteResources(id){
    return this.http.delete(`${this.BASE_URL}/resource/delete/${id}`, {
      observe: 'response'
    })
  }

  getResourceCategory(){
    return this.http.get(`${this.BASE_URL}/resource-category/all`, {
      observe: 'response'
    })
  }
  postResourceCategory(form){
    return this.http.post(`${this.BASE_URL}/resource-category/create`, form, {
      observe: 'response'
    })
  }
  deleteResourceCategory(id){
    return this.http.delete(`${this.BASE_URL}/resource-category/delete/${id}`, {
      observe: 'response'
    })
  }

  changeApprovedStatus(id){
    return this.http.patch(`${this.BASE_URL}/resource/${id}/change-approved-status`, {
      observe: 'response'
    })
  }
}
