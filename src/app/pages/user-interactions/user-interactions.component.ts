import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { UserInteractionService } from './service/user-interactions.service';
import { Meta } from 'src/app/shared/models/response.model';
import { UserInteraction } from 'src/app/shared/models/userInteraction.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-interactions',
  templateUrl: './user-interactions.component.html',
  styleUrls: ['./user-interactions.component.scss']
})
export class UserInteractionComponent implements OnInit {
  interactions: UserInteraction[] = [];
  meta: Meta;
  pageSize = 10;
  page: number = 1;
  totalItems: number = 0;

  Math = Math;

  interactionsForExport: UserInteraction[] = []

  // Filtros
  email: string = '';
  contentType: 'promotion' | 'news' | 'advertisement' | 'modal' | 'button' | 'offer' | '' = '';
  interactionType: 'view' | 'click' | 'redeem' | 'view_more' | 'contact' | 'search' | '' = '';
  startDate: string = '';
  endDate: string = ''

  constructor(
    private service: UserInteractionService,
  ) { 
  }

  ngOnInit(): void {
    this.listInteractions(this.page);
  }

  listInteractions(page: number, pageSize = this.pageSize){
    const filters = {
      email: this.email,
      contentType: this.contentType,
      interactionType: this.interactionType,
      ...( this.startDate && this.endDate ? {
        startDate: this.formatDate(new Date(this.startDate)),
        endDate: this.formatDate(new Date(this.endDate)),
      } : {})
    }
    this.service.getInteractions(page, pageSize, filters).subscribe(
      (response) => {
        this.interactions = response.data;
        this.meta = response.meta;
        this.totalItems = response.meta.total_elements;
        this.page = page;
      },
      (error) => {
        MyAlert.alert('Error al cargar las interacciones', true);
      }
    );
  }

  onPageChange(page: number) {
    this.page = +page;
    this.listInteractions(this.page);
  }

  applyFilters() {
    this.page = 1;
    this.listInteractions(this.page);
  }

  clearFilters() {
    this.email = '';
    this.contentType = '';
    this.interactionType = '';
    this.applyFilters();
  }

  getContentTitle(interaction: UserInteraction): string {
    if (interaction.promotion) return interaction.promotion.title;
    if (interaction.notice) return interaction.notice.name;
    if (interaction.advertisement) return interaction.advertisement?.title || 'anuncio';
    if (interaction.modal) return interaction.modal.title || 'Título de modal'
    if (interaction.offer) return interaction.offer.title || 'Oferta sin título'
    if (interaction.banner) return interaction.banner.title || 'Banner sin título'
    if (interaction.section_name) return interaction.section_name || 'sección sin nombre'
    return 'N/A';
  }

  translateContentType(contentType: string): string {
    switch (contentType) {
      case 'promotion':
        return 'Promoción';
      case 'news':
        return 'Noticia';
      case 'advertisement':
        return 'Anuncio';
      case 'modal':
        return 'Modal';
      case 'offer':
        return 'Oferta'
      case 'button':
        return 'Botón'
      case 'banner':
        return 'Banner'
      default:
        return contentType;
    }
  }
  translateInteractionType(interactionType: string): string {
    switch (interactionType) {
      case 'view':
        return 'Vista';
      case 'click':
        return 'Click';
      case 'redeem':
        return 'Canje';
      case 'view_more':
        return 'Ver más';
      case 'contact':
        return 'Contacto';
      case 'search':
        return 'Búsqueda';
      default:
        return interactionType;
    }
  }

  loadInetractionsForExport() {
    const filters = {
      email: this.email,
      contentType: this.contentType,
      interactionType: this.interactionType,
      ...( this.startDate && this.endDate ? {
        startDate: this.formatDate(new Date(this.startDate)),
        endDate: this.formatDate(new Date(this.endDate)),
      } : {})
    }
    this.service.getInteractionsForExport(filters).subscribe(
      (response) => {
        this.interactionsForExport = response;
      },
      (error) => {
        MyAlert.alert('Error al cargar las interacciones', true);
      }
    );
  }

  exportToExcel(): void {
    // Primero, carga las interacciones para exportar
    this.loadInetractionsForExport();

    // Luego, procesa y exporta los datos
    setTimeout(() => {
      const data = this.interactionsForExport.map(interaction => ({
        'Usuario': interaction.user?.name || 'N/A',
        'Email': interaction.user?.email || 'N/A',
        'Tipo de Contenido': this.translateContentType(interaction.content_type),
        'Título del Contenido': this.getContentTitle(interaction),
        'Tipo de Interacción': this.translateInteractionType(interaction.interaction_type),
        'Fecha': new Date(interaction.created_at).toLocaleString()
      }));

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'interacciones_usuarios');
    }, 3000); // Espera 1 segundo para asegurarse de que los datos se hayan cargado
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    
    // Crear un nombre de archivo más estructurado
    const now = new Date();
    const dateStr = now.toISOString().slice(0,10).replace(/-/g,"");
    const timeStr = now.toTimeString().slice(0,8).replace(/:/g,"");
    
    // Añadir referencias a los filtros
    let filterStr = '';
    if (this.email) filterStr += `_email-${this.email.split('@')[0]}`;
    if (this.contentType) filterStr += `_content-${this.contentType}`;
    if (this.interactionType) filterStr += `_interaction-${this.interactionType}`;
    if (this.startDate) filterStr += `_from-${this.startDate}`;
    if (this.endDate) filterStr += `_to-${this.endDate}`;
    
    // Limitar la longitud del filterStr para evitar nombres de archivo demasiado largos
    filterStr = filterStr.substring(0, 50);
    
    link.download = `${fileName}_${dateStr}_${timeStr}${filterStr}.xlsx`;
    link.click();
  }

  private formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
}