import { Component, OnInit } from '@angular/core';
import { Faculty } from 'src/app/shared/models/faculty.model';

export let userData
export let setUserData 

@Component({
  selector: 'app-dash-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userData
  faculties: Faculty[] = []; // Asume que tienes un tipo Faculty definido
  selectedFaculty: Faculty | null = null;

  constructor() {
    userData = sessionStorage.getItem('userData')
    userData = JSON.parse(userData);
    this.userData = userData
  }

  ngOnInit() {
    setUserData = (newUserData) => {
      this.userData = newUserData
      sessionStorage.setItem('userData', JSON.stringify(newUserData))
    }
  }


  logout() {
    sessionStorage.removeItem('token');
    window.location.reload();
  }

    selectFaculty(faculty: Faculty) {
    this.selectedFaculty = faculty;
  }


}
