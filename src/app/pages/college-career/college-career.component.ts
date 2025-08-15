import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { Career } from 'src/app/shared/models/career.model';
import { FacultyFilterService } from 'src/app/shared/services/faculty-filter.service';
import { CareerService } from './services/career.service';
import Swal from 'sweetalert2';
import { SubjectCategory, SubjectCategoryPayload } from 'src/app/shared/models/subject-category.model';

@Component({
  selector: 'app-college-career',
  templateUrl: './college-career.component.html',
  styleUrls: ['./college-career.component.scss']
})
export class CollegeCareerComponent implements OnInit {
  @ViewChild('careerModal') careerModal: any;
  
  careers: Career[] = [];
  page = 1;
  loading = false;
  error = '';
  
  careerForm: FormGroup;
  selectedImageUrl: string | null = null;
  editMode = false;
  careerId: number | null = null;

  facultyId: null | number = null;
  subjectCategories: SubjectCategory[] = []

  constructor(
    private careerService: CareerService,
    private facultyFilterService: FacultyFilterService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.careerForm = this.fb.group({
      name: ['', Validators.required],
      descriptionUrl: [''],
      image: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCareers();
    
    // Escuchar cambios en los parámetros de consulta para la edición
    this.route.queryParams.subscribe(params => {
      if (params['edit']) {
        const id = +params['edit'];
        if (!isNaN(id)) {
          this.editMode = true;
          this.careerId = id;
          this.loadCareerDetails(id);
          this.loadSubjectCategories(id)
          this.loadFacultyId()
        }
      } else {
        this.editMode = false;
        this.careerId = null;
      }
    });

    
  }

  loadCareers(): void {
    this.loading = true;
    
    this.careerService.getCareer().subscribe({
      next: (data) => {
        this.careers = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las carreras';
        this.loading = false;
        MyAlert.alert('Error al cargar las carreras', true);
        console.error('Error al cargar las carreras:', error);
      },
    });
  }

  loadSubjectCategories(careerId:number) {
    if (!careerId) return;
    this.careerService.getSubjectCategory(careerId).subscribe(
      (data) => {
        this.subjectCategories = data || []
      }
    )
  }

  loadFacultyId() {
    this.facultyId = this.facultyFilterService.getCurrentFaculty()?.id || null
  }

  loadCareerDetails(careerId: number): void {
    this.loading = true;
    this.careerService.getCareerById(careerId).subscribe({
      next: (career) => {
        this.careerForm.patchValue({
          name: career.name,
          descriptionUrl: career.description_url || ''
        });
        
        // Si la carrera tiene una imagen, mostrarla
        if (career.image && career.image.url) {
          this.selectedImageUrl = career.image.url;
          // No requerimos una nueva imagen si ya existe una
          this.careerForm.get('image')?.clearValidators();
          this.careerForm.get('image')?.updateValueAndValidity();
        }
        
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        MyAlert.alert('Error al cargar los datos de la carrera', true);
        console.error('Error al cargar los datos de la carrera:', error);
        this.clearEditMode();
      }
    });
  }

  openCareerModal(): void {
    this.careerForm.reset();
    this.selectedImageUrl = null;
    this.modalService.open(this.careerModal, { centered: true });
  }

  closeCareerModal() {
    this.modalService.dismissAll();
  }

  editCareer(careerId: number): void {
    // Navegar a la misma página pero con el parámetro de consulta edit
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { edit: careerId },
      queryParamsHandling: 'merge'
    });
  }

  clearEditMode(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: ''
    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        MyAlert.alert('El archivo seleccionado no es una imagen válida', true);
        return;
      }

      this.careerForm.patchValue({
        image: file
      });
      this.careerForm.get('image')?.markAsTouched();
      
      // Vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  createCareer(): void {
    if (this.careerForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.careerForm.controls).forEach(key => {
        this.careerForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', this.careerForm.get('name')?.value);
    
    const descriptionUrl = this.careerForm.get('descriptionUrl')?.value;
    if (descriptionUrl) {
      formData.append('description_url', descriptionUrl);
    }
    
    const imageFile = this.careerForm.get('image')?.value;
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const facultyId = this.facultyFilterService.getCurrentFaculty()?.id;
    if (!facultyId) {
      MyAlert.alert('Debe seleccionar una facultad para crear una carrera', true);
      return;
    }
    
    formData.append('faculty_id', facultyId.toString());

    this.loading = true;
    this.careerService.postCareer(formData).subscribe({
      next: (response) => {
        MyAlert.alert('Carrera creada con éxito');
        this.loadCareers();
        this.modalService.dismissAll();
        this.loading = false;
      },
      error: (error) => {
        MyAlert.alert('Error al crear la carrera', true);
        console.error('Error al crear la carrera:', error);
        this.loading = false;
      }
    });
  }

  updateCareer(): void {
    if (this.careerForm.invalid || !this.careerId) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.careerForm.controls).forEach(key => {
        this.careerForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', this.careerForm.get('name')?.value);
    
    const descriptionUrl = this.careerForm.get('descriptionUrl')?.value;
    if (descriptionUrl) {
      formData.append('description_url', descriptionUrl);
    }
    
    const imageFile = this.careerForm.get('image')?.value;
    if (imageFile && typeof imageFile !== 'string') {
      formData.append('image', imageFile);
    }

    this.loading = true;
    this.careerService.putCareer(formData, this.careerId).subscribe({
      next: (response) => {
        MyAlert.alert('Carrera actualizada con éxito');
        this.loadCareers();
        this.clearEditMode();
        this.loading = false;
      },
      error: (error) => {
        MyAlert.alert('Error al actualizar la carrera', true);
        console.error('Error al actualizar la carrera:', error);
        this.loading = false;
      }
    });
  }

  delete(id: number, index: number): void {
    Swal.fire({
      position: 'center',
      text: '¿Seguro que desea eliminar esta carrera?',
      width: 350,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Eliminar',
      reverseButtons: true,
      customClass: {
        actions: 'mt-1',
        confirmButton: 'btn-danger'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.careerService.deleteCareer(id).subscribe({
          next: () => {
            this.careers.splice(index, 1);
            MyAlert.alert('Carrera eliminada con éxito');
          },
          error: (error) => {
            MyAlert.alert('Error al eliminar la carrera', true);
            console.error('Error al eliminar la carrera:', error);
          }
        });
      }
    });
  }

  reloadCategories() {
    if (!this.careerId) return;
    this.loadSubjectCategories(this.careerId)
  }

  createCategory(payload:SubjectCategoryPayload) {
    this.loading = true
    this.careerService.createSubjectCategory(payload).subscribe(
      () => {
        if (!this.careerId) return 
        this.loadSubjectCategories(this.careerId)
        this.loading = false
      },
      (error) => {
        console.error(error)
        MyAlert.alert('ocurrio un error al crear el nivel', true)
        this.loading = false
      }
    )
  }

  deleteCategory(id:number) {
    this.loading = true
    this.careerService.deleteSubjectCategory(id).subscribe(
      () => {
        if (!this.careerId) return 
        this.loadSubjectCategories(this.careerId)
        this.loading = false
      },
      (error) => {
        console.error(error)
        MyAlert.alert('ocurrio un error al crear el nivel', true)
        this.loading = false
      }
    )
  }
}