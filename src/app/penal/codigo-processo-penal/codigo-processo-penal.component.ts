import { Component, ElementRef, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';

@Component({
  selector: 'app-codigo-processo-penal',
  templateUrl: './codigo-processo-penal.component.html',
  styleUrls: ['./codigo-processo-penal.component.scss'],
})
export class CodigoProcessoPenalComponent implements OnInit {
  paragrafos: string[] = [];
  termoPesquisa: string = '';
  ocorrencias: number[] = [];
  ocorrenciaAtual: number = -1;
  loading = false;

  constructor(
    private apiService: PenalService,
    private elementRef: ElementRef,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) {}

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'CodigoPenal-Processo',
      'CodigoPenal-Processo into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getCodigoProcessoPenal().subscribe((data: any) => {
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
        'Código de Processo Penal (Decreto-Lei 3.689/1941) - Texto Completo | Compilado de Leis',
      description:
        'Consulte o Código de Processo Penal Brasileiro (Decreto-Lei 3.689/1941) atualizado, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}