import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { ConstituicaoService } from 'src/app/service/constituicao.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';
import { parseConstituicaoText } from './constituicao-text-parser';

@Component({
  selector: 'app-constituicao',
  templateUrl: './constituicao.component.html',
  styleUrls: ['./constituicao.component.scss'],
})
export class ConstituicaoComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];
  erro: string | null = null;

  constructor(
    private apiService: ConstituicaoService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent('Constitucional', 'Constitucional into view');
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(
      this.apiService.getConstituicao(),
      {
        onEntradas: (entradas) => this.entradas = entradas,
        onLoadingChange: (loading) => this.loading = loading,
        onErro: (erro) => this.erro = erro,
      },
      parseConstituicaoText,
    );
  }

  updateSeo() {
    this.seo.updateSeo({
      title: 'Direito Constitucional - Constituição e Leis Constitucionais | Compilado de Leis',
      description:
        'Consulte conteúdos de Direito Constitucional, incluindo Constituição Federal, constituições estaduais e artigos organizados para estudo e consulta jurídica.',
    });
  }
}
