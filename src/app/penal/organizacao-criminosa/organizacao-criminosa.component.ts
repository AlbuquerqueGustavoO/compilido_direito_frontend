import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-organizacao-criminosa',
  templateUrl: './organizacao-criminosa.component.html',
  styleUrls: ['./organizacao-criminosa.component.scss'],
})
export class OrganizacaoCriminosaComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: PenalService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'CodigoPenal-Organizacao-Criminosa',
      'CodigoPenal-Organizacao-Criminosa into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getOrganizacaoCriminosa().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Lei de Organização Criminosa (Lei 12.850/2013) - Texto Completo | Compilado de Leis',
      description:
        'Consulte a Lei de Organização Criminosa (Lei 12.850/2013) atualizada, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
