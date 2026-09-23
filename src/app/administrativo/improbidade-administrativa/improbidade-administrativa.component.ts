import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-improbidade-administrativa',
  templateUrl: './improbidade-administrativa.component.html',
  styleUrls: ['./improbidade-administrativa.component.scss'],
})
export class ImprobidadeAdministrativaComponent implements OnInit {
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
      'Administrativo-Improbidade',
      'Administrativo-Improbidade into view',
    );
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getAdminImprobidade(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Lei de Improbidade Administrativa (Lei 8.429) - Texto Atualizado | Compilado de Leis',
      description:
        'Consulte a Lei de Improbidade Administrativa (Lei 8.429/1992) atualizada, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
