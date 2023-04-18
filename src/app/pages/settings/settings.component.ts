import { Component, OnInit } from '@angular/core';
import { userData } from 'src/app/components/dash/header/header.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare var $:any

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  formUser: FormGroup

  constructor() { }

  ngOnInit(): void {
    this.formUser = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      newpassword: new FormControl('', Validators.required)
    })
    this.formUser.patchValue(userData)
    setTimeout(() => {
      $('#img').attr('src', userData.image.url)
    }, 10);
  }

  addImg(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const imgURL = URL.createObjectURL(file);
      this.formUser.get('image')?.patchValue(file)
      setTimeout(() => {
        $('#img').attr('src', imgURL)
      }, 10);
    }
  }

}
