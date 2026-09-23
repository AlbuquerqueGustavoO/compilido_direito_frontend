import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-servidores-publicos',
  templateUrl: './servidores-publicos.component.html',
  styleUrls: ['./servidores-publicos.component.scss'],
})
export class ServidoresPublicosComponent implements OnInit {
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
      'Administrativo-Servidores-Publico',
      'Administrativo-Servidores-Publico into view',
    );
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getAdminServidoresPublico(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Servidores Públicos - Direitos, Deveres e Lei 8.112 | Compilado de Leis',
      description:
        'Consulte conteúdos sobre Servidores Públicos no Direito Administrativo, incluindo direitos, deveres e normas da Lei 8.112 organizadas para estudo e consulta jurídica.',
    });
  }
}
