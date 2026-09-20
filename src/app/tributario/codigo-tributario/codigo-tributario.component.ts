import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { TributarioService } from 'src/app/service/tributario.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-codigo-tributario',
  templateUrl: './codigo-tributario.component.html',
  styleUrls: ['./codigo-tributario.component.scss'],
})
export class CodigoTributarioComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: TributarioService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'Tributario-Codigo',
      'Tributario-Codigo into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getCodigoTributario().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Direito Tributário - Impostos, Leis e Legislação Tributária | Compilado de Leis',
      description:
        'Consulte conteúdos de Direito Tributário, incluindo impostos, princípios e legislação tributária organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
