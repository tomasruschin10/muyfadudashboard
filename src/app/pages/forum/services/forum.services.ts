import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedEp } from 'src/app/shared/models/response.model';
import { Thread } from 'src/app/shared/models/thread.model';
import { Post } from 'src/app/shared/models/post.model';

@Injectable({
  providedIn: 'root'
})

export class ForumService {
    BASE_URL: string
    constructor(private http: HttpClient) {
      this.BASE_URL = environment.API_URL
    }

    getAllThreads(page:number, per_page:number, showUnpublished:boolean): Observable<PaginatedEp<Thread[]>> {
      return this.http.get<PaginatedEp<Thread[]>>(`${this.BASE_URL}/threads?page=${page}&per_page=${per_page}&showUnpublished=${showUnpublished}`).pipe(
        map(response => response || null)
      )
    }

    getAllPosts(page:number, per_page:number, showUnpublished:boolean) {
      return this.http.get<PaginatedEp<Post[]>>(`${this.BASE_URL}/posts/all?page=${page}&per_page=${per_page}&showUnpublished=${showUnpublished}`).pipe(
        map(response => response || null)
      )
    }

    toggleThreadStatus(threadId: number,): Observable<Thread | null> {
      return this.http.put<Thread>(`${this.BASE_URL}/threads/${threadId}/toggle-publish`, {}).pipe(
        map(response => response || null)
      )
    }

    togglePostStatus(postId: number,): Observable<Post | null> {
      return this.http.put<Post>(`${this.BASE_URL}/posts/${postId}/toggle-publish`, {}).pipe(
        map(response => response || null)
      )
    }

    getPostById(postId: number): Observable<Post | null> {
      return this.http.get<Post>(`${this.BASE_URL}/posts/${postId}`).pipe(
        map(response => response || null)
      )
    }

    getThreadById(threadId: number): Observable<Thread | null> {
      return this.http.get<Thread>(`${this.BASE_URL}/threads/${threadId}`).pipe(
        map(response => response || null)
      )
    }
}
