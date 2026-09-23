import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { ConstituicaoService } from 'src/app/service/constituicao.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-constitucional-estado-sp',
  templateUrl: './constitucional-estado-sp.component.html',
  styleUrls: ['./constitucional-estado-sp.component.scss'],
})
export class ConstitucionalEstadoSpComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];
  erro: string | null = null;

  constructor(
    private apiService: ConstituicaoService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'Constitucional-Estado-SP',
      'Constitucional-Estado-SP into view',
    );
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getConstituicaoEstadoSP(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Constituição do Estado de São Paulo (SP) - Texto Completo | Compilado de Leis',
      description:
        'Leia a Constituição do Estado de São Paulo atualizada, organizada por artigos para estudo, concursos e consulta jurídica rápida.',
    });
  }
}
