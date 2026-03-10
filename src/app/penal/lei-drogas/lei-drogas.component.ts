import { Component, ElementRef, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';

@Component({
  selector: 'app-lei-drogas',
  templateUrl: './lei-drogas.component.html',
  styleUrls: ['./lei-drogas.component.scss'],
})

export class LeiDrogasComponent implements OnInit {
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
      'CodigoPenal-Lei-Drogas',
      'CodigoPenal-Lei-Drogas into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getDrogas().subscribe((data: any) => {
      if (data && data.text) {
        let paragrafos = data.text.split(/(?=Art)/);

        if (paragrafos.length > 0) {
          paragrafos[0] = paragrafos[0].substring(3);
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
        'Lei de Drogas (Lei 11.343/2006) - Texto Completo e Atualizado | Compilado de Leis',
      description:
        'Consulte a Lei de Drogas (Lei 11.343/2006) atualizada, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}