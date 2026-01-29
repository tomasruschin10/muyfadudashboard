import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FacultyFilterService } from 'src/app/shared/services/faculty-filter.service';
import { Faculty } from 'src/app/shared/models/faculty.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { PromotionService } from './services/promotions.service';
import { Partner } from 'src/app/shared/models/offer.model';
import { Meta } from 'src/app/shared/models/response.model';
import { Reward, RewardPayload } from 'src/app/shared/models/reward.model';
import { Promotion } from 'src/app/shared/models/promotion.model';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {

  promotions:Promotion[] = []

  isEditing = false
  promotionSelected:Partial<Promotion> = {}

  selectedImageUrl: string | ArrayBuffer | null = null;
  selectedImageFile: File | null = null;

  promotionForm:FormGroup

  @ViewChild('promotionModal') modalElement: ElementRef;
  private modal: Modal;

  selectedFaculty: Faculty | null = null;
  facultySubscription: any;
  constructor(
    private service: PromotionService,
    private route: Router,
    private fb:FormBuilder,
    private facultyFilterService: FacultyFilterService
  ){ 
    this.promotionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      discount_percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      coupon_code: [''],
      featured_until: [null],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      url: ['', Validators.pattern('https?://.+')],
      business_name: ['', Validators.required],
      terms_conditions: [''],
      is_featured: [false]
    })
  }

  ngOnInit(): void {
    this.getPromotions();
    this.facultySubscription = this.facultyFilterService.getSelectedFaculty().subscribe(faculty => {
      this.selectedFaculty = faculty;
      this.getPromotions();
    });
  }

  ngAfterViewInit() {
    this.modal = new Modal(this.modalElement.nativeElement);
  }

  getPromotions() {
    const facultyId = this.selectedFaculty ? this.selectedFaculty.id : undefined;
    this.service.getAllPromotions(facultyId).subscribe(
      (response) => {
        this.promotions = response
      }
    )
  }

  savePromotion() {
    const formData = this.createFormData()
    if (this.selectedFaculty && this.selectedFaculty.id) {
      formData.append('faculty_id', this.selectedFaculty.id.toString());
    }
    if (!this.isEditing) {
      this.service.createPromotion(formData).subscribe(
        () => {
          this.closeModal();
          this.isEditing = false;
          this.resetForm()
          this.getPromotions()
          MyAlert.alert("Promocion creada con éxito")
        },
        (error) => {
          MyAlert.alert("Ocurrió un error al crear la promoción", true)
        }
      )
    } else {
      this.service.updatePromotion(this.promotionSelected.id || 0, formData).subscribe(
        () => {
          this.closeModal()
          this.resetForm()
          this.getPromotions()
          MyAlert.alert("Promocion actualizada con éxito")
        },
        (error) => {
          MyAlert.alert("Ocurrió un error al actualizar la promoción", true)
        }
      )
    }
  }

  editPromotion(id:number) {
    this.isEditing = true;
    const promotion = this.promotions.find((prom) => prom.id === id)
    if (promotion) {
      this.promotionForm.patchValue({
        ...promotion,
        start_date: (promotion.start_date as unknown as string).split('T')[0],
        end_date: (promotion.end_date as unknown as string).split('T')[0],
        featured_until: promotion.featured_until ? (promotion.featured_until as unknown as string).split('T')[0] : null
      })
      this.promotionSelected = promotion
      this.selectedImageUrl = promotion.image?.url || ""
      this.openModal();
    }
  }

  deletePromotion(id:number) {
    this.service.deletePromotion(id).subscribe(
      (data) => {
        this.getPromotions()
        MyAlert.alert("Promocion eliminada con éxito")
      }
    )
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = e => this.selectedImageUrl = e.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

  openModal() {
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
  }

  private createFormData() {
    const formData = new FormData()
    Object.keys(this.promotionForm.controls).forEach(key => {
      const control = this.promotionForm.get(key);
      if (control) {
        if (!control.value) {
          return
        }
        if (key === 'is_featured') {
          formData.append(key, control.value ? '1' : '0')
          return
        }
        if (control.value instanceof Date) {
          formData.append(key, control.value.toISOString());
        } else {
          formData.append(key, control.value);
        }
      }
    });
    if (this.promotionSelected.image_id) {
      formData.append('image_id', this.promotionSelected.image_id.toString())
    }
    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }
    return formData;
  }

  private resetForm() {
    this.promotionForm.reset();
    this.isEditing = false;
    this.selectedImageUrl = null;
    this.selectedImageFile = null;
    this.promotionSelected = {};
  }
}