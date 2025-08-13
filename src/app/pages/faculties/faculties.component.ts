import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { FacultiesService } from './services/faculties.service';
import { Faculty } from 'src/app/shared/models/faculty.model';

@Component({
  selector: 'app-faculties',
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.scss']
})
export class FacultiesComponent implements OnInit {
  faculties: Faculty[] = [];
  facultyForm: FormGroup;
  currentFaculty: any = {};
  selectedImageUrl: string | null = null;
  selectedImageFile: File | null = null;
  formSubmitted = false;
  
  @ViewChild('facultyModal') facultyModalElement: ElementRef;
  private facultyModal: Modal;

  constructor(
    private fb: FormBuilder,
    private service: FacultiesService
  ) {
    this.facultyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      // Cambiamos el validador para que no sea requerido en modo edición
      image: [null]
    });
  }

  ngOnInit(): void {
    this.loadFaculties();
  }

  ngAfterViewInit() {
    this.facultyModal = new Modal(this.facultyModalElement.nativeElement);
  }

  loadFaculties() {
    this.service.getAll().subscribe(
      (data) => {
        this.faculties = data;
      }
    );
  }

  openFacultyModal(faculty?: any) {
    this.formSubmitted = false;
    
    // Resetear el formulario y configurar validadores según el modo
    this.facultyForm.reset();
    
    if (faculty) {
      // Modo edición
      this.currentFaculty = { ...faculty };
      
      // En modo edición, la imagen no es requerida si ya existe
      if (faculty.image) {
        this.facultyForm.get('image')?.clearValidators();
        this.facultyForm.get('image')?.updateValueAndValidity();
      } else {
        this.facultyForm.get('image')?.setValidators([Validators.required]);
        this.facultyForm.get('image')?.updateValueAndValidity();
      }
      
      // Asignar valores al formulario
      this.facultyForm.patchValue({
        title: faculty.title,
        description: faculty.description
      });
      
      // Manejar la imagen
      this.selectedImageUrl = faculty.image?.url || null;
      this.selectedImageFile = null;
    } else {
      // Modo creación
      this.currentFaculty = {};
      this.selectedImageUrl = null;
      this.selectedImageFile = null;
      
      // En modo creación, la imagen siempre es requerida
      this.facultyForm.get('image')?.setValidators([Validators.required]);
      this.facultyForm.get('image')?.updateValueAndValidity();
    }
    
    // Mostrar el modal
    setTimeout(() => {
      this.facultyModal.show();
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      
      // Crear una URL para previsualizar la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageUrl = e.target.result;
        
        // Marcar el campo como válido
        this.facultyForm.get('image')?.setValue('valid');
        this.facultyForm.get('image')?.markAsTouched();
      };
      reader.readAsDataURL(file);
    }
  }

  saveFaculty() {
    this.formSubmitted = true;
    
    if (this.facultyForm.invalid) {
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.facultyForm.controls).forEach(key => {
        const control = this.facultyForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    // Crear un objeto FormData para enviar los datos
    const formData = new FormData();
    formData.append('title', this.facultyForm.get('title')?.value);
    formData.append('description', this.facultyForm.get('description')?.value);
    
    if (this.currentFaculty.id) {
      formData.append('id', this.currentFaculty.id.toString());
    }

    // Manejar la imagen según el caso
    if (this.selectedImageFile) {
      // Si hay una nueva imagen seleccionada, la añadimos al FormData
      formData.append('image', this.selectedImageFile, this.selectedImageFile.name);
    } else if (this.currentFaculty.id && !this.selectedImageFile && !this.currentFaculty.image) {
      // Si estamos editando, no hay imagen nueva y tampoco había imagen previa
      // Verificamos si el campo es requerido usando validators
      const imageControl = this.facultyForm.get('image');
      if (imageControl?.validator) {
        const validator = imageControl.validator({} as any);
        if (validator && validator['required']) {
          imageControl.setErrors({ required: true });
          return;
        }
      }
    }
    // Si estamos editando y no se cambió la imagen, no enviamos nada relacionado con la imagen

    this.saveFacultyData(formData);
  }

  saveFacultyData(formData: FormData) {
    const facultyId = formData.get('id');
    if (facultyId) {
      // Actualizar facultad existente
      formData.delete('id'); // Quitar el campo id para que no se envíe al backend
      this.service.updateOne(+facultyId, formData).subscribe({
        next: () => {
          this.loadFaculties();
          this.facultyModal.hide();
        },
        error: (error) => {
          console.error('Error al actualizar la facultad:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      });
    } else {
      // Crear nueva facultad
      this.service.createOne(formData).subscribe({
        next: () => {
          this.loadFaculties();
          this.facultyModal.hide();
        },
        error: (error) => {
          console.error('Error al crear la facultad:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      });
    }
  }

  deleteFaculty(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta facultad?')) {
      this.service.deleteOne(+id).subscribe(() => {
        this.loadFaculties();
      });
    }
  }
}