import { Component, OnInit } from '@angular/core';
import { ForumService } from './services/forum.services';
import { Thread } from 'src/app/shared/models/thread.model';
import { Post } from 'src/app/shared/models/post.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  threads: Thread[] = []
  posts: Post[] = []
  selectedView: 'posts' | 'threads' = 'threads'
  selectedThread: Thread | null = null
  selectedPost: Post | null = null
  pageSize = 10
  page = 1
  totalItems = 0

  constructor(
    private forumService: ForumService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getThreads()
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
      this.selectedThread = item;
      this.selectedPost = null;
    } else {
      this.selectedPost = item;
      this.selectedThread = null;
    }
    this.modalService.open(content, { size: 'lg' });
  }

}
