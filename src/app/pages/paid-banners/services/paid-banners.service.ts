
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaidBanner } from 'src/app/shared/models/paid-banner.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaidBannersService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de banners pagados
   * @param page Número de página
   * @param pageSize Tamaño de página
   * @returns Observable con la respuesta de banners pagados
   */
  getPaidBanners(): Observable<PaidBanner[]> {
    return this.http.get<PaidBanner[]>(`${this.apiUrl}/paid-banners`).pipe(
      map(response => response || null)
    );
  }

  /**
   * Obtiene un banner pagado por su ID
   * @param id ID del banner
   * @returns Observable con los datos del banner
   */
  getPaidBannerById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/paid-banners/${id}`).pipe(
      map(response => response || null)
    );
  }

  /**
   * Crea un nuevo banner pagado
   * @param data Datos del banner
   * @returns Observable con la respuesta de creación
   */
  createPaidBanner(data: FormData): Observable<PaidBanner> {
    return this.http.post<PaidBanner>(`${this.apiUrl}/paid-banners/create`, data).pipe(
      map(response => response || null)
    );
  }

  /**
   * Actualiza un banner pagado existente
   * @param id ID del banner
   * @param data Datos actualizados
   * @returns Observable con la respuesta de actualización
   */
  updatePaidBanner(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/paid-banners/${id}`, data).pipe(
      map(response => response || null)
    );
  }

  /**
   * Elimina un banner pagado
   * @param id ID del banner a eliminar
   * @returns Observable con la respuesta de eliminación
   */
  deletePaidBanner(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/paid-banners/${id}`).pipe(
      map(response => response || null)
    );
  }
}
