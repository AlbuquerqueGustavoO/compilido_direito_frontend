import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-crimes-hediondos',
  templateUrl: './crimes-hediondos.component.html',
  styleUrls: ['./crimes-hediondos.component.scss'],
})
export class CrimesHediondosComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: PenalService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'CodigoPenal-Crimes-Hediondos',
      'CodigoPenal-Crimes-Hediondos into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getCrimesHediondosPenal().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Lei dos Crimes Hediondos (Lei 8.072/1990) - Texto Completo | Compilado de Leis',
      description:
        'Consulte a Lei dos Crimes Hediondos (Lei 8.072/1990) atualizada, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
