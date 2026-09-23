import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-ocultacao-bens',
  templateUrl: './ocultacao-bens.component.html',
  styleUrls: ['./ocultacao-bens.component.scss'],
})
export class OcultacaoBensComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];
  erro: string | null = null;

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
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getOcultacaoBens(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
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
