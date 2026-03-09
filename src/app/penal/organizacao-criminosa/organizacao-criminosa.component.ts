import { Component, ElementRef, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';

@Component({
  selector: 'app-organizacao-criminosa',
  templateUrl: './organizacao-criminosa.component.html',
  styleUrls: ['./organizacao-criminosa.component.scss'],
})

export class OrganizacaoCriminosaComponent implements OnInit {
  paragrafos: string[] = [];
  termoPesquisa: string = '';
  ocorrencias: number[] = [];
  ocorrenciaAtual: number = -1;
  loading = false;

  constructor(
    private apiService: PenalService,
    private elementRef: ElementRef,
    private analyticsService: AnalyticsService,
  ) {}

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'CodigoPenal-Organizacao-Criminosa',
      'CodigoPenal-Organizacao-Criminosa into view',
    );

    this.loading = true;

    this.apiService.getOrganizacaoCriminosa().subscribe((data: any) => {
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
}