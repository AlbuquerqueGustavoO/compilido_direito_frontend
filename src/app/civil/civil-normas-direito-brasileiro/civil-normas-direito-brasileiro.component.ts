import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { CivilService } from 'src/app/service/civil.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-civil-normas-direito-brasileiro',
  templateUrl: './civil-normas-direito-brasileiro.component.html',
  styleUrls: ['./civil-normas-direito-brasileiro.component.scss'],
})
export class CivilNormasDireitoBrasileiroComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: CivilService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'civil normas direito',
      'civil normas direito into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getNormasCivil().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Lei de Introdução às Normas do Direito Brasileiro (LINDB) - Texto Completo | Compilado de Leis',
      description:
        'Consulte a Lei de Introdução às Normas do Direito Brasileiro (LINDB) atualizada, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
