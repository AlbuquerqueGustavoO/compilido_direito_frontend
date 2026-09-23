import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-servicos-publicos',
  templateUrl: './servicos-publicos.component.html',
  styleUrls: ['./servicos-publicos.component.scss'],
})
export class ServicosPublicosComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];
  erro: string | null = null;

  constructor(
    private apiService: AdministrativoService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'Administrativo-Servicos-Publico',
      'Administrativo-Servicos-Publico into view',
    );
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getAdminServicosPublico(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Serviços Públicos no Direito Administrativo - Conceitos e Legislação | Compilado de Leis',
      description:
        'Consulte conteúdos sobre Serviços Públicos no Direito Administrativo, incluindo conceitos, princípios e legislação organizada para estudo e consulta jurídica.',
    });
  }
}
