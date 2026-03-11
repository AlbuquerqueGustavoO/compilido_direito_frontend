import { Component, ElementRef, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { ConstituicaoService } from 'src/app/service/constituicao.service';
import { SeoService } from 'src/app/service/seo.service';

@Component({
  selector: 'app-constituicao',
  templateUrl: './constituicao.component.html',
  styleUrls: ['./constituicao.component.scss'],
})
export class ConstituicaoComponent implements OnInit {
  paragrafos: string[] = [];
  termoPesquisa: string = '';
  ocorrencias: number[] = [];
  ocorrenciaAtual: number = -1;
  loading = false;

  constructor(
    private apiService: ConstituicaoService,
    private elementRef: ElementRef,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) {}

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'Constitucional',
      'Constitucional into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getConstituicao().subscribe((data: any) => {
      this.paragrafos = data?.text ? [data.text] : [];
      this.loading = false;
    });
  }

  onSearch(event: any) {
    this.termoPesquisa = event.termo;
    this.ocorrencias = event.ocorrencias;
    this.ocorrenciaAtual = event.indiceAtual;
  }

  onNavigate(event: any) {
    this.scrollToParagrafo(event.paragrafoId);
  }

  scrollToParagrafo(paragrafoId: string) {
    const elemento = document.getElementById(paragrafoId);

    if (elemento) {
      elemento.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  highlightWord(paragrafo: string, termo: string): string {
    if (!termo || termo.trim() === '' || termo.length <= 2) {
      return paragrafo;
    }

    const regex = new RegExp('(' + termo + ')', 'gi');

    return paragrafo.replace(regex, '<span class="highlight">$1</span>');
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Direito Constitucional - Constituição e Leis Constitucionais | Compilado de Leis',
      description:
        'Consulte conteúdos de Direito Constitucional, incluindo Constituição Federal, constituições estaduais e artigos organizados para estudo e consulta jurídica.',
    });
  }
}
