import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OffersService } from '../offers/services/offers.service';
import { Offer } from '../../shared/models/offer.model';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  offer: Offer

  constructor(
    private routeActive: ActivatedRoute,
    private offerSv: OffersService,
  ) { 
    routeActive.queryParams.subscribe(data =>{
      offerSv.getByIdOffer(data.offer).toPromise().then(({body}:any) =>{
        this.offer = body
      }).catch(error =>{
        alert('Oferta no existe')
      })
    })
  }

  ngOnInit(): void {
  }

}
