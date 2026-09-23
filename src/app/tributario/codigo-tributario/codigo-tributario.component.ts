import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { TributarioService } from 'src/app/service/tributario.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-codigo-tributario',
  templateUrl: './codigo-tributario.component.html',
  styleUrls: ['./codigo-tributario.component.scss'],
})
export class CodigoTributarioComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];
  erro: string | null = null;

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
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getCodigoTributario(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
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
