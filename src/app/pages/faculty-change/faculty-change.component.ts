import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FacultyChangeService } from './services/faculty-change.service';
import {
  FacultyChangeRequest,
  FacultyChangeStatus,
  PaginatedFacultyChangeResponse
} from 'src/app/shared/models/faculty-change-request.model';

@Component({
  selector: 'app-faculty-change',
  templateUrl: './faculty-change.component.html',
  styleUrls: ['./faculty-change.component.scss']
})
export class FacultyChangeComponent implements OnInit, OnDestroy {
  // Data
  facultyChangeRequests: FacultyChangeRequest[] = [];
  filteredRequests: FacultyChangeRequest[] = [];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;

  // Filters
  selectedStatus: FacultyChangeStatus | 'ALL' = 'ALL';
  searchTerm: string = '';

  // UI States
  isLoading: boolean = false;
  isProcessing: boolean = false;
  showRejectModal: boolean = false;
  selectedRequestForReject: FacultyChangeRequest | null = null;

  // Forms
  rejectForm: FormGroup;

  // Subscriptions
  private destroy$ = new Subject<void>();

  // Status options for filter
  statusOptions: Array<{ value: FacultyChangeStatus | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'Todos' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'APPROVED', label: 'Aprobado' },
    { value: 'REJECTED', label: 'Rechazado' },
    { value: 'CANCELLED', label: 'Cancelado' }
  ];

  constructor(
    private facultyChangeService: FacultyChangeService,
    private fb: FormBuilder
  ) {
    this.rejectForm = this.createRejectForm();
  }

  ngOnInit(): void {
    this.loadFacultyChangeRequests();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Crea el formulario reactivo para rechazar solicitudes
   */
  private createRejectForm(): FormGroup {
    return this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  /**
   * Carga las solicitudes de cambio de facultad
   */
  loadFacultyChangeRequests(): void {
    this.isLoading = true;
    this.facultyChangeService.getAll(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginatedFacultyChangeResponse) => {
          this.facultyChangeRequests = response.data || [];
          this.totalRecords = response.total || 0;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar solicitudes:', error);
          this.isLoading = false;
        }
      });
  }

  /**
   * Filtra las solicitudes por estado y término de búsqueda
   */
  applyFilters(): void {
    let filtered = [...this.facultyChangeRequests];

    // Filtrar por estado
    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(req => req.status === this.selectedStatus);
    }

    // Filtrar por búsqueda (nombre de usuario o facultad)
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(req =>
        req.user?.name?.toLowerCase().includes(term) ||
        req.currentFaculty?.title?.toLowerCase().includes(term) ||
        req.requestedFaculty?.title?.toLowerCase().includes(term)
      );
    }

    this.filteredRequests = filtered;
  }

  /**
   * Maneja el cambio de filtro de estado
   */
  onStatusFilterChange(status: FacultyChangeStatus | 'ALL'): void {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.applyFilters();
  }

  /**
   * Maneja el cambio en el término de búsqueda
   */
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.applyFilters();
  }

  /**
   * Cambia de página
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadFacultyChangeRequests();
  }

  /**
   * Aprueba una solicitud de cambio de facultad
   */
  approveFacultyChange(request: FacultyChangeRequest): void {
    if (request.status !== 'PENDING') {
      console.warn('Solo se pueden aprobar solicitudes PENDING');
      return;
    }

    if (!confirm('¿Está seguro de que desea aprobar esta solicitud?')) {
      return;
    }

    this.isProcessing = true;
    this.facultyChangeService.approve(request.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedRequest: FacultyChangeRequest) => {
          this.loadFacultyChangeRequests();
          this.isProcessing = false;
        },
        error: (error) => {
          console.error('Error al aprobar solicitud:', error);
          this.isProcessing = false;
        }
      });
  }

  /**
   * Abre el modal para rechazar una solicitud
   */
  openRejectModal(request: FacultyChangeRequest): void {
    if (request.status !== 'PENDING') {
      console.warn('Solo se pueden rechazar solicitudes PENDING');
      return;
    }

    this.selectedRequestForReject = request;
    this.rejectForm.reset();
    this.showRejectModal = true;
  }

  /**
   * Cierra el modal de rechazo
   */
  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedRequestForReject = null;
    this.rejectForm.reset();
  }

  /**
   * Rechaza una solicitud de cambio de facultad
   */
  rejectFacultyChange(): void {
    if (!this.rejectForm.valid || !this.selectedRequestForReject) {
      return;
    }

    this.isProcessing = true;
    const payload = {
      reason: this.rejectForm.get('reason')?.value
    };

    this.facultyChangeService.reject(this.selectedRequestForReject.id, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedRequest: FacultyChangeRequest) => {
          this.closeRejectModal();
          this.loadFacultyChangeRequests();
          this.isProcessing = false;
        },
        error: (error) => {
          console.error('Error al rechazar solicitud:', error);
          this.isProcessing = false;
        }
      });
  }

  /**
   * Elimina una solicitud de cambio de facultad
   */
  deleteFacultyChange(request: FacultyChangeRequest): void {
    if (!confirm('¿Está seguro de que desea eliminar esta solicitud?')) {
      return;
    }

    this.isProcessing = true;
    this.facultyChangeService.delete(request.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadFacultyChangeRequests();
          this.isProcessing = false;
        },
        error: (error) => {
          console.error('Error al eliminar solicitud:', error);
          this.isProcessing = false;
        }
      });
  }

  /**
   * Obtiene el badge de color según el estado
   */
  getStatusBadgeClass(status: FacultyChangeStatus): string {
    const statusClasses: { [key in FacultyChangeStatus]: string } = {
      'PENDING': 'badge-warning',
      'APPROVED': 'badge-success',
      'REJECTED': 'badge-danger',
      'CANCELLED': 'badge-secondary'
    };
    return statusClasses[status] || 'badge-secondary';
  }

  /**
   * Obtiene el label del estado
   */
  getStatusLabel(status: FacultyChangeStatus): string {
    const statusLabels: { [key in FacultyChangeStatus]: string } = {
      'PENDING': 'Pendiente',
      'APPROVED': 'Aprobado',
      'REJECTED': 'Rechazado',
      'CANCELLED': 'Cancelado'
    };
    return statusLabels[status] || status;
  }

  /**
   * Verifica si se pueden mostrar botones de acción
   */
  canShowActionButtons(request: FacultyChangeRequest): boolean {
    return request.status === 'PENDING';
  }

  /**
   * Obtiene el total de páginas
   */
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  /**
   * Obtiene el array de páginas para la paginación
   */
  get pagesArray(): number[] {
    const pages:number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}