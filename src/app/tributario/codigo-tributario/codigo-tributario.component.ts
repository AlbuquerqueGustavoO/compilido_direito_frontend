import { Component, ElementRef, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { SeoService } from 'src/app/service/seo.service';
import { TributarioService } from 'src/app/service/tributario.service';

@Component({
  selector: 'app-codigo-tributario',
  templateUrl: './codigo-tributario.component.html',
  styleUrls: ['./codigo-tributario.component.scss'],
})

export class CodigoTributarioComponent implements OnInit {
  paragrafos: string[] = [];
  termoPesquisa: string = '';
  ocorrencias: number[] = [];
  ocorrenciaAtual: number = -1;
  loading = false;

  constructor(
    private apiService: TributarioService,
    private elementRef: ElementRef,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) {}

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'Tributario-Codigo',
      'Tributario-Codigo into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getCodigoTributario().subscribe((data: any) => {
      if (data?.text) {
        this.paragrafos = this.parseParagrafos(data.text);
      }
      this.loading = false;
    });
  }

  private parseParagrafos(texto?: string): string[] {
    if (!texto) {
      return [];
    }

    return texto
      .replace(/\r\n/g, '\n')
      .split(/\n{2,}/)
      .map((bloco) => bloco.trim())
      .filter((bloco) => bloco.length > 0);
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

    const termoEscapado = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${termoEscapado})`, 'gi');
    return paragrafo.replace(regex, '<span class="highlight">$1</span>');
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Direito Tributário - Impostos, Leis e Legislação Tributária | Compilado de Leis',
      description:
        'Consulte conteúdos de Direito Tributário, incluindo impostos, princípios e legislação tributária organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}