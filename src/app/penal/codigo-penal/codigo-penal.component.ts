import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-codigo-processo-penal',
  templateUrl: './codigo-penal.component.html',
  styleUrls: ['./codigo-penal.component.scss'],
})
export class CodigoPenalComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];
  erro: string | null = null;

  constructor(
    private apiService: PenalService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent('CodigoPenal', 'CodigoPenal into view');
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getCodigoPenal(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Código Penal Brasileiro (Decreto-Lei 2.848/1940) - Texto Completo | Compilado de Leis',
      description:
        'Consulte o Código Penal Brasileiro (Decreto-Lei 2.848/1940) atualizado, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
