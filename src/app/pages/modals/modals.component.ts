import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { ModalsService } from './services/modals.service';
import { CareerService } from '../college-career/services/career.service';
import { Career } from 'src/app/shared/models/career.model';
import { IModal, PayloadModal } from 'src/app/shared/models/modal.model';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss']
})
export class ModalsComponent implements OnInit {
  careers: Career[] = [];
  allModals: IModal[] = [];
  displayedModals: IModal[] = [];
  currentModal: Partial<IModal> = {};
  modalForm: FormGroup;
  selectedImageUrl: string | ArrayBuffer | null = null;
  selectedImageFile: File | null = null;

  page = 1;
  pageSize = 10;
  totalItems = 0;

  displayFrequencies = [
    { value: 0, label: 'Siempre' },
    { value: 1, label: 'Una vez al día' },
    { value: 2, label: 'Una vez por semana' },
    { value: 3, label: 'Una vez al mes' }
  ];

  constructor(
    private modalService: NgbModal,
    private contentService: ModalsService,
    private careerService: CareerService,
    private fb: FormBuilder
  ) {
    this.modalForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      career_id: [''],
      date_start: ['', Validators.required],
      date_end: ['', Validators.required],
      link: [''],
      is_active: [false],
      display_frequency: [0, Validators.required],
      icon_type: [''],
    });
  }

  ngOnInit(): void {
    this.loadCareers();
    this.loadModals();
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = e => this.selectedImageUrl = e.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

  loadCareers() {
    this.careerService.getCareer().subscribe(
      (response: any) => {
        this.careers = response.body;
      },
      error => {
        console.error('Error loading careers:', error);
        MyAlert.alert('Error al cargar las carreras', true);
      }
    );
  }

  loadModals() {
    this.contentService.getAll().subscribe(
      (data: IModal[]) => {
        this.allModals = data;
        this.totalItems = this.allModals.length;
        this.updateDisplayedModals();
      },
      error => {
        console.error('Error loading modals:', error);
        MyAlert.alert('Error al cargar los modales', true);
      }
    );
  }

  updateDisplayedModals() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedModals = this.allModals.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.page = page;
    this.updateDisplayedModals();
  }

  openModal(content: any, modal?: IModal) {
    this.currentModal = modal || {};
    if (modal) {
      this.modalForm.patchValue(modal);
    } else {
      this.modalForm.reset({is_active: true});
      this.selectedImageUrl = null;
      this.selectedImageFile = null;
    }
    this.modalService.open(content, { size: 'lg' });
  }

  saveModal() {
    console.log(this.modalForm.get('is_active')?.value)
    if (this.modalForm.valid) {
      const formData = new FormData();
      Object.keys(this.modalForm.controls).forEach(key => {
        const control = this.modalForm.get(key);
        if (control) {
          if (key === 'is_active') {
            formData.append(key, control.value ? 'true' : 'false');
          } else if (control.value instanceof Date) {
            formData.append(key, control.value.toISOString());
          } else {
            formData.append(key, control.value);
          }
        }
      });
      //! image validation
      if (this.selectedImageFile) {
        formData.append('image', this.selectedImageFile);
      } else if (this.currentModal.image_id) {
        formData.append('image_id', this.currentModal.image_id.toString());
      }

      if (this.currentModal.id) {
        this.contentService.update(this.currentModal.id, formData).subscribe(
          () => {
            MyAlert.alert('Modal actualizado con &eacute;xito');
            this.loadModals();
            this.modalService.dismissAll();
          },
          error => {
            console.error('Error updating modal:', error);
            MyAlert.alert('Error al actualizar el modal', true);
          }
        );
      } else {
        this.contentService.create(formData).subscribe(
          () => {
            MyAlert.alert('Modal creado con &eacute;xito');
            this.loadModals();
            this.modalService.dismissAll();
          },
          error => {
            console.error('Error creating modal:', error);
            MyAlert.alert('Error al crear el modal', true);
          }
        );
      }
    }
  }

  deleteModal(id: number) {
    if (confirm('&#191;Est&aacute; seguro de que desea eliminar este modal?')) {
      this.contentService.delete(id).subscribe(
        () => {
          MyAlert.alert('Modal eliminado con &eacute;xito');
          this.loadModals();
        },
        error => {
          console.error('Error deleting modal:', error);
          MyAlert.alert('Error al eliminar el modal', true);
        }
      );
    }
  }

  getCareerName(careerId: number): string {
    const career = this.careers.find(c => c.id === careerId);
    return career ? career.name : 'N/A';
  }
}