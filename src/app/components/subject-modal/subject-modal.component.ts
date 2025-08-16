
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, SubjectParentPayload, SubjectPayload } from 'src/app/shared/models/subject.model';

@Component({
  selector: 'app-subject-modal',
  templateUrl: './subject-modal.component.html',
  styleUrls: ['./subject-modal.component.scss']
})
export class SubjectModalComponent implements OnInit {
  @Input() categoryId: number;
  @Input() facultyId: number | null;
  @Input() subjectsCareer: Subject[] = [];
  
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
      subjectParent: this.fb.array([]) // Mantenemos el nombre original
    });
  }
  
  // Getters para acceder a los FormArrays
  get chairsArray(): FormArray {
    return this.subjectForm.get('chairs') as FormArray;
  }
  
  get selectiveSubjectsArray(): FormArray {
    return this.subjectForm.get('selectiveSubjects') as FormArray;
  }
  
  // Getter para el array de materias correlativas
  get subjectParentArray(): FormArray {
    return this.subjectForm.get('subjectParent') as FormArray;
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
      
      // Asegurarse de que subjectParent tenga el formato correcto
      if (subject.subjectParent && Array.isArray(subject.subjectParent)) {
        // Filtrar entradas vacías
        subject.subjectParent = subject.subjectParent
          .filter(item => item && item.subject_parent_id)
          .map(item => ({
            subject_parent_id: item.subject_parent_id,
            orCorrelative: item.orCorrelative || []
          }));
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
  
  // Método para agregar una correlativa
  addSubjectParent(subjectId?: number): void {
    this.subjectParentArray.push(
      this.fb.group({
        subject_parent_id: [subjectId || ''],
        orCorrelative: this.fb.array([])
      })
    );
  }

  // Método para eliminar una correlativa
  removeSubjectParent(index: number): void {
    this.subjectParentArray.removeAt(index);
  }

  // Método para verificar si una materia ya está seleccionada como correlativa
  isSubjectParentSelected(subjectId: number): boolean {
    const values = this.subjectParentArray.value;
    return values.some(item => item.subject_parent_id === subjectId);
  }

  // Método para manejar la selección de correlativas
  toggleSubjectParent(subject: Subject): void {
    const index = this.subjectParentArray.value.findIndex(item => item.subject_parent_id === subject.id);
    
    if (index >= 0) {
      // Si ya está seleccionada, la quitamos
      this.subjectParentArray.removeAt(index);
    } else {
      // Si no está seleccionada, la agregamos
      this.addSubjectParent(subject.id);
    }
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
    
    while (this.subjectParentArray.length > 0) {
      this.subjectParentArray.removeAt(0);
    }
  }
  
  // Método para guardar todas las materias
  saveSubjects(): void {
    // Si hay una materia en el formulario que no se ha agregado, agregarla
    if (this.subjectForm.valid && this.subjectForm.get('name')?.value) {
      this.addSubject();
    }
    
    if (this.subjects.length > 0) {
      // Asegurarse de que cada materia tenga el formato correcto para subjectParent
      this.subjects = this.subjects.map(subject => {
        if (subject.subjectParent && Array.isArray(subject.subjectParent)) {
          // Transformar el array de IDs a objetos con el formato requerido
          subject.subjectParent = subject.subjectParent.map(parent => ({ 
            subject_parent_id: parent.subject_parent_id,
            orCorrelative: parent.orCorrelative  // Aquí se mantienen los IDs de las correlativas seleccionadas
           }));
        }
        return subject;
      });
      
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

  // Método para obtener el nombre de una materia por su ID
  getSubjectName(subjectParent: SubjectParentPayload): string {
    const subject = this.subjectsCareer.find(s => s.id === subjectParent.subject_parent_id);
    return subject ? subject.name : 'Materia desconocida';
  }

  // Propiedad para la búsqueda de correlativas
  subjectParentSearch: string = '';

  // Getter para filtrar las materias correlativas
  get filteredSubjectParents(): Subject[] {
    if (!this.subjectParentSearch) {
      return this.subjectsCareer;
    }
    
    const search = this.subjectParentSearch.toLowerCase();
    return this.subjectsCareer.filter(subject => 
      subject.name.toLowerCase().includes(search) || 
      subject.prefix?.toLowerCase().includes(search)
    );
  }
}
