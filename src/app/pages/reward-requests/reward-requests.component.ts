import { Component, OnInit } from '@angular/core';
import { RewardRequestsService } from './services/reward-requests.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { RewardRequest, RewardsRequestStatus, translateRewardRequestStatus } from 'src/app/shared/models/reward-request.model';
import { Meta } from 'src/app/shared/models/response.model';

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

  listRewardRequests() {
    this.rewardRequestsSv.getRewardsRequests(this.page).subscribe(
      (response) => {
        this.rewardRequests = [...this.rewardRequests, ...response.data];
        this.meta = response.meta;
        this.showAlert = this.meta.current_page >= this.meta.total_pages;
      },
      () => {
        MyAlert.alert('Error al listar solicitudes', true);
      }
    )
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

  filterByStatus(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    if (selectedValue === '') {
      this.listRewardRequests();
    } else {
      this.rewardRequestsSv.getRewardsRequests(this.page, selectedValue).subscribe(
        (data) => {
          this.rewardRequests = data.data;
        },
        () => {
          MyAlert.alert('Error al filtrar', true);
        }
      );
    }
  }

  loadMoreRewardRequests() {
    if (this.meta && this.meta.next_page) {
      this.page = this.meta.next_page;
      this.listRewardRequests();
    } else {
      this.showAlert = true;
    }
  }
}
