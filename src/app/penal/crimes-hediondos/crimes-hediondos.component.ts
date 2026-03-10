import { Component, ElementRef, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';

@Component({
  selector: 'app-crimes-hediondos',
  templateUrl: './crimes-hediondos.component.html',
  styleUrls: ['./crimes-hediondos.component.scss'],
})
export class CrimesHediondosComponent implements OnInit {
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
      'CodigoPenal-Crimes-Hediondos',
      'CodigoPenal-Crimes-Hediondos into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getCrimesHediondosPenal().subscribe((data: any) => {
      if (data && data.text) {
        let paragrafos = data.text.split(/(?=Art)/);

        if (paragrafos.length > 0) {
          paragrafos[0] = paragrafos[0].substring(6);
        }

        paragrafos = paragrafos
          .map((paragrafo: string) =>
            paragrafo.replace(/\\n+/g, ' ').replace(/ +/g, ' ').trim(),
          )
          .filter((p: string) => p !== '');
        this.paragrafos = paragrafos;
      }
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

    const termoEscapado = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${termoEscapado})`, 'gi');
    return paragrafo.replace(regex, '<span class="highlight">$1</span>');
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Lei dos Crimes Hediondos (Lei 8.072/1990) - Texto Completo | Compilado de Leis',
      description:
        'Consulte a Lei dos Crimes Hediondos (Lei 8.072/1990) atualizada, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
