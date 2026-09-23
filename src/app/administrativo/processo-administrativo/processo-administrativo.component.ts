import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-processo-administrativo',
  templateUrl: './processo-administrativo.component.html',
  styleUrls: ['./processo-administrativo.component.scss'],
})
export class ProcessoAdministrativoComponent implements OnInit {
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
      'Administrativo-Processo-Admin',
      'Administrativo-Processo-Admin into view',
    );
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getAdminProcesso(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Processo Administrativo - Lei 9.784/1999 e Procedimentos Administrativos | Compilado de Leis',
      description:
        'Consulte conteúdos sobre Processo Administrativo no Direito Administrativo, incluindo a Lei 9.784/1999, princípios e procedimentos para estudo e consulta jurídica.',
    });
  }
}
