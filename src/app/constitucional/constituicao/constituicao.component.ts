import { Component, ElementRef, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { ConstituicaoService } from 'src/app/service/constituicao.service';

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
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.analyticsService.trackEvent(
      'Constitucional',
      'Constitucional into view',
    );

    this.apiService.getConstituicao().subscribe((data: any) => {
      if (data && data.text) {
        let paragrafos = data.text.split(/(?=Art)/);

        if (paragrafos.length > 0) {
          paragrafos[0] = paragrafos[0].substring(3);
        }

        paragrafos = paragrafos
          .map((paragrafo: string) =>
            paragrafo.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim(),
          )
          .filter((paragrafo: string) => paragrafo !== '');

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

    const regex = new RegExp('(' + termo + ')', 'gi');

    return paragrafo.replace(regex, '<span class="highlight">$1</span>');
  }
}
