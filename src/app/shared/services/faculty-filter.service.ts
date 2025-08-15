import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Faculty } from 'src/app/shared/models/faculty.model';

@Injectable({
  providedIn: 'root'
})
export class FacultyFilterService {
  private readonly STORAGE_KEY = 'selectedFacultyId';
  private selectedFacultySubject = new BehaviorSubject<Faculty | null>(null);
  facultyChanged = new EventEmitter<Faculty | null>();

  constructor() {
    this.loadSavedFaculty();
  }

  private loadSavedFaculty(): void {
    const savedFacultyId = localStorage.getItem(this.STORAGE_KEY);
    if (savedFacultyId) {
      // Aquí solo guardamos el ID, la información completa se cargará después
      // cuando tengamos acceso a la lista de facultades
      this.selectedFacultySubject.next({ id: parseInt(savedFacultyId) } as Faculty);
    }
  }

  setSelectedFaculty(faculty: Faculty | null): void {
    this.selectedFacultySubject.next(faculty);
    this.facultyChanged.emit(faculty);
    if (faculty) {
      localStorage.setItem(this.STORAGE_KEY, faculty.id.toString());
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  getSelectedFaculty(): Observable<Faculty | null> {
    return this.selectedFacultySubject.asObservable();
  }

  getCurrentFaculty(): Faculty | null {
    return this.selectedFacultySubject.getValue();
  }

  getFacultyId(): number | null {
    const faculty = this.selectedFacultySubject.getValue();
    return faculty ? faculty.id : null;
  }
}