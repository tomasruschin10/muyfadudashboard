import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpinionsService {
  BASE_URL: string

  constructor(private http: HttpClient) { 
    this.BASE_URL = environment.API_URL
  }

  getOpinions(offset, limit, subject_id, tagsId, search){
    return this.http.get(`${this.BASE_URL}/opinion/all?offset=${offset}&limit=${limit}${subject_id}${tagsId}${search}`, {
      observe: 'response'
    })
  }
  deleteOpinion(id){
    return this.http.delete(`${this.BASE_URL}/opinion/delete/${id}`, {
      observe: 'response'
    })
  }

  getOpinionsAnswer(id){
    return this.http.get(`${this.BASE_URL}/opinion-answer/all?opinion_id=${id}`, {
      observe: 'response'
    })
  }
  postOpinionsAnswer(form){
    return this.http.post(`${this.BASE_URL}/opinion-answer/create`, form, {
      observe: 'response'
    })
  }

  getTags(){
    return this.http.get(`${this.BASE_URL}/tag/all`, {
      observe: 'response'
    })
  }

}
