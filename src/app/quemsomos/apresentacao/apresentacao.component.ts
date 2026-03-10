import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { SeoService } from 'src/app/service/seo.service';

@Component({
  selector: 'app-apresentacao',
  templateUrl: './apresentacao.component.html',
  styleUrls: ['./apresentacao.component.scss'],
})

export class ApresentacaoComponent implements OnInit {
  constructor(
    private analyticsService: AnalyticsService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'QuemSomos-Apresentacao',
      'QuemSomos-Apresentacao into view',
    );

    this.updateSeo();    
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Compilado de Leis | Plataforma de Pesquisa da Legislação Brasileira',
      description:
        'Conheça o Compilado de Leis, plataforma de pesquisa jurídica criada em 2014 que reúne Constituição, códigos e leis brasileiras para estudo e consulta.',
    });
  }
}
