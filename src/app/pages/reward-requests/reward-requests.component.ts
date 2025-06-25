import { Component, OnInit } from '@angular/core';
import { RewardRequestsService } from './services/reward-requests.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { RewardRequest, RewardsRequestStatus, translateRewardRequestStatus } from 'src/app/shared/models/reward-request.model';
import { Meta } from 'src/app/shared/models/response.model';
import { formatDate } from '../../../utils/helpers'
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reward-requests',
  templateUrl: './reward-requests.component.html',
  styleUrls: ['./reward-requests.component.scss']
})
export class RewardRequestsComponent implements OnInit {
  rewardRequests: RewardRequest[] = [];
  form: any;
  page: number = 1;
  showAlert: boolean = false;
  translate = translateRewardRequestStatus
  rewardRequestStatuses = Object.values(RewardsRequestStatus);
  meta: Meta | null = null
  startDate: string = ''
  endDate: string = ''
  filtredStatus = ''

  constructor(
    private rewardRequestsSv: RewardRequestsService,
    private route: Router,
    private routeActive: ActivatedRoute
  ) {
    routeActive.queryParams.subscribe(data => {
      this.form = data.form;
    });
  }

  ngOnInit(): void {
    this.listRewardRequests();
  }

  listRewardRequests(restart:boolean = true) {
    const formatedStart = this.startDate ? formatDate(new Date(this.startDate)) : ''
    const formatedEnd = this.endDate ? formatDate(new Date(this.endDate)) : ''
    this.rewardRequestsSv.getRewardsRequests(this.page, this.filtredStatus, formatedStart, formatedEnd).subscribe(
      (response) => {
        this.rewardRequests = restart ? response.data : [...this.rewardRequests, ...response.data];
        this.meta = response.meta;
        this.showAlert = this.meta.current_page >= this.meta.total_pages;
      },
      () => {
        MyAlert.alert('Error al listar solicitudes', true);
      }
    )
  }

  exportData() {
    const formatedStart = this.startDate ? formatDate(new Date(this.startDate)) : '';
    const formatedEnd = this.endDate ? formatDate(new Date(this.endDate)) : '';
    this.rewardRequestsSv.getRewardsRequestsForExport(this.filtredStatus, formatedStart, formatedEnd).subscribe(
      (data) => {
        if (data && data.length > 0) {
          const excelData = data.map(request => ({
            'Premio': request.reward.name,
            'Usuario': request.user.username,
            'Email': request.user.email,
            'Nombre': `${request.user.name} ${request.user.lastname}`,
            'Puntos Requeridos': request.reward.points_to_be_claimed,
            'Estado': this.translate(request.status),
            'Fecha de Solicitud': new Date(request.created_at).toLocaleString()
          }));

          // Crear una hoja de trabajo
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

          // Crear un libro de trabajo
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Solicitudes de Premios');

          // Generar nombre de archivo con fecha y hora
          const now = new Date();
          const fileName = `Solicitudes_de_Premios_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}.xlsx`;

          // Guardar el archivo
          XLSX.writeFile(wb, fileName);

          MyAlert.alert('Archivo Excel generado con éxito', false);
        } else {
          MyAlert.alert('No hay datos para exportar', true);
        }
      },
      (error) => {
        console.error('Error al obtener datos para exportar:', error);
        MyAlert.alert('Error al exportar datos', true);
      }
    );
  }

  approveRequest(request: RewardRequest) {
    this.rewardRequestsSv.approveRewardRequest(request.id).subscribe(
      () => {
        request.status = RewardsRequestStatus.APPROVED;
        MyAlert.alert('Solicitud aprobada');
      },
      error => {
        MyAlert.alert('Error al aprobar la solicitud', true);
      }
    );
  }

  rejectRequest(request: RewardRequest) {
    this.rewardRequestsSv.rejectRewardRequest(request.id).subscribe(
      () => {
        request.status = RewardsRequestStatus.REJECTED;
        MyAlert.alert('Solicitud rechazada');
      },
      error => {
        MyAlert.alert('Error al rechazar la solicitud', true);
      }
    );
  }

  getStatusClass(status: RewardsRequestStatus): string {
    switch (status) {
      case RewardsRequestStatus.APPROVED:
        return 'text-success';
      case RewardsRequestStatus.REJECTED:
        return 'text-danger';
      default:
        return 'text-warning';
    }
  }

  applyFilters() {
    this.listRewardRequests()
  }

  loadMoreRewardRequests() {
    if (this.meta && this.meta.next_page) {
      this.page = this.meta.next_page;
      this.listRewardRequests(false);
    } else {
      this.showAlert = true;
    }
  }
}