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
  myGroup: FormGroup;
  formCareer: FormGroup;
  form;
  careerId: number | null;
  subjects: Array<any>;
  allSubjects: Array<any> = [];
  allLabels: Array<string> = [];
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
          this.allSubjects = this.getAllSubjects(this.subjects);
          this.allLabels = this.getAllLabels(this.subjects);
        });
      setTimeout(() => {
        $('#img').attr('src', this.careers[this.form].image.url);
      }, 10);
    }
  }

  getAllSubjects(subjects: any[]): any[] {
    return subjects.reduce((acc, subjectGroup) => {
      return acc.concat(
        subjectGroup.subject.map((subject: any) => ({
          ...subject,
          level: subjectGroup.name,
        }))
      );
    }, []);
  }

  getAllLabels(subjects: any[]): string[] {
    const labelsSet = subjects.reduce((acc, subjectGroup) => {
      subjectGroup.subject.forEach((subject: any) => {
        if (subject.label) {
          acc.add(subject.label);
        }
      });
      return acc;
    }, new Set<string>());

    return Array.from(labelsSet);
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
          selectiveSubject: this.subjects[i].selectiveSubject,
          chairs: this.subjects[i].chairs,
          conditions: this.subjects[i].conditions,
          label: this.subjects[i].label,
          subjectParent: this.subjects[i].subjectParent,
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
    if (!isSelective) this.subjects[i].subject[iS].selectiveSubjects = [];
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
      if (this.subjects[i].subject[iS]?.id) {
        this.subjects[i].subject[iS].edit = true;
      }
      const subject = this.subjects[i].subject[iS];
      if (value.trim()) {
        if (!subject.selectiveSubjects) {
          subject.selectiveSubjects = [];
        }
        const materiasArray = value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item);
        subject.selectiveSubjects.push(...materiasArray);
      }
      subject.selectiveSubject = '';
    } else {
      if (!this.subjects[i].selectiveSubjects) {
        this.subjects[i].selectiveSubjects = [];
      }
      if (value.trim()) {
        const materiasArray = value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item);
        this.subjects[i].selectiveSubjects.push(...materiasArray);
      }
      this.subjects[i].selectiveSubject = '';
    }
  }

  removeSelectiveSubject(i: number, iS: number, j: number) {
    if (iS !== undefined) {
      const subject = this.subjects[i].subject[iS];
      if (subject?.selectiveSubjects && subject.selectiveSubjects.length > j) {
        subject.selectiveSubjects.splice(j, 1);
        this.subjects[i].subject[iS].edit = true;
      }
    } else {
      if (
        this.subjects[i]?.selectiveSubjects &&
        this.subjects[i].selectiveSubjects.length > j
      ) {
        this.subjects[i].selectiveSubjects.splice(j, 1);
        this.subjects[i].edit = true;
      }
    }
    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id)
      this.subjects[i].edit = true;
  }

  addChair(value, i, iS?) {
    if (iS !== undefined) {
      if (this.subjects[i].subject[iS]?.id) {
        this.subjects[i].subject[iS].edit = true;
      }
      const subject = this.subjects[i].subject[iS];
      if (value.trim()) {
        if (!subject.chairs) {
          subject.chairs = [];
        }
        const materiasArray = value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item);
        subject.chairs.push(...materiasArray);
      }
      subject.selectiveSubject = '';
    } else {
      if (!this.subjects[i].chairs) {
        this.subjects[i].chairs = [];
      }
      if (value.trim()) {
        const materiasArray = value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item);
        this.subjects[i].chairs.push(...materiasArray);
      }
      this.subjects[i].chairs = '';
    }
    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id)
      this.subjects[i].edit = true;
  }

  removeChair(i: number, iS: number, j: number) {
    if (iS !== undefined) {
      const subject = this.subjects[i].subject[iS];
      if (subject?.chairs && subject.chairs.length > j) {
        subject.chairs.splice(j, 1);
        this.subjects[i].subject[iS].edit = true;
      }
    } else {
      if (this.subjects[i]?.chairs && this.subjects[i].chairs.length > j) {
        this.subjects[i].chairs.splice(j, 1);
        this.subjects[i].edit = true;
      }
    }
    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id)
      this.subjects[i].edit = true;
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

  addCorrelative(value, i, iS) {
    if (value) {
      const selectedSubject = this.allSubjects.find(
        (subject) => subject.id === parseInt(value)
      );
      if (selectedSubject) {
        this.subjects[i].subject[iS].subjectParent =
          this.subjects[i].subject[iS].subjectParent || [];
        this.subjects[i].subject[iS].subjectParent.push({
          subject_id: this.subjects[i].subject[iS].id,
          subject_parent_id: parseInt(value),
          created_at: new Date().toISOString(),
          parent: selectedSubject,
          orSubjectParents: [],
        });
      }
    }
  }

  removeCorrelative(i, iS, j) {
    this.subjects[i].subject[iS].subjectParent.splice(j, 1);
    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id)
      this.subjects[i].edit = true;
    if (this.subjects[i].subject[iS]?.id)
      this.subjects[i].subject[iS].edit = true;
  }

  selectOrCorrelative(i: number, iS: number, j: number, value) {
    if (value.includes('index')) {
      value = value.replace('index', '');
      delete this.subjects[i].subject[iS].subjectParent[j].orSubjectParents_id;
      this.subjects[i].subject[iS].subjectParent[j].orSubjectParents_key =
        value;
    }

    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id) {
      this.subjects[i].edit = true;
    }
    if (this.subjects[i].subject[iS]?.id) {
      this.subjects[i].subject[iS].edit = true;
    }
  }

  addOrCorrelative(value: string, i: number, iS: number, j: number) {
    if (value) {
      const newOrCorrelativeIdParsed = parseInt(value);
      if (!isNaN(newOrCorrelativeIdParsed)) {
        const selectedOrSubject = this.allSubjects.find(
          (subject) => subject.id === newOrCorrelativeIdParsed
        );
        if (selectedOrSubject) {
          if (!this.subjects[i].subject[iS].subjectParent[j].orSubjectParents) {
            this.subjects[i].subject[iS].subjectParent[j].orSubjectParents = [];
          }
          this.subjects[i].subject[iS].subjectParent[j].push({
            subject_id: this.subjects[i].subject[iS].id,
            subject_parent_id: newOrCorrelativeIdParsed,
            parent: selectedOrSubject,
          });
        }
      } else {
        console.error('Invalid ID entered');
      }
    }
  }

  removeOrCorrelative(i: number, iS: number, j: number, k: number) {
    this.subjects[i].subject[iS].subjectParent[j].orSubjects.splice(k, 1);
    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id)
      this.subjects[i].edit = true;
    if (this.subjects[i].subject[iS]?.id)
      this.subjects[i].subject[iS].edit = true;
  }

  getSubjectNameById(id: number): string {
    for (let subjectGroup of this.subjects) {
      if (subjectGroup.id === id) {
        return subjectGroup.name;
      }
    }
    return '';
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

  setLabelValue(value, i, iS?): void {
    if (iS !== undefined) {
      this.subjects[i].subject[iS].label = value;
      if (this.subjects[i].subject[iS]?.id) {
        this.subjects[i].subject[iS].edit = true;
      }
    } else {
      this.subjects[i].label = value;
    }

    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id) {
      this.subjects[i].edit = true;
    }
  }

  addCondition(i: number, iS: number) {
    if (!this.subjects[i].subject[iS].conditions) {
      this.subjects[i].subject[iS].conditions = [];
    }
    this.subjects[i].subject[iS].conditions.push({
      number: null,
      approvedLabel: '',
      exemptedLabel: '',
    });

    if (this.subjects[i].subject[iS]?.id) {
      this.subjects[i].subject[iS].edit = true;
    }

    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id) {
      this.subjects[i].edit = true;
    }
  }

  removeCondition(i: number, iS: number, j: number) {
    this.subjects[i].subject[iS].conditions.splice(j, 1);
    if (this.subjects[i].subject[iS]?.id) {
      this.subjects[i].subject[iS].edit = true;
    }
    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id) {
      this.subjects[i].edit = true;
    }
  }

  saveCondition(i: number, iS: number, j: number) {
    const condition = this.subjects[i].subject[iS].conditions[j];

    this.subjects[i].subject[iS].conditions[j] = {
      number: condition.number,
      approvedLabel: condition.approvedLabel,
      exemptedLabel: condition.exemptedLabel,
    };

    if (this.subjects[i].subject[iS]?.id) {
      this.subjects[i].subject[iS].edit = true;
    }
    if (this.subjects[i]?.id || this.subjects[i].subject[iS]?.id) {
      this.subjects[i].edit = true;
    }
  }
}
