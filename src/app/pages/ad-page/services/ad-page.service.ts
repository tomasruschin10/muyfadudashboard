import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdPageService {
    BASE_URL: string
    constructor(private http: HttpClient) {
      this.BASE_URL = environment.API_URL
    }
    getAdvertisement(){
      return this.http.get(`${this.BASE_URL}/advertisement/all`, {
        observe: 'response'
      })
    }
    postAdvertisement(form){
    console.log(form)
      return this.http.post(`${this.BASE_URL}/advertisement/create`, form, {
        observe: 'response'
      })
    }
    putAdvertisement(form, id){
      return this.http.put(`${this.BASE_URL}/advertisement/update/${id}`, form, {
      observe: 'response'
      })
    }
  deleteAdvertisement(id){
    return this.http.delete(`${this.BASE_URL}/advertisement/delete/${id}`, {
      observe: 'response'
    })
  }
}
