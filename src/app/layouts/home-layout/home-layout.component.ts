import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss'],
})
export class HomeLayoutComponent {
  title = 'front-osmos';
  externalUrl: string = environment.API_URL;
  safeExternalUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.safeExternalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.externalUrl
    );
  }
}
