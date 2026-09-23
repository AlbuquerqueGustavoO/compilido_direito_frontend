import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { CivilService } from 'src/app/service/civil.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-civil-normas-direito-brasileiro',
  templateUrl: './civil-normas-direito-brasileiro.component.html',
  styleUrls: ['./civil-normas-direito-brasileiro.component.scss'],
})
export class CivilNormasDireitoBrasileiroComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];
  erro: string | null = null;

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
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getNormasCivil(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
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
