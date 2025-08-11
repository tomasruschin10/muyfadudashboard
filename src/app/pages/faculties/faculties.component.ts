import { Component, OnInit } from '@angular/core';
import { FacultiesService } from './services/faculties.service';
import { Faculty } from 'src/app/shared/models/faculty.model';

@Component({
  selector: 'app-faculties',
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.scss']
})

export class FacultiesComponent implements OnInit {

  faculties: Faculty[] = []

  constructor(
    private service: FacultiesService
  ) { }

  ngOnInit(): void {
    this.loadFaculties()
  }


  loadFaculties() {
    this.service.getAll().subscribe(
      (data) => {
        this.faculties = data
      }
    )
  }

}
