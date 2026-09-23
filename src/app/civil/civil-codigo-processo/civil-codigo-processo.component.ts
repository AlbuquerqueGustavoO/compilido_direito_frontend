import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { CivilService } from 'src/app/service/civil.service';
import { SeoService } from 'src/app/service/seo.service';
import { carregarTextoLei } from '../../shared/legal-content/legal-content-loader';
import { EntradaLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-civil-codigo-processo',
  templateUrl: './civil-codigo-processo.component.html',
  styleUrls: ['./civil-codigo-processo.component.scss'],
})
export class CivilCodigoProcessoComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];
  erro: string | null = null;

  constructor(
    private apiService: CivilService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'Processo civil',
      'Processo civil into view',
    );
    this.updateSeo();
    this.carregar();
  }

  carregar(): void {
    carregarTextoLei(this.apiService.getCodigoCivil(), {
      onEntradas: (entradas) => this.entradas = entradas,
      onLoadingChange: (loading) => this.loading = loading,
      onErro: (erro) => this.erro = erro,
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Código de Processo Civil (Lei 13.105/2015) - Texto Completo | Compilado de Leis',
      description:
        'Consulte o Código de Processo Civil (Lei 13.105/2015) atualizado, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
