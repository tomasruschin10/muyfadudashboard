import { Component, OnInit } from '@angular/core';

export let userData
export let setUserData 

@Component({
  selector: 'app-dash-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userData

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


}
