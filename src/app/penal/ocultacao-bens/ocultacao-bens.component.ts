import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-ocultacao-bens',
  templateUrl: './ocultacao-bens.component.html',
  styleUrls: ['./ocultacao-bens.component.scss'],
})
export class OcultacaoBensComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: PenalService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'CodigoPenal-Ocultacao-Bens',
      'CodigoPenal-Ocultacao-Bens into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getOcultacaoBens().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Lei de Lavagem de Dinheiro (Lei 9.613/1998) - Ocultação de Bens | Compilado de Leis',
      description:
        'Consulte a Lei de Lavagem de Dinheiro (Lei 9.613/1998), que trata da ocultação de bens, direitos e valores, com artigos organizados para estudo e consulta jurídica.',
    });
  }
}
