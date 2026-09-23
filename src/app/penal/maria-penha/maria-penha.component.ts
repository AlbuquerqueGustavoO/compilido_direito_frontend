import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-maria-penha',
  templateUrl: './maria-penha.component.html',
  styleUrls: ['./maria-penha.component.scss'],
})
export class MariaPenhaComponent implements OnInit {
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
      'CodigoPenal-Maria-Penha',
      'CodigoPenal-Maria-Penha into view',
    );
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getMariaPenha(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Lei Maria da Penha (Lei 11.340/2006) - Texto Completo e Atualizado | Compilado de Leis',
      description:
        'Consulte a Lei Maria da Penha (Lei 11.340/2006) atualizada, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
