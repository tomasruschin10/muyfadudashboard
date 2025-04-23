import { Component, OnInit } from '@angular/core';
import { ForumService } from './services/forum.services';
import { Thread, ThreadPayload } from 'src/app/shared/models/thread.model';
import { PayloadPost, Post } from 'src/app/shared/models/post.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MyAlert } from '../../shared/static-functions/myFunctions';
import { Career } from 'src/app/shared/models/career.model';
import { CareerService } from '../college-career/services/career.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  threads: Thread[] = []
  posts: Post[] = []
  careers: Career[] = [];
  selectedView: 'posts' | 'threads' = 'threads'
  selectedThread: Thread | null = null
  selectedPost: Post | null = null
  pageSize = 10
  page = 1
  totalItems = 0
  isEditing: boolean = false
  isThreadPublic: boolean = true;

  constructor(
    private forumService: ForumService,
    private modalService: NgbModal,
    private careerService: CareerService
  ) {}

  ngOnInit(): void {
    this.getThreads()
    this.getCareers()
  }

  getPosts() {
    this.forumService.getAllPosts(this.page, this.pageSize, true).subscribe(
      (response) => {
        this.posts = response.data
        this.totalItems = response.meta.total_elements
      },
      (error) => {
        console.log(error)
      }
    )
  }

  getThreads() {
    this.forumService.getAllThreads(this.page, this.pageSize, true).subscribe(
      (response) => {
        this.threads = response.data
        this.totalItems = response.meta.total_elements
      },
      (error) => {
        console.log(error)
      }
    )
  }

  getCareers() {
    this.careerService.getCareer().subscribe(
      (response:any) => {
        this.careers = response.body
      }
    )
  }

  selectView(view: 'posts' | 'threads') {
    this.selectedView = view
    this.selectedThread = null
    this.selectedPost = null
    this.page = 1
    if (view === 'threads') {
      this.getThreads()
    } else {
      this.getPosts()
    }
  }

  changePage(newPage: number) {
    if (newPage > 0 && newPage <= Math.ceil(this.totalItems / this.pageSize)) {
      this.page = newPage;
      if (this.selectedView === 'threads') {
        this.getThreads();
      } else {
        this.getPosts();
      }
    }
  }

  changeThreadStatus(threadId: number) {
    this.forumService.toggleThreadStatus(threadId).subscribe(
      (response) => {
        this.getThreads();
      },
      (error) => {
        console.log(error)
      }
    )
  }

  changePostStatus(postId: number) {
    this.forumService.togglePostStatus(postId).subscribe(
      (response) => {
        this.getPosts();
      },
      (error) => {
        console.log(error)
      }
    )
  }

  openDetailsModal(content: any, item: Thread | Post): void {
    if ('name' in item) {
      this.selectedThread = { ...item };
      this.isThreadPublic = !Boolean(this.selectedThread.career);
      this.selectedPost = null;
    } else {
      this.selectedPost = { ...item };
      this.selectedThread = null;
    }
    this.isEditing = false;
    this.modalService.open(content, { size: 'lg' });
  }

  toggleEditing(): void {
    this.isEditing = !this.isEditing;
  }

  onThreadPublicChange() {
    if (this.isThreadPublic) {
      this.selectedThread!.career = null;
    }
  }

  saveThread(): void {
    if (this.selectedThread) {
      const payload:ThreadPayload = {
        name: this.selectedThread.name,
        description: this.selectedThread.description,
        is_published: this.selectedThread.is_published,
        career_id: this.isThreadPublic ? null : 
          this.selectedThread.career 
            ? this.selectedThread.career.id
            : null
      };

      this.forumService.updateThread(payload, this.selectedThread.id).subscribe(
        (updatedThread) => {
          this.getThreads()
          MyAlert.alert('Tema actualizado con éxito');
        },
        (error) => {
          MyAlert.alert('Error al actualizar el hilo', true);
        }
      );
    }
  }

  savePost(): void {
    if (this.selectedPost) {
      const payload: PayloadPost = {
        title: this.selectedPost.title,
        content: this.selectedPost.content,
        is_published: this.selectedPost.is_published,
        thread_id: this.selectedPost.thread_id,
        user_id: this.selectedPost.user_id,
        is_deleted: this.selectedPost.is_deleted
      };

      this.forumService.updatePost(payload, this.selectedPost.id).subscribe(
        (updatedPost) => {
          this.getPosts();
          this.isEditing = false;
          this.modalService.dismissAll();
          MyAlert.alert('Publicación actualizada con éxito');
        },
        (error) => {
          MyAlert.alert('Error al actualizar la publicación', true);
        }
      );
    }
  }

}
