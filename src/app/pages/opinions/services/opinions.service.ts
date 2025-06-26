import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Opinion } from 'src/app/shared/models/opinion.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OpinionsService {
  BASE_URL: string

  constructor(private http: HttpClient) { 
    this.BASE_URL = environment.API_URL
  }

  getOpinions(offset, limit, subject_id, tagsId, search, career_id, startDate?: string, endDate?: string){
    let params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString())

    if(career_id) {
      params = params.set('career_id', career_id);
    }
    if(subject_id) {
      params = params.set('subject_id', subject_id);
    }
    if (startDate && endDate) {
      params = params.set('startDate', startDate);
      params = params.set('endDate', endDate);
    }
    if(search) {
      params = params.set('search', search);
    }
    if(tagsId && Array.isArray(tagsId)) {
      tagsId.forEach(tagId => {
        params = params.append('tags[]', tagId.toString());
      });
    }
    return this.http.get(`${this.BASE_URL}/opinion/all`, {
      params,
      observe: 'response'
    })
  }

  getOpinionsForExport(subject_id, tagsId, search, career_id, startDate?: string, endDate?: string){
    let params = new HttpParams()

    if(career_id) {
      params = params.set('career_id', career_id);
    }
    if(subject_id) {
      params = params.set('subject_id', subject_id);
    }
    if (startDate && endDate) {
      params = params.set('startDate', startDate);
      params = params.set('endDate', endDate);
    }
    if(search) {
      params = params.set('search', search);
    }
    if(tagsId && Array.isArray(tagsId)) {
      tagsId.forEach(tagId => {
        params = params.append('tags[]', tagId.toString());
      });
    }
    return this.http.get<Opinion[]>(`${this.BASE_URL}/opinion/all/export`, { params }).pipe(
      map(response => response || null)
    )
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
