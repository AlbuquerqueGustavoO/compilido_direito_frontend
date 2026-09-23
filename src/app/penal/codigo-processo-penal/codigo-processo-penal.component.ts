import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-codigo-processo-penal',
  templateUrl: './codigo-processo-penal.component.html',
  styleUrls: ['./codigo-processo-penal.component.scss'],
})
export class CodigoProcessoPenalComponent implements OnInit {
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
      'CodigoPenal-Processo',
      'CodigoPenal-Processo into view',
    );
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getCodigoProcessoPenal(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Código de Processo Penal (Decreto-Lei 3.689/1941) - Texto Completo | Compilado de Leis',
      description:
        'Consulte o Código de Processo Penal Brasileiro (Decreto-Lei 3.689/1941) atualizado, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
