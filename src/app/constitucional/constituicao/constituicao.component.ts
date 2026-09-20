import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { ConstituicaoService } from 'src/app/service/constituicao.service';
import { SeoService } from 'src/app/service/seo.service';
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

  constructor(
    private apiService: ConstituicaoService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent('Constitucional', 'Constitucional into view');

    this.loading = true;
    this.updateSeo();
    this.apiService.getConstituicao().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseConstituicaoText(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title: 'Direito Constitucional - Constituição e Leis Constitucionais | Compilado de Leis',
      description:
        'Consulte conteúdos de Direito Constitucional, incluindo Constituição Federal, constituições estaduais e artigos organizados para estudo e consulta jurídica.',
    });
  }
}
