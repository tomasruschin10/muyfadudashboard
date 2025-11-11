import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubjectCategory, SubjectCategoryPayload } from '../../shared/models/subject-category.model';
import { CareerService } from 'src/app/pages/college-career/services/career.service';
import { Subject, SubjectPayload } from 'src/app/shared/models/subject.model';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubjectModalComponent } from '../subject-modal/subject-modal.component';

@Component({
  selector: 'app-career-levels',
  templateUrl: './career-levels.component.html',
  styleUrls: ['./career-levels.component.scss']
})
export class CareerLevelsComponent implements OnInit {
  @Input() levels: SubjectCategory[] = [];
  @Input() careerId: number;
  @Input() facultyId: number | null;
  
  @Output() levelPayload = new EventEmitter<SubjectCategoryPayload>();
  @Output() levelToDelete = new EventEmitter<number>();
  @Output() reloadTrigger = new EventEmitter<void>();

  subjects: Subject[] = []

  constructor(
    private careerService: CareerService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    // Si no hay niveles, inicializar con uno vacío
    if (!this.levels || this.levels.length === 0) {
      this.addLevel();
    }
    this.loadSubjects();
  }

  loadSubjects() {
    this.careerService.getSubjectsByCareer(this.careerId).subscribe(
      (subjects) => {
        this.subjects = subjects
      },
      (error) => {
        console.error(error)
      }
    )
  }

  // Métodos para gestionar niveles
  onLevelNameChange(event: any, levelIndex: number): void {
    this.levels[levelIndex].name = event.target.value;
    this.emitChanges();
  }

  onLevelDescriptionChange(event: any, levelIndex: number): void {
    this.levels[levelIndex].description = event.target.value;
    this.emitChanges();
  }

  onLevelYearChange(event: any, levelIndex: number): void {
    this.levels[levelIndex].year = event.target.value;
    this.emitChanges();
  }

  addLevel(): void {
    // Crear un nuevo nivel temporal con los campos necesarios para SubjectCategoryPayload
    const newLevel: SubjectCategory = {
      id: 0,
      name: '',
      description: '',
      career_id: this.careerId,
      year: '',
      faculty_id: this.facultyId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subject: []
    };
    
    this.levels.push(newLevel);
    this.emitChanges();
  }

  removeLevel(levelIndex: number): void {
    if (!(this.levels.length > 1)) return
    
    if (this.levels[levelIndex].id && this.levels[levelIndex].id > 0) {
      this.levelToDelete.emit(this.levels[levelIndex].id || 0);
    }

    this.levels.splice(levelIndex, 1);
  }

  // Emitir cambios al componente padre
  private emitChanges(): void {
    // No emitimos todos los niveles, solo actualizamos la vista
  }

  // Método para obtener un SubjectCategoryPayload a partir de un SubjectCategory
  getPayload(level: SubjectCategory): SubjectCategoryPayload {
    return {
      name: level.name,
      description: level.description,
      career_id: level.career_id,
      year: Number(level.year),
      faculty_id: Number(level.faculty_id) || null
    };
  }

  // Método para guardar un nivel específico
  saveLevel(levelIndex: number): void {
    const level = this.levels[levelIndex];
    
    // Validar que el nivel tenga nombre antes de emitirlo
    if (!level.name || level.name.trim() === '') {
      // Aquí podrías mostrar un mensaje de error o manejar la validación
      console.error('El nombre del nivel es requerido');
      return;
    }
    
    // Crear y emitir el payload para este nivel específico
    const payload = this.getPayload(level);
    this.levelPayload.emit(payload);
  }

  addSubjectsToLevel(subjects: SubjectPayload[]): void {
    this.careerService.createManySubjects(subjects).subscribe(
      () => {
        this.reloadTrigger.emit();
        setTimeout(() => {
          this.loadSubjects()
        }, 1000);
      },
      (error) => {
        console.error('Error al crear las materias:', error);
        MyAlert.alert('Ocurrio un error al crear las maeterias, verifique los datos', true)
      }
    )
  }

  openModalSubjects(categoryId: number) {
    const modalRef = this.modalService.open(SubjectModalComponent, {size: 'lg'});
    
    // Pasar datos básicos al modal
    modalRef.componentInstance.categoryId = categoryId;
    modalRef.componentInstance.facultyId = this.facultyId;
    modalRef.componentInstance.subjectsCareer = this.subjects;
    modalRef.componentInstance.editMode = false
    
    // Suscribirse al evento de cierre del modal
    modalRef.result.then(
      (subjects: SubjectPayload[]) => {
        // Este bloque se ejecuta cuando el modal se cierra con éxito (usando close())
        if (subjects && subjects.length > 0) {
          this.addSubjectsToLevel(subjects);
        }
      },
      (reason) => {
        // Este bloque se ejecuta cuando el modal se descarta (usando dismiss())
        console.log('Modal cerrado sin guardar:', reason);
      }
    );
  }

  // Nuevo método para editar una materia
  editSubject(subject: Subject, categoryId: number): void {
    const modalRef = this.modalService.open(SubjectModalComponent, {size: 'lg'});
    
    // Configurar el modal en modo edición
    modalRef.componentInstance.categoryId = categoryId;
    modalRef.componentInstance.facultyId = this.facultyId;
    modalRef.componentInstance.subjectsCareer = this.subjects;
    modalRef.componentInstance.editMode = true;
    modalRef.componentInstance.subjectToEdit = subject;
    
    // Manejar el resultado
    modalRef.result.then(
      (updatedSubjects: SubjectPayload[]) => {
        if (updatedSubjects && updatedSubjects.length > 0) {
          const updatedSubject = updatedSubjects[0];
          
          // Llamar al servicio para actualizar la materia
          this.careerService.editSubject(updatedSubject, subject.id).subscribe(
            response => {
              this.reloadTrigger.emit();
            },
            error => {
              console.error('Error al actualizar la materia:', error);
              alert('Error al actualizar la materia');
            }
          );
        }
      },
      (reason) => {
        console.log('Modal cerrado sin guardar:', reason);
      }
    );
  }
}