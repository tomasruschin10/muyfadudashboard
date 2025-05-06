import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ForumService } from './services/forum.services';
import { Thread, ThreadPayload } from 'src/app/shared/models/thread.model';
import { PayloadPost, Post } from 'src/app/shared/models/post.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MyAlert } from '../../shared/static-functions/myFunctions';
import { Career } from 'src/app/shared/models/career.model';
import { CareerService } from '../college-career/services/career.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
declare var $: any

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
  newThread: ThreadPayload = {
    name: '',
    description: '',
    is_published: false,
    career_id: null
  };
  isNewThreadPublic: boolean = true;
  selectedImage: File | null = null;
  selectedImageUrl: string | null = null;
  newThreadImageUrl: SafeUrl | null = null;
  newThreadImage: File | null = null;

  @ViewChild('threadImg') imagePreviewElement: ElementRef;

  constructor(
    private forumService: ForumService,
    private modalService: NgbModal,
    private careerService: CareerService,
    private sanitizer: DomSanitizer
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
      this.selectedImage = null;
      this.selectedImageUrl = null;
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
      const formData = new FormData();
      formData.append('name', this.selectedThread.name);
      formData.append('description', this.selectedThread.description || '');
      formData.append('is_published', this.selectedThread.is_published.toString());
      
      if (this.isThreadPublic) {
        formData.append('career_id', '');
      } else if (this.selectedThread.career) {
        formData.append('career_id', this.selectedThread.career.id.toString());
      }

      // Manejo de la imagen
      if (this.selectedImage) {
        // Si hay una nueva imagen seleccionada
        formData.append('image', this.selectedImage, this.selectedImage.name);
      } else if (this.selectedThread.image && this.selectedThread.image.id) {
        // Si no hay nueva imagen pero existe una imagen previa
        formData.append('image_id', this.selectedThread.image.id.toString());
      } else {
        // Si no hay imagen nueva ni previa
        formData.append('image_id', '');
      }

      this.forumService.updateThread(formData, this.selectedThread.id).subscribe(
        (updatedThread) => {
          this.getThreads();
          MyAlert.alert('Tema actualizado con éxito');
          this.modalService.dismissAll();
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

  openCreateThreadModal(content: any) {
    // Resetear las propiedades de la nueva imagen
    this.newThreadImageUrl = null;
    this.newThreadImage = null;
    
    this.modalService.open(content, {ariaLabelledBy: 'createThreadModalLabel'});
  }

  onNewThreadPublicChange() {
    if (this.isNewThreadPublic) {
      this.newThread.career_id = null;
    }
  }

  createThread() {
    const formData = new FormData();
    formData.append('name', this.newThread.name);
    formData.append('description', this.newThread.description || '');
    formData.append('is_published', this.newThread.is_published.toString());
    if (this.newThread.career_id) {
      formData.append('career_id', this.newThread?.career_id.toString());
    }
    if (this.newThreadImage) {
      formData.append('image', this.newThreadImage, this.newThreadImage.name);
    }

    this.forumService.createThread(formData).subscribe(
      (response) => {
        this.getThreads();
        this.modalService.dismissAll();
        MyAlert.alert('Tema creado con éxito');
        // Reiniciar el formulario
        this.newThread = {
          name: '',
          description: '',
          is_published: false,
          career_id: null
        };
        this.isNewThreadPublic = true;
        this.newThreadImageUrl = null;
        this.newThreadImage = null;
      },
      (error) => {
        MyAlert.alert('Error al crear el tema', true);
      }
    );
  }

  onImageSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      this.selectedImage = file;
      
      // Crear URL para la vista previa
      const imageUrl = URL.createObjectURL(file);
      this.selectedImageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl) as string;
      
      // Si estás usando un FormGroup, puedes actualizar el control así:
      // this.threadForm.patchValue({image: file});
      
      // Actualizar la vista previa de la imagen
      this.updateImagePreview();
    }
  }

  onNewThreadImageSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      this.newThreadImage = file;
      
      // Crear URL para la vista previa
      const imageUrl = URL.createObjectURL(file);
      this.newThreadImageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
  }

  private updateImagePreview(): void {
    // Si estás usando ViewChild
    if (this.imagePreviewElement) {
      this.imagePreviewElement.nativeElement.src = this.selectedImageUrl;
    } else {
      // Fallback a jQuery si es necesario
      setTimeout(() => {
        $('#threadImg').attr('src', this.selectedImageUrl);
      }, 10);
    }
  }
  
}