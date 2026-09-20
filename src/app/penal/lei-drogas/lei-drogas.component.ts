import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-lei-drogas',
  templateUrl: './lei-drogas.component.html',
  styleUrls: ['./lei-drogas.component.scss'],
})
export class LeiDrogasComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: PenalService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'CodigoPenal-Lei-Drogas',
      'CodigoPenal-Lei-Drogas into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getDrogas().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Lei de Drogas (Lei 11.343/2006) - Texto Completo e Atualizado | Compilado de Leis',
      description:
        'Consulte a Lei de Drogas (Lei 11.343/2006) atualizada, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
