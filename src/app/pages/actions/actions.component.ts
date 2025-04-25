import { Component, OnInit } from '@angular/core';
import { ActionsService } from './services/action.services';
import { Action } from 'src/app/shared/models/action.model';
import { ActionType } from 'src/app/shared/models/actionType.model';
import { UserAction } from 'src/app/shared/models/userAction.model';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionComponent implements OnInit {
  actions: Action[] = [];
  actionTypes: ActionType[] = [];
  userActions: UserAction[] = [];
  loading: boolean = false;
  error: string = '';
  currentActionType: ActionType = {} as ActionType;
  newAction: number = 0;
  isEditing: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];
  showActionTypes: boolean = false;
  showActions: boolean = false;
  showUserActions: boolean = false;
  remainingActionsTypes: ActionType[] = [];

  constructor(
    private actionService: ActionsService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadActionTypes();
    this.loadActions();
    this.loadUserActions();
  }

  openEditModal(content: any, type: ActionType): void {
    this.currentActionType = { ...type };
    this.modalService.open(content, { ariaLabelledBy: 'editActionTypeModalLabel' });
  }

  loadActions(): void {
    this.loading = true;
    this.actionService.getActions().subscribe(
      (response) => {
        this.actions = response;
        this.loading = false;
        // Filtrar los tipos de acciones que no están asignados
        this.remainingActionsTypes = this.actionTypes.filter(actionType => 
          !this.actions.some(action => action.type.id === actionType.id)
        );
      },
      (error) => {
        this.error = 'Error al cargar las acciones';
        this.loading = false;
        console.error('Error al cargar las acciones:', error);
      }
    );
  }

  loadActionTypes(): void {
    this.actionService.getActionTypes().subscribe(
      (response) => {
        this.actionTypes = response;
      },
      (error) => {
        this.error = 'Error al cargar los tipos de acciones';
        console.error('Error al cargar los tipos de acciones:', error);
      }
    );
  }

  loadUserActions(page: number = 1): void {
    this.loading = true;
    this.actionService.getUserActions().subscribe(
      (response) => {
        // this.userActions = response.data;
        // this.currentPage = response.currentPage;
        // this.totalPages = response.totalPages;
        this.userActions = response;
        this.pages = this.generatePageArray(this.totalPages);
        this.loading = false;
      },
      (error) => {
        this.error = 'Error al cargar las acciones de usuario';
        this.loading = false;
        console.error('Error al cargar las acciones de usuario:', error);
      }
    );
  }

  editActionType(type: ActionType): void {
    this.currentActionType = {...type};
    this.isEditing = true;
  }

  saveActionType(): void {
    if (this.isEditing) {
      this.actionService.updateActionType(this.currentActionType, this.currentActionType.id).subscribe(
        (response) => {
          if (response) {
            const index = this.actionTypes.findIndex(t => t.id === response.id);
            if (index !== -1) {
              this.actionTypes[index] = response;
            }
            this.cancelEdit();
            MyAlert.alert('Accion editada correctamente', false)
          }
        },
        (error) => {
          this.error = 'Error al actualizar el tipo de acción';
          console.error('Error al actualizar el tipo de acción:', error);
        }
      );
    }
  }

  cancelEdit(): void {
    this.currentActionType = {} as ActionType;
    this.isEditing = false;
  }

  saveAction(): void {
    this.actionService.createAction(+this.newAction).subscribe(
      (response) => {
        if (response) {
          this.actions.push(response);
          this.newAction = 0;
          this.loadActions()
        }
      },
      (error) => {
        this.error = 'Error al crear la acción';
        console.error('Error al crear la acción:', error);
      }
    );
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadUserActions(page);
    }
  }

  private generatePageArray(totalPages: number): number[] {
    return Array.from({length: totalPages}, (_, i) => i + 1);
  }

  toggleActionTypes(): void {
    this.showActionTypes = !this.showActionTypes;
  }
  
  toggleActions(): void {
    this.showActions = !this.showActions;
  }
  
  toggleUserActions(): void {
    this.showUserActions = !this.showUserActions;
  }
}