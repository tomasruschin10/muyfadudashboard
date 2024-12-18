import { Component, Input, OnInit } from '@angular/core';
import { OffersService } from '../../../pages/offers/services/offers.service';
import { Offer, Partner, OfferCategory } from '../../models/offer.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MyAlert, CreateFile } from '../../static-functions/myFunctions';
import { CareerService } from '../../../pages/college-career/services/career.service';
import { Career } from '../../models/career.model';
declare var $: any;

@Component({
  selector: 'app-offers-component',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
})
export class OffersComponent implements OnInit {
  @Input() category: number;
  offers: Offer[] = [];
  partners: Partner[];
  partnersFilter: Partner[];
  categories: OfferCategory[];
  categoriesFilter: OfferCategory[];
  careers: Career[];
  formOffer: FormGroup;
  offer: Offer | any;
  form;
  page: number = 1;

  constructor(
    private offertsSv: OffersService,
    private route: Router,
    private careerSv: CareerService,
    private routeActive: ActivatedRoute
  ) {
    routeActive.queryParams.subscribe((data) => {
      this.form = data.form;
      if (this.form) this.initFormOffer();
    });
  }

  ngOnInit(): void {
    this.listOffers();
    this.listPartner();
    this.listCategories();
    this.listCareer();
  }

  async changeAprovedStatus(offerId) {
    try {
      const response = await this.offertsSv
        .changeApprovedStatus(offerId)
        .toPromise();
      console.log(response);
    } catch (error) {
      console.error('error ', error);
    }
  }
  initFormOffer() {
    this.offer = null;
    this.formOffer = new FormGroup({
      title: new FormControl('', Validators.required),
      offer_category_id: new FormControl(
        this.category == 3 ? '' : this.category,
        Validators.required
      ),
      career_id: new FormControl(null, Validators.required),
      description: new FormControl(''),
      phone: new FormControl(''),
      name: new FormControl(''),
      company: new FormControl(
        '',
        this.category === 1 ? Validators.required : null
      ),
      point: new FormControl(0, Validators.required),
      url: new FormControl(''),
      email: new FormControl(''),
      image: new FormControl('', Validators.required),
    });
    if (this.offers?.length > 0 && this.form != 'create' && this.form) {
      this.offer = this.offers[this.form];
      this.formOffer.patchValue(this.offers[this.form]);
    } else {
      this.categories = this.categoriesFilter;
      this.partners = this.partnersFilter;
    }
  }

  async listOffers() {
    let data;
    if (this.category == 1) {
      data = await this.offertsSv.getAdminOffersWork().toPromise();
    } else if (this.category == 2) {
      data = await this.offertsSv.getAdminOffersCourse().toPromise();
    } else {
      data = await this.offertsSv.getAdminOffers().toPromise();
    }
    this.offers = data.body;
    this.initFormOffer();
  }

  listPartner() {
    this.offertsSv.getPartner().subscribe((data: any) => {
      this.partners = data.body;
      this.partnersFilter = data.body;
    });
  }

  listCategories() {
    this.offertsSv.getCategories().subscribe((data: any) => {
      this.categories = data.body;
      this.categoriesFilter = data.body;
    });
  }

  listCareer() {
    this.careerSv.getCareer().subscribe((data: any) => {
      this.careers = data.body;
    });
  }

  async createOrEdit(form, id) {
    try {
      if (this.formOffer.invalid) return this.formOffer.markAllAsTouched();

      // Verifica si se seleccionó "Todas"
      if (form.career_id === 'all') {
        // Hacer una solicitud por cada carrera
        const requests = this.careers.map(async (career) => {
          const formData = new FormData();
          formData.append('career_id', career.id.toString()); // Asigna el ID actual
          Object.keys(this.formOffer.controls).forEach((key) => {
            const controlValue = form[key] ?? this.formOffer.get(key)?.value;
            if (controlValue instanceof File) {
              formData.append(key, controlValue, controlValue.name);
            } else if (key !== 'career_id') {
              formData.append(key, controlValue);
            }
          });

          // Realizar la solicitud para cada carrera
          return this.offertsSv.postOffers(formData).toPromise();
        });

        try {
          await Promise.all(requests); // Esperar que todas las solicitudes se completen
          MyAlert.alert('Todas las ofertas han sido creadas!');
          this.route.navigate([]);
        } catch (error) {
          console.error('Error al crear ofertas:', error);
          MyAlert.alert('Ha ocurrido un error al crear las ofertas!', true);
        }
        return;
      }

      // Lógica existente si no se selecciona "Todas"
      const formData = new FormData();
      if (!id) formData.append('partner_id', form.partner_id);
      Object.keys(this.formOffer.controls).forEach((key) => {
        const controlValue = form[key] ?? this.formOffer.get(key)?.value;
        if (controlValue instanceof File) {
          formData.append(key, controlValue, controlValue.name);
        } else {
          formData.append(key, controlValue);
        }
      });

      if (id) {
        await this.offertsSv.putOffers(formData, id).toPromise();
        MyAlert.alert('Oferta editada!');
      } else {
        await this.offertsSv.postOffers(formData).toPromise();
        MyAlert.alert('Oferta creada!');
      }
      this.route.navigate([]);
    } catch (error) {
      console.error('Error general:', error);
      MyAlert.alert('Ha ocurrido un error!', true);
    }
  }

  delete(id, i, name) {
    setTimeout(() => {
      $(name == 'patrocinador' ? '#partner_id' : '#offer_category_id').trigger(
        'click'
      );
    }, 0);
    Swal.fire({
      position: 'center',
      text: '¿Seguro que desea eliminar ' + name + '?',
      width: 350,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Eliminar',
      reverseButtons: true,
      customClass: {
        actions: 'mt-1',
        confirmButton: 'btn-danger',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (name == 'patrocinador') {
          this.offertsSv.deletePartner(id).subscribe((data) => {
            this.partners.splice(i, 1);
            MyAlert.alert('Patrocinador eliminado!');
          });
        } else if (name == 'categoria') {
          this.offertsSv.deleteCategories(id).subscribe((data) => {
            this.categories.splice(i, 1);
            MyAlert.alert('Categoria eliminada!');
          });
        } else {
          this.offertsSv.deleteOffers(id).subscribe((data) => {
            this.offers.splice(i, 1);
            MyAlert.alert('Oferta eliminada!');
          });
        }
      }
    });
  }

  addImg(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const imgURL = URL.createObjectURL(file);
      this.formOffer.get('image')?.patchValue(file);
      setTimeout(() => {
        $('#img').attr('src', imgURL);
      }, 10);
    }
  }

  filterList(id, filter, item?) {
    const list = filter.filter((newList) => {
      return newList.name.toUpperCase().includes(
        item
          ? item.name?.toUpperCase()
          : $('#' + id)
              .val()
              ?.toUpperCase()
      );
    });
    id == 'partner_id' ? (this.partners = list) : (this.categories = list);
    setTimeout(() => {
      if (
        item
          ? item.name
          : $('#' + id)
              .val()
              ?.toUpperCase() ==
            $('#item_' + id)
              .html()
              ?.toUpperCase()
      ) {
        this.formOffer.controls[id].patchValue($('#item_' + id).val());
        $('#' + id).val($('#item_' + id).html());
      } else {
        this.formOffer.controls[id].patchValue($('#' + id).val() ? true : '');
      }
      this.formOffer.controls[id].markAsTouched();
    }, 10);
  }

  async copyOffer(item) {
    const img = await CreateFile.createFile(item.image.url);
    this.formOffer.patchValue({ ...item, image: img });
    this.createOrEdit(this.formOffer.value, null);
  }
}
