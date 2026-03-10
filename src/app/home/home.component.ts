import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../service/analytics.service';
import { SeoService } from '../service/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) {}

  ngOnInit(): void {
    this.analyticsService.trackEvent('Home', 'Home into view');
    this.updateSeo();
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Compilado de Leis | Constituição, Códigos e Leis Brasileiras para Estudo',
      description:
        'Conheça o Compilado de Leis, plataforma que reúne Constituição, códigos e leis brasileiras organizadas para estudo jurídico, concursos públicos e consulta.',
    });
  }
}
