import { Component, OnInit, OnDestroy } from '@angular/core';
import { Faculty } from 'src/app/shared/models/faculty.model';
import { FacultiesService } from 'src/app/pages/faculties/services/faculties.service';
import { FacultyFilterService } from 'src/app/shared/services/faculty-filter.service';
import { Subscription } from 'rxjs';

export let userData;
export let setUserData;

@Component({
  selector: 'app-dash-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userData;
  faculties: Faculty[] = [];
  selectedFaculty: Faculty | null = null;
  private facultySubscription: Subscription | null = null;

  constructor(
    private facultiesService: FacultiesService,
    private facultyFilterService: FacultyFilterService
  ) {
    userData = sessionStorage.getItem('userData');
    userData = JSON.parse(userData);
    this.userData = userData;
  }

  ngOnInit() {
    setUserData = (newUserData) => {
      this.userData = newUserData;
      sessionStorage.setItem('userData', JSON.stringify(newUserData));
    };

    // Cargar las facultades
    this.loadFaculties();
    
    // Suscribirse a cambios en la facultad seleccionada
    this.facultySubscription = this.facultyFilterService.getSelectedFaculty()
      .subscribe(faculty => {
        this.selectedFaculty = faculty;
        
        // Si tenemos un ID pero no los detalles completos, buscar en la lista cargada
        if (faculty && faculty.id && !faculty.title && this.faculties.length > 0) {
          const fullFaculty = this.faculties.find(f => f.id === faculty.id);
          if (fullFaculty) {
            this.facultyFilterService.setSelectedFaculty(fullFaculty);
          }
        }
      });
  }

  ngOnDestroy() {
    if (this.facultySubscription) {
      this.facultySubscription.unsubscribe();
    }
  }

  loadFaculties() {
    this.facultiesService.getAll().subscribe({
      next: (data) => {
        this.faculties = data;
        
        // Si tenemos un ID guardado, buscar la facultad completa
        const currentFaculty = this.facultyFilterService.getCurrentFaculty();
        if (currentFaculty && currentFaculty.id) {
          const fullFaculty = this.faculties.find(f => f.id === currentFaculty.id);
          if (fullFaculty) {
            this.facultyFilterService.setSelectedFaculty(fullFaculty);
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar facultades:', error);
      }
    });
  }

  selectFaculty(faculty: Faculty) {
    this.facultyFilterService.setSelectedFaculty(faculty);
  }

  clearFacultyFilter() {
    this.facultyFilterService.setSelectedFaculty(null);
  }

  logout() {
    sessionStorage.removeItem('token');
    window.location.reload();
  }
}