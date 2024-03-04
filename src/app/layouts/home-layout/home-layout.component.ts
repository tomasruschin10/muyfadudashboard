import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Agrega esta línea

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss'],
})
export class HomeLayoutComponent {
  title = 'front-osmos';
  externalUrl: string = 'https://tomsr13.sg-host.com/';
  safeExternalUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.safeExternalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.externalUrl
    );
  }
}
