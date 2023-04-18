import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LostObjectService {

  constructor(private http: HttpClient) { }

  getLostObjects(){
    return this.http.get(`${environment.API_URL}/lost-object/all`, {
      observe: 'response'
    })
  }
  postLostObject(form){
    return this.http.post(`${environment.API_URL}/lost-object/create`, form, {
      observe: 'response'
    })
  }
  putLostObject(form, id){
    return this.http.put(`${environment.API_URL}/lost-object/update/${id}`, form, {
      observe: 'response'
    })
  }
  deleteLostObject(id){
    return this.http.delete(`${environment.API_URL}/lost-object/delete/${id}`, {
      observe: 'response'
    })
  }

}
