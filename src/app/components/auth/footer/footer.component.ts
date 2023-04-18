import { LOCALE_ID, Inject, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  test: Date = new Date();

  constructor(
    @Inject(LOCALE_ID) public locale: string
  ) { }

  ngOnInit() {
  }

}
