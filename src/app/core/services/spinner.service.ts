import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  // viene de RxJS
  inProgress = new Subject<boolean>();

  constructor() {}

  // mostrar el spining
  show() {
    this.inProgress.next(true);
  }

  // ocultar el spining
  hide() {
    this.inProgress.next(false);
  }
}
