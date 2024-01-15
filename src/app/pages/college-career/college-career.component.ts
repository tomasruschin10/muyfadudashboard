import { Component, OnInit } from '@angular/core';
import { Career, Subject } from 'src/app/shared/models/career.model';
import { CareerService } from './services/career.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { MyAlert } from '../../shared/static-functions/myFunctions';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-college-career',
  templateUrl: './college-career.component.html',
  styleUrls: ['./college-career.component.scss'],
})
export class CollegeCareerComponent implements OnInit {
  careers: Career[] = [];
  formCareer: FormGroup;
  form;
  careerId: number | null;
  subjects: Array<any>;
  deleteSubjects: Array<any> = [];
  deleteLevels: Array<any> = [];
  page: number = 1;
  last: number;

  constructor(
    private careerSv: CareerService,
    private route: Router,
    private routeActive: ActivatedRoute,
    private spinnerSv: NgxSpinnerService
  ) {
    routeActive.queryParams.subscribe((data) => {
      this.form = data.form;
      if (this.form) this.initFormCareer();
    });
  }

  ngOnInit(): void {
    this.listCareer();
  }

  initFormCareer() {
    this.subjects = [{ name: '', career_id: '', subject: [{ name: '' }] }];
    this.careerId = null;
    this.deleteLevels = [];
    this.deleteSubjects = [];
    this.formCareer = new FormGroup({
      name: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
    });
    if (this.careers?.length > 0 && this.form != 'create' && this.form) {
      this.careerId = this.careers[this.form].id;
      this.formCareer.patchValue(this.careers[this.form]);
      this.careerSv
        .getSubjectCategory(this.careers[this.form].id)
        .subscribe((data: any) => {
          this.subjects = data.body;
        });
      setTimeout(() => {
        $('#img').attr('src', this.careers[this.form].image.url);
      }, 10);
    }
  }

  listCareer() {
    this.careerSv.getCareer().subscribe((data: any) => {
      this.careers = data.body;
      if (this.form) this.initFormCareer();
    });
  }

  createOrEdit(form, id) {
    if (this.formCareer.invalid) return this.formCareer.markAllAsTouched();
    if (this.subjects.some((x) => !x.name || x.subject.some((y) => !y.name)))
      return MyAlert.alert('No pueden haber campos vacios!', true);
    const formdata: any = new FormData();
    for (let [item, value] of Object.entries(form)) {
      formdata.append(item, value);
    }
    if (id) {
      this.careerSv
        .putCareer(formdata, id)
        .toPromise()
        .then((data: any) => {
          const newData: any = {
            ...data.body,
            image: { url: data.body.image_url },
          };
          this.careers[this.form] = newData;
          this.createLevel(data.body.id);
        })
        .catch((error) => {
          MyAlert.alert(error.error.message, true);
        });
    } else {
      this.careerSv
        .postCareer(formdata)
        .toPromise()
        .then((data: any) => {
          const newData: any = {
            ...data.body,
            image: { url: data.body.image_url },
          };
          this.careers.unshift(newData);
          this.createLevel(data.body.id);
        })
        .catch((error) => {
          MyAlert.alert(error.error.message, true);
        });
    }
  }

  createLevel(id) {
    let interval;
    let i = 0;
    this.spinnerSv.show();
    interval = setInterval(async () => {
      this.spinnerSv.show();
      if (i < this.subjects.length) {
        const form = {
          name: this.subjects[i].name,
          description: this.subjects[i].description,
          career_id: id,
        };
        try {
          if (!this.subjects[i]?.id) {
            const data: any = await this.careerSv
              .postSubjectCategory(form)
              .toPromise();
            for (let item of this.subjects[i].subject) {
              item.subject_category_id = data.body.id;
            }
            this.careerSv
              .postSubject({ data: this.subjects[i].subject })
              .toPromise();
            this.spinnerSv.show();
          } else if (this.subjects[i]?.edit) {
            const data: any = await this.careerSv
              .putSubjectCategory(form, this.subjects[i].id)
              .toPromise();
            const formsubject: any = {
              data: [],
              deleteData: this.deleteSubjects,
            };
            for (let item of this.subjects[i].subject) {
              item.subject_category_id = data.body.id;
              item.url = '';
              if (item?.edit || !item?.id) formsubject.data.push(item);
            }
            this.careerSv.putSubject(formsubject).toPromise();
            this.spinnerSv.show();
          }
        } catch (error: any) {
          clearInterval(interval);
          return MyAlert.alert(error.error.message, true);
        }
        i++;
      } else {
        clearInterval(interval);
        this.deleteLevels.forEach(async (item) => {
          await this.careerSv.deleteSubjectCategory(item).toPromise();
        });
        this.spinnerSv.hide();
        MyAlert.alert(this.careerId ? 'Carrera editada!' : 'Carrera creada!');
        this.route.navigate([]);
      }
    }, 800);
  }

  delete(id, i) {
    Swal.fire({
      position: 'center',
      text: '¿Seguro que desea eliminar esta carrera?',
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
        this.careerSv.deleteCareer(id).subscribe((data) => {
          this.careers.splice(i, 1);
          MyAlert.alert('Carrera eliminada!');
        });
      }
    });
  }

  deleteLevel(i, item) {
    if (item?.id) this.deleteLevels.push(item.id);
    this.subjects.splice(i, 1);
  }

  deleteSubject(i, item, iS) {
    if (item?.id) this.deleteSubjects.push(item.id);
    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id)
      this.subjects[i].edit = true;
    this.subjects[i].subject.splice(iS, 1);
  }

  setPrefix(value, i, iS?) {
    if (iS !== undefined) {
      this.subjects[i].subject[iS].prefix = value;
      if (this.subjects[i].subject[iS]?.id)
        this.subjects[i].subject[iS].edit = true;
    } else {
      this.subjects[i].prefix = value;
    }
    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id)
      this.subjects[i].edit = true;
  }
  setSubjectDescription(value, i, iS?) {
    if (iS !== undefined) {
      this.subjects[i].subject[iS].info = value;
      if (this.subjects[i].subject[iS]?.id)
        this.subjects[i].subject[iS].edit = true;
    } else {
      this.subjects[i].info = value;
    }
    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id)
      this.subjects[i].edit = true;
  }
  setSubjectSelective(value, i, iS?) {
    const isSelective = value === 'true';

    if (iS !== undefined) {
      this.subjects[i].subject[iS].selective = isSelective;
      if (this.subjects[i].subject[iS]?.id) {
        this.subjects[i].subject[iS].edit = true;
      }
    } else {
      this.subjects[i].selective = isSelective;
    }
    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id) {
      this.subjects[i].edit = true;
    }
  }
  addSelectiveSubject(value, i, iS?) {
    if (iS !== undefined) {
      const subject = this.subjects[i].subject[iS];
      if (value.trim()) {
        if (!subject.selectiveSubjects) {
          subject.selectiveSubjects = [];
        }
        const materiasArray = value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item); // Filtra las materias válidas
        subject.selectiveSubjects.push(...materiasArray);
      }
      subject.selectiveSubject = ''; // Limpia el campo de entrada
    } else {
      if (!this.subjects[i].selectiveSubjects) {
        this.subjects[i].selectiveSubjects = [];
      }
      if (value.trim()) {
        const materiasArray = value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item); // Filtra las materias válidas
        this.subjects[i].selectiveSubjects.push(...materiasArray);
      }
      this.subjects[i].selectiveSubject = ''; // Limpia el campo de entrada
    }
  }

  setValue(value, i, iS?) {
    if (iS !== undefined) {
      this.subjects[i].subject[iS].name = value;
      if (this.subjects[i].subject[iS]?.id)
        this.subjects[i].subject[iS].edit = true;
    } else {
      this.subjects[i].name = value;
    }
    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id)
      this.subjects[i].edit = true;
  }
  setDescription(value, i, iS?) {
    if (iS !== undefined) {
      this.subjects[i].subject[iS].description = value;
      if (this.subjects[i].subject[iS]?.id)
        this.subjects[i].subject[iS].edit = true;
    } else {
      this.subjects[i].description = value;
    }
    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id)
      this.subjects[i].edit = true;
  }
  selectCorrelative(i, iS, value) {
    if (value.includes('index')) {
      value = value.replace('index', '');
      delete this.subjects[i].subject[iS].subject_id;
      this.subjects[i].subject[iS].subject_key = value;
    } else {
      delete this.subjects[i].subject[iS].subject_key;
      this.subjects[i].subject[iS].subject_id = value;
    }
    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id)
      this.subjects[i].edit = true;
    if (this.subjects[i].subject[iS]?.id)
      this.subjects[i].subject[iS].edit = true;
  }

  addImg(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const imgURL = URL.createObjectURL(file);
      this.formCareer.get('image')?.patchValue(file);
      setTimeout(() => {
        $('#img').attr('src', imgURL);
      }, 10);
    }
  }
}
