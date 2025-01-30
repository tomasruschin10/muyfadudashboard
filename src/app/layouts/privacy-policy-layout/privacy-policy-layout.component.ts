import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-privacy-policy-layout',
  templateUrl: './privacy-policy-layout.component.html',
  styleUrls: ['./privacy-policy-layout.component.scss'],
})
export class PrivacyPolicyLayoutComponent {
  title = 'front-osmos';
  // externalUrl: string = 'https://tomsr13.sg-host.com/privacy-policy/';
  externalUrl: string = environment.API_URL;
  safeExternalUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.safeExternalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.externalUrl
    );
  }
}
