import { Component, ElementRef, OnInit } from '@angular/core';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { SeoService } from 'src/app/service/seo.service';

@Component({
  selector: 'app-improbidade-administrativa',
  templateUrl: './improbidade-administrativa.component.html',
  styleUrls: ['./improbidade-administrativa.component.scss'],
})
export class ImprobidadeAdministrativaComponent implements OnInit {
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
      'Administrativo-Improbidade',
      'Administrativo-Improbidade into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getAdminImprobidade().subscribe((data: any) => {
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
        'Lei de Improbidade Administrativa (Lei 8.429) - Texto Atualizado | Compilado de Leis',
      description:
        'Consulte a Lei de Improbidade Administrativa (Lei 8.429/1992) atualizada, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}