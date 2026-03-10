import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { SeoService } from 'src/app/service/seo.service';

@Component({
  selector: 'app-referencias',
  templateUrl: './referencias.component.html',
  styleUrls: ['./referencias.component.scss'],
})

export class ReferenciasComponent implements OnInit {
  constructor(
    private analyticsService: AnalyticsService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'QuemSomos-Referencias',
      'QuemSomos-Referencias into view',
    );

    this.updateSeo();
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Referências do Compilado de Leis | Fontes da Legislação Brasileira',
      description:
        'Consulte as referências e fontes utilizadas no Compilado de Leis, incluindo legislação oficial, códigos e normas jurídicas brasileiras.',
    });
  }
}
