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
import * as XLSX from 'xlsx';
import { formatDate } from 'src/utils/helpers';

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

  //User actions filters
  fromDate: string = ""
  toDate: string = ""

  // User Points
  showUserPoints = false
  totalUserWithPoints: number = 0;
  pageUserWithPoints = 1
  userWithPoints: UserWithcounters[] = []
  sortBy: 'referralCount' | 'opinionCount' | 'rewardRequestsCount' | 'actionPoints' | 'totalPoints' | 'weeklyPoints' | 'monthlyPoints' = 'totalPoints'
  metaUserWithPoints: Meta;
  order: 'DESC' | 'ASC' = 'DESC'
  startDate: string = ''
  endDate: string = ''

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
    let filters:any = {}
    if (this.fromDate && this.toDate) {
      filters.startDate = this.formatDate(new Date(this.fromDate))
      filters.endDate = this.formatDate(new Date(this.toDate))
    }
    this.actionService.getUserActions(this.page, this.pageSize, filters).subscribe(
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

  exportToExcel() {
    let filters:any = {}
    if (this.fromDate && this.toDate) {
      filters.startDate = this.formatDate(new Date(this.fromDate))
      filters.endDate = this.formatDate(new Date(this.toDate))
    }
    // Primero, obtener todos los datos sin paginar
    this.actionService.getUserActionsForExport(filters).subscribe(
      (data: UserAction[]) => {
        // Preparar los datos para Excel
        const excelData = data.map(action => ({
          'Usuario': action.user.name,
          'Email': action.user.email,
          'Acción': action.action.type.name,
          'Tipo de Acción': action.action.type.type,
          'Fecha': new Date(action.created_at).toLocaleString()
        }));

        // Crear una hoja de trabajo
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

        // Crear un libro de trabajo
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Acciones de Usuarios');

        // Guardar el archivo
        XLSX.writeFile(wb, 'Acciones_de_Usuarios.xlsx');
      },
      error => {
        console.error('Error al exportar los datos:', error);
      }
    );
  }

  loadUserWithCounters() {
    this.loading = true;
    const formatedStart = this.startDate ? formatDate(new Date(this.startDate)) : '';
    const formatedEnd = this.endDate ? formatDate(new Date(this.endDate)) : '';
    this.userService.getUsersRankedBypoints(this.pageUserWithPoints, this.pageSize, this.sortBy, this.order, formatedStart, formatedEnd).subscribe(
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

  exportUserWithCounters() {
    this.loading = true;
    const formatedStart = this.startDate ? formatDate(new Date(this.startDate)) : '';
    const formatedEnd = this.endDate ? formatDate(new Date(this.endDate)) : '';
    this.userService.getUsersRankedBypointsForExport(this.sortBy, this.order, formatedStart, formatedEnd).subscribe(
      (response: UserWithcounters[]) => {
        // Preparar los datos para Excel
        const data = response.map(user => ({
          'Nombre': user.name,
          'Email': user.email,
          'Puntos Totales': user.totalPoints,
          'Puntos de Acciones': user.actionPoints,
          'Número de Opiniones': user.opinionCount,
          'Solicitudes de Canjeo': user.rewardRequestsCount,
          'Número de Referidos': user.referralCount,
          'Puntos Semanales': user.weeklyPoints,
          'Puntos Mensuales': user.monthlyPoints
        }));

        // Crear una hoja de trabajo
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

        // Crear un libro de trabajo
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Usuarios y Puntos');

        // Generar nombre de archivo con fecha y hora
        const fileName = `Usuarios_y_Puntos_${new Date().toISOString().split('T')[0]}.xlsx`;

        // Guardar el archivo
        XLSX.writeFile(wb, fileName);

        this.loading = false;
        MyAlert.alert('Exportación completada con éxito', false);
      },
      (error) => {
        this.error = 'Error al exportar los datos de usuario';
        this.loading = false;
        console.error('Error al exportar los datos de usuario:', error);
        MyAlert.alert('Error al exportar los datos', true);
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

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}