import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-lei-licitacoes-contratos-administrativos',
  templateUrl: './lei-licitacoes-contratos-administrativos.component.html',
  styleUrls: ['./lei-licitacoes-contratos-administrativos.component.scss'],
})
export class LeiLicitacoesContratosAdministrativosComponent implements OnInit {
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
      'Administrativo-Licitacoes',
      'Administrativo-Licitacoes into view',
    );
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getAdminContratos(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Lei de Licitações e Contratos Administrativos (Lei 14.133) | Compilado de Leis',
      description:
        'Consulte a Lei de Licitações e Contratos Administrativos (Lei 14.133/2021) atualizada, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
