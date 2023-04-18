import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  BASE_URL: string

  constructor(private http: HttpClient) { 
    this.BASE_URL = environment.API_URL
  }

  getOffers(){
    return this.http.get(`${this.BASE_URL}/offer/all`, {
      observe: 'response'
    })
  }
  getByIdOffer(id){
    return this.http.get(`${this.BASE_URL}/offer/${id}`, {
      observe: 'response'
    })
  }
  getOffersWork(){
    return this.http.get(`${this.BASE_URL}/offer/all/work`, {
      observe: 'response'
    })
  }
  getOffersCourse(){
    return this.http.get(`${this.BASE_URL}/offer/all/course`, {
      observe: 'response'
    })
  }
  postOffers(form){
    return this.http.post(`${this.BASE_URL}/offer/create`, form, {
      observe: 'response'
    })
  }
  putOffers(form, id){
    return this.http.put(`${this.BASE_URL}/offer/update/${id}`, form, {
      observe: 'response'
    })
  }
  deleteOffers(id){
    return this.http.delete(`${this.BASE_URL}/offer/delete/${id}`, {
      observe: 'response'
    })
  }

  getPartner(){
    return this.http.get(`${this.BASE_URL}/partner/all`, {
      observe: 'response'
    })
  }
  postPartner(form){
    return this.http.post(`${this.BASE_URL}/partner/create`, form, {
      observe: 'response'
    })
  }
  deletePartner(id){
    return this.http.delete(`${this.BASE_URL}/partner/delete/${id}`, {
      observe: 'response'
    })
  }

  getCategories(){
    return this.http.get(`${this.BASE_URL}/offer-category/all`, {
      observe: 'response'
    })
  }
  postCategories(form){
    return this.http.post(`${this.BASE_URL}/offer-category/create`, form, {
      observe: 'response'
    })
  }
  deleteCategories(id){
    return this.http.delete(`${this.BASE_URL}/offer-category/delete/${id}`, {
      observe: 'response'
    })
  }
}
