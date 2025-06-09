import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { UserInteractionService } from './service/user-interactions.service';
import { Meta } from 'src/app/shared/models/response.model';
import { UserInteraction } from 'src/app/shared/models/userInteraction.model';

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

  // Filtros
  email: string = '';
  contentType: 'promotion' | 'news' | 'advertisement' | '' = '';
  interactionType: 'view' | 'click' | 'redeem' | '' = '';

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
      interactionType: this.interactionType
    }
    this.service.getInteractions(page, pageSize, filters).subscribe(
      (response) => {
        console.log(response.data)
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
    if (interaction.advertisement) return interaction.advertisement?.partner?.name || 'anuncio';
    if (interaction.modal) return interaction.modal.title || 'Título de modal'
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
        return 'Modal'
      default:
        return contentType;
    }
  }
  translateInteractionType(interactionType: string): string {
    switch (interactionType) {
      case 'view':
        return 'Vista';
      case 'click':
        return 'Clic';
      case 'redeem':
        return 'Canje';
      default:
        return interactionType;
    }
  }
}