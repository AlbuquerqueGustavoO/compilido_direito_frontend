import { Component, ElementRef, OnInit } from '@angular/core';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { SeoService } from 'src/app/service/seo.service';

@Component({
  selector: 'app-processo-administrativo',
  templateUrl: './processo-administrativo.component.html',
  styleUrls: ['./processo-administrativo.component.scss'],
})
export class ProcessoAdministrativoComponent implements OnInit {
  paragrafos: string[] = [];
  termoPesquisa: string = '';
  ocorrencias: number[] = [];
  ocorrenciaAtual: number = -1;
  loading = false;

  constructor(
    private apiService: AdministrativoService,
    private elementRef: ElementRef,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) {}

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'Administrativo-Processo-Admin',
      'Administrativo-Processo-Admin into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getAdminProcesso().subscribe((data: any) => {
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
        'Processo Administrativo - Lei 9.784/1999 e Procedimentos Administrativos | Compilado de Leis',
      description:
        'Consulte conteúdos sobre Processo Administrativo no Direito Administrativo, incluindo a Lei 9.784/1999, princípios e procedimentos para estudo e consulta jurídica.',
    });
  }
}