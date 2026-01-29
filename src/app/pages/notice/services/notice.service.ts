import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  BASE_URL: string

  constructor(private http: HttpClient) { 
    this.BASE_URL = environment.API_URL
  }

  getNotice(facultyId?: number){
    let url = `${this.BASE_URL}/notice/all`;
    if (facultyId) {
      url += `?faculty_id=${facultyId}`;
    }
    return this.http.get(url, {
      observe: 'response'
    })
  }
  postNotice(form){
    return this.http.post(`${this.BASE_URL}/notice/create`, form, {
      observe: 'response'
    })
  }
  putNotice(form, id){
    return this.http.put(`${this.BASE_URL}/notice/update/${id}`, form,{
      observe: 'response'
    })
  }
  deleteNotice(id){
    return this.http.delete(`${this.BASE_URL}/notice/delete/${id}`, {
      observe: 'response'
    })
  }

}
