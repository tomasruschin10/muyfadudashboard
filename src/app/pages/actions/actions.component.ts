import { Component, OnInit } from '@angular/core';
import { ActionsService } from './services/action.services';
import { Action } from 'src/app/shared/models/action.model';
import { ActionType } from 'src/app/shared/models/actionType.model';
import { UserAction } from 'src/app/shared/models/userAction.model';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Meta } from 'src/app/shared/models/response.model';
import { UserWithcounters } from 'src/app/shared/models/user.model';
import { UsersService } from '../users/services/users.service';

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
  pages: number[] = [];
  showActionTypes: boolean = false;
  showActions: boolean = false;
  showUserActions: boolean = false;
  remainingActionsTypes: ActionType[] = [];
  pageSize = 10;
  page: number = 1;
  totalItems: number = 0;
  meta: Meta;

  // User Points
  showUserPoints = false
  totalUserWithPoints: number = 0;
  pageUserWithPoints = 1
  userWithPoints: UserWithcounters[] = []
  sortBy: 'referralCount' | 'opinionCount' | 'rewardRequestsCount' | 'actionPoints' | 'totalPoints' | 'weeklyPoints' | 'monthlyPoints' = 'totalPoints'
  metaUserWithPoints: Meta;

  constructor(
    private actionService: ActionsService,
    private modalService: NgbModal,
    private userService: UsersService
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

  loadUserActions(): void {
    this.loading = true;
    this.actionService.getUserActions(this.page, this.pageSize).subscribe(
      (response) => {
        this.userActions = response.data;
        this.meta = response.meta
        this.totalItems = response.meta.total_elements
        this.loading = false;
      },
      (error) => {
        this.error = 'Error al cargar las acciones de usuario';
        this.loading = false;
        console.error('Error al cargar las acciones de usuario:', error);
      }
    );
  }

  loadUserWithCounters() {
    this.loading = true;
    this.userService.getUsersRankedBypoints(this.pageUserWithPoints, this.pageSize, this.sortBy).subscribe(
      (response) => {
        this.userWithPoints = response.data
        this.metaUserWithPoints = response.meta
        this.totalUserWithPoints = response.meta.total_elements
        this.loading = false;
      },
      (error) => {
        this.error = 'Error al cargar los datos de usuario';
        this.loading = false;
        console.error('Error al cargar los datos de usuario:', error);
      }
    )
  }

  toggleUserPoints(): void {
    this.showUserPoints = !this.showUserPoints;
    if (this.showUserPoints && this.userWithPoints.length === 0) {
      this.loadUserWithCounters();
    }
  }

  changePageUserPoints(page: number): void {
    this.pageUserWithPoints = page
    this.loadUserWithCounters();
  }

  editActionType(type: ActionType): void {
    this.currentActionType = {...type};
    this.isEditing = true;
  }

  saveActionType(): void {
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
    this.page = page
    this.loadUserActions();
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