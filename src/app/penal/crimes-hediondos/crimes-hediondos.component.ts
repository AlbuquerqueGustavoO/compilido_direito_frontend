import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-crimes-hediondos',
  templateUrl: './crimes-hediondos.component.html',
  styleUrls: ['./crimes-hediondos.component.scss'],
})
export class CrimesHediondosComponent implements OnInit {
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
      'CodigoPenal-Crimes-Hediondos',
      'CodigoPenal-Crimes-Hediondos into view',
    );
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getCrimesHediondosPenal(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
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
