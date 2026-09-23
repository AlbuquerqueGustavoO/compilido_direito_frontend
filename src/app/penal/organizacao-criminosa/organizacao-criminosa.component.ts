import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-organizacao-criminosa',
  templateUrl: './organizacao-criminosa.component.html',
  styleUrls: ['./organizacao-criminosa.component.scss'],
})
export class OrganizacaoCriminosaComponent implements OnInit {
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
      'CodigoPenal-Organizacao-Criminosa',
      'CodigoPenal-Organizacao-Criminosa into view',
    );
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getOrganizacaoCriminosa(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
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
