import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  FacultyChangeRequest,
  FacultyChangeRequestPayload,
  FacultyChangeRejectPayload,
  FacultyChangeUpdatePayload,
  FacultyChangeStatus,
  PaginatedFacultyChangeResponse
} from 'src/app/shared/models/faculty-change-request.model';

@Injectable({
  providedIn: 'root'
})
export class FacultyChangeService {
  BASE_URL: string;

  constructor(private http: HttpClient) {
    this.BASE_URL = environment.API_URL;
  }

  /**
   * Obtiene todas las solicitudes de cambio de facultad (paginado)
   * @param page Número de página (default: 1)
   * @param limit Límite de registros por página (default: 10)
   * @returns Observable con respuesta paginada
   */
  getAll(page: number = 1, limit: number = 10): Observable<PaginatedFacultyChangeResponse> {
    return this.http.get<PaginatedFacultyChangeResponse>(
      `${this.BASE_URL}/faculty-change-requests?page=${page}&limit=${limit}`
    ).pipe(
      map(response => response || null)
    );
  }

  /**
   * Obtiene solicitudes de cambio de facultad por estado
   * @param status Estado a filtrar (PENDING | APPROVED | REJECTED | CANCELLED)
   * @returns Observable con array de solicitudes
   */
  getByStatus(status: FacultyChangeStatus): Observable<FacultyChangeRequest[]> {
    return this.http.get<FacultyChangeRequest[]>(
      `${this.BASE_URL}/faculty-change-requests/by-status/${status}`
    ).pipe(
      map(response => response || null)
    );
  }

  /**
   * Obtiene una solicitud de cambio de facultad por ID
   * @param id ID de la solicitud
   * @returns Observable con la solicitud
   */
  getById(id: number): Observable<FacultyChangeRequest> {
    return this.http.get<FacultyChangeRequest>(
      `${this.BASE_URL}/faculty-change-requests/${id}`
    ).pipe(
      map(response => response || null)
    );
  }

  /**
   * Obtiene las solicitudes del usuario autenticado
   * @returns Observable con array de solicitudes del usuario
   */
  getByUser(): Observable<FacultyChangeRequest[]> {
    return this.http.get<FacultyChangeRequest[]>(
      `${this.BASE_URL}/faculty-change-requests/by-user`
    ).pipe(
      map(response => response || null)
    );
  }

  /**
   * Crea una nueva solicitud de cambio de facultad
   * @param payload Datos de la solicitud (facultadId y razón)
   * @returns Observable con la solicitud creada
   */
  create(payload: FacultyChangeRequestPayload): Observable<FacultyChangeRequest> {
    return this.http.post<FacultyChangeRequest>(
      `${this.BASE_URL}/faculty-change-requests/create`,
      payload
    ).pipe(
      map(response => response || null)
    );
  }

  /**
   * Actualiza una solicitud de cambio de facultad
   * @param id ID de la solicitud
   * @param payload Datos a actualizar (solo razón si está PENDING)
   * @returns Observable con la solicitud actualizada
   */
  update(id: number, payload: FacultyChangeUpdatePayload): Observable<FacultyChangeRequest> {
    return this.http.patch<FacultyChangeRequest>(
      `${this.BASE_URL}/faculty-change-requests/${id}`,
      payload
    ).pipe(
      map(response => response || null)
    );
  }

  /**
   * Aprueba una solicitud de cambio de facultad
   * @param id ID de la solicitud
   * @returns Observable con la solicitud aprobada
   */
  approve(id: number): Observable<FacultyChangeRequest> {
    return this.http.post<FacultyChangeRequest>(
      `${this.BASE_URL}/faculty-change-requests/${id}/approve`,
      {}
    ).pipe(
      map(response => response || null)
    );
  }

  /**
   * Rechaza una solicitud de cambio de facultad
   * @param id ID de la solicitud
   * @param payload Razón del rechazo (opcional)
   * @returns Observable con la solicitud rechazada
   */
  reject(id: number, payload?: FacultyChangeRejectPayload): Observable<FacultyChangeRequest> {
    return this.http.post<FacultyChangeRequest>(
      `${this.BASE_URL}/faculty-change-requests/${id}/reject`,
      payload || {}
    ).pipe(
      map(response => response || null)
    );
  }

  /**
   * Cancela una solicitud de cambio de facultad
   * @param id ID de la solicitud
   * @returns Observable con la solicitud cancelada
   */
  cancel(id: number): Observable<FacultyChangeRequest> {
    return this.http.post<FacultyChangeRequest>(
      `${this.BASE_URL}/faculty-change-requests/${id}/cancel`,
      {}
    ).pipe(
      map(response => response || null)
    );
  }

  /**
   * Elimina una solicitud de cambio de facultad
   * @param id ID de la solicitud
   * @returns Observable con respuesta de eliminación
   */
  delete(id: number): Observable<any> {
    return this.http.delete(
      `${this.BASE_URL}/faculty-change-requests/${id}`
    ).pipe(
      map(response => response || null)
    );
  }
}