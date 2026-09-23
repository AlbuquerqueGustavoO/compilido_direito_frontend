import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-parceria-publico',
  templateUrl: './parceria-publico.component.html',
  styleUrls: ['./parceria-publico.component.scss'],
})
export class ParceriaPublicoComponent implements OnInit {
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
      'Administrativo-Parceria',
      'Administrativo-Parceria into view',
    );
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getAdminParceriaPublica(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Parcerias Público-Privadas (PPP) - Lei 11.079/2004 | Compilado de Leis',
      description:
        'Consulte conteúdos sobre Parcerias Público-Privadas (PPP) no Direito Administrativo, incluindo a Lei 11.079/2004, princípios e normas para estudo e consulta jurídica.',
    });
  }
}
