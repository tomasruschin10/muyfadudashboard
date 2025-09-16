
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaidBannersService } from './services/paid-banners.service';
import { MyAlert } from 'src/app/shared/static-functions/myFunctions';
import { PaidBanner } from 'src/app/shared/models/paid-banner.model';
import { CareerService } from '../college-career/services/career.service';
import { Career } from 'src/app/shared/models/career.model';
import { BannerLocation } from 'src/app/shared/enums/action-type.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FacultyFilterService } from 'src/app/shared/services/faculty-filter.service';
declare var $: any

@Component({
  selector: 'app-paid-banners',
  templateUrl: './paid-banners.component.html',
  styleUrls: ['./paid-banners.component.scss']
})
export class PaidBannersComponent implements OnInit {

  banners: PaidBanner[] = []
  careers: Career[] = []
  
  // Formulario y estado
  bannerForm: FormGroup
  selectedBanner: PaidBanner | null = null
  selectedImageFile: File | null = null
  isEditing: boolean = false
  
  // Enum para ubicaciones de banner
  bannerLocations = BannerLocation
  locationOptions = Object.values(BannerLocation).filter(key => isNaN(Number(key)))
  
  facultyId: number | null = null;
  
  // Añade esta propiedad a tu clase
  selectedImageUrl: string | ArrayBuffer | null = null;

  constructor(
    private paidBannersSv: PaidBannersService,
    private careerSv: CareerService,
    private modalService: NgbModal,
    private facultyFilterService: FacultyFilterService
  ) { }

  ngOnInit(): void {
    this.getCareers()
    this.getBanners()
    this.getFaculty()
  }

  getCareers() {
    this.careerSv.getCareer().subscribe(
      (data) => {
        this.careers = data
      },
      (error) => {
        MyAlert.alert('Error al cargar las carreras', true)
      }
    )
  }

  getBanners() {
    this.paidBannersSv.getPaidBanners().subscribe(
      (response) => {
        this.banners = response
      },
      (error) => {
        MyAlert.alert('Error al cargar los banners pagados', true)
      }
    )
  }

  getFaculty() {
    this.facultyId = this.facultyFilterService.getCurrentFaculty()?.id || null
  }

  openBannerModal(content, banner: PaidBanner | null = null) {
    this.isEditing = !!banner;
    this.selectedBanner = banner ? {...banner} : null;
    this.initBannerForm();
    
    this.modalService.open(content, { 
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
  }

  initBannerForm() {
    this.bannerForm = new FormGroup({
      title: new FormControl(this.selectedBanner?.title || '', Validators.required),
      url: new FormControl(this.selectedBanner?.url || '', Validators.required),
      location: new FormControl(this.selectedBanner?.location || '', Validators.required),
      date_start: new FormControl(this.selectedBanner?.date_start?.toString().slice(0, 10) || '', Validators.required),
      date_end: new FormControl(this.selectedBanner?.date_end?.toString().slice(0, 10) || '', Validators.required),
      order: new FormControl(this.selectedBanner?.order || 1, Validators.required),
      career_id: new FormControl(this.selectedBanner?.career_id || null),
      image: new FormControl(null, this.selectedBanner?.image ? null : Validators.required)
    });
    
    // Si estamos editando y ya hay una imagen
    if (this.selectedBanner?.image) {
      setTimeout(() => {
        $('#img').attr('src', this.selectedBanner?.image.url);
      }, 10);
    }
    
    this.selectedImageFile = null;
  }

  // Y modifica el método addImg para usar esta propiedad
  addImg(event) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedImageUrl = reader.result;
        this.bannerForm.patchValue({
          image: 'valid'
        });
        this.bannerForm.get('image')?.markAsTouched();
      };
    }
  }

  saveBanner() {
    if (this.bannerForm.invalid) {
      Object.values(this.bannerForm.controls).forEach(control => {
        control.markAsTouched();
      });
      MyAlert.alert('Por favor complete todos los campos requeridos', true);
      return;
    }

    const formData = this.createFormData();
    
    if (this.isEditing && this.selectedBanner?.id) {
      this.updateBanner(this.selectedBanner.id, formData);
    } else {
      this.createBanner(formData);
    }
  }

  private createFormData(): FormData {
    const formData = new FormData();
    const formValue = this.bannerForm.value;
    
    // Añadir campos básicos
    formData.append('title', formValue.title);
    formData.append('url', formValue.url);
    formData.append('location', formValue.location);
    formData.append('date_start', formValue.date_start);
    formData.append('date_end', formValue.date_end);
    formData.append('order', formValue.order);
    
    // Añadir faculty_id hardcodeado
    formData.append('faculty_id', this.facultyId as any);
    
    // Añadir career_id si tiene valor
    if (formValue.career_id) {
      formData.append('career_id', formValue.career_id);
    }
    
    // Si hay una imagen seleccionada, la añadimos
    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    } else if (this.selectedBanner?.image?.id && this.isEditing) {
      // Si estamos editando y no se cambió la imagen, enviamos el ID de la imagen existente
      formData.append('image_id', this.selectedBanner.image.id.toString());
    }
    
    return formData;
  }

  createBanner(formData: FormData) {
    this.paidBannersSv.createPaidBanner(formData).subscribe(
      (response) => {
        MyAlert.alert('Banner creado correctamente');
        this.getBanners();
        this.modalService.dismissAll();
      },
      (error) => {
        MyAlert.alert('Error al crear el banner', true);
        console.error(error);
      }
    );
  }

  updateBanner(id: number, formData: FormData) {
    this.paidBannersSv.updatePaidBanner(id, formData).subscribe(
      (response) => {
        MyAlert.alert('Banner actualizado correctamente');
        this.getBanners();
        this.modalService.dismissAll();
      },
      (error) => {
        MyAlert.alert('Error al actualizar el banner', true);
        console.error(error);
      }
    );
  }

  traduceLocation(location: string) {
    switch (location as BannerLocation) {
      case BannerLocation.OPINIONS:
        return 'Opiniones';
      case BannerLocation.NOTES:
        return 'Notas';
      case BannerLocation.ALL:
        return 'Todos';
      default:
        return location; 
    }
  }

  deleteBanner(id: number) {
    if (confirm('¿Está seguro que desea eliminar este banner?')) {
      this.paidBannersSv.deletePaidBanner(id).subscribe(
        () => {
          MyAlert.alert('Banner eliminado correctamente');
          this.getBanners();
        },
        (error) => {
          MyAlert.alert('Error al eliminar el banner', true);
        }
      );
    }
  }
}
