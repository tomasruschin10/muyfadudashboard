
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubjectPayload } from 'src/app/shared/models/subject.model';

@Component({
  selector: 'app-subject-modal',
  templateUrl: './subject-modal.component.html',
  styleUrls: ['./subject-modal.component.scss']
})
export class SubjectModalComponent implements OnInit {
  @Input() categoryId: number;
  @Input() facultyId: number | null;
  
  subjectForm: FormGroup;
  subjects: SubjectPayload[] = [];
  
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      prefix: ['', Validators.required],
      label: ['Materia Regular', Validators.required],
      info: [''],
      chairs: this.fb.array([this.fb.control('')]),
      selective: [false],
      selectiveSubjects: this.fb.array([]),
      url: [''],
      subject_category_id: [this.categoryId],
      faculty_id: [this.facultyId],
      subjectParent: this.fb.array([])
    });
  }
  
  // Getters para acceder a los FormArrays
  get chairsArray(): FormArray {
    return this.subjectForm.get('chairs') as FormArray;
  }
  
  get selectiveSubjectsArray(): FormArray {
    return this.subjectForm.get('selectiveSubjects') as FormArray;
  }
  
  // Métodos para manejar las cátedras (profesores)
  addChair(): void {
    this.chairsArray.push(this.fb.control(''));
  }
  
  removeChair(index: number): void {
    if (this.chairsArray.length > 1) {
      this.chairsArray.removeAt(index);
    }
  }
  
  // Métodos para manejar materias selectivas
  onSelectiveChange(event: any): void {
    const isSelective = event.target.checked;
    
    if (isSelective && this.selectiveSubjectsArray.length === 0) {
      this.addSelectiveSubject();
    } else if (!isSelective) {
      while (this.selectiveSubjectsArray.length > 0) {
        this.selectiveSubjectsArray.removeAt(0);
      }
    }
  }
  
  addSelectiveSubject(): void {
    this.selectiveSubjectsArray.push(this.fb.control(''));
  }
  
  removeSelectiveSubject(index: number): void {
    this.selectiveSubjectsArray.removeAt(index);
  }
  
  // Métodos para manejar la lista de materias
  addSubject(): void {
    if (this.subjectForm.valid) {
      // Crear una copia del valor del formulario
      const subject: SubjectPayload = {...this.subjectForm.value};
      
      // Filtrar valores vacíos en los arrays
      subject.chairs = subject.chairs.filter(chair => chair.trim() !== '');
      subject.selectiveSubjects = subject.selectiveSubjects.filter(s => s.trim() !== '');
      
      // Si no hay cátedras, agregar una por defecto
      if (subject.chairs.length === 0) {
        subject.chairs = ['No especificado'];
      }
      
      // Agregar la materia a la lista
      this.subjects.push(subject);
      
      // Reiniciar el formulario
      this.resetForm();
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.markFormGroupTouched(this.subjectForm);
    }
  }
  
  removeSubject(index: number): void {
    this.subjects.splice(index, 1);
  }
  
  resetForm(): void {
    // Mantener los valores de categoryId y facultyId
    const categoryId = this.subjectForm.get('subject_category_id')?.value;
    const facultyId = this.subjectForm.get('faculty_id')?.value;
    
    this.subjectForm.reset({
      name: '',
      prefix: '',
      label: 'Materia Regular',
      info: '',
      selective: false,
      url: '',
      subject_category_id: categoryId,
      faculty_id: facultyId
    });
    
    // Reiniciar los arrays
    while (this.chairsArray.length > 0) {
      this.chairsArray.removeAt(0);
    }
    this.addChair();
    
    while (this.selectiveSubjectsArray.length > 0) {
      this.selectiveSubjectsArray.removeAt(0);
    }
  }
  
  // Método para guardar todas las materias
  saveSubjects(): void {
    // Si hay una materia en el formulario que no se ha agregado, agregarla
    if (this.subjectForm.valid && this.subjectForm.get('name')?.value) {
      this.addSubject();
    }
    
    if (this.subjects.length > 0) {
      this.activeModal.close(this.subjects);
    } else {
      // Mostrar mensaje de error o validación
      alert('Debe agregar al menos una materia');
    }
  }
  
  close(): void {
    this.activeModal.dismiss('Cross click');
  }
  
  // Método auxiliar para marcar todos los campos como tocados
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        for (let i = 0; i < control.length; i++) {
          if (control.at(i) instanceof FormGroup) {
            this.markFormGroupTouched(control.at(i) as FormGroup);
          } else {
            control.at(i).markAsTouched();
          }
        }
      } else {
        control?.markAsTouched();
      }
    });
  }
}
