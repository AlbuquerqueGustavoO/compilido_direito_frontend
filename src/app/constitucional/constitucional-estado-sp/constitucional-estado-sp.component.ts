import { Component, ElementRef, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { ConstituicaoService } from 'src/app/service/constituicao.service';
import { SeoService } from 'src/app/service/seo.service';

@Component({
  selector: 'app-constitucional-estado-sp',
  templateUrl: './constitucional-estado-sp.component.html',
  styleUrls: ['./constitucional-estado-sp.component.scss'],
})
export class ConstitucionalEstadoSpComponent implements OnInit {
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
      'Constitucional-Estado-SP',
      'Constitucional-Estado-SP into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getConstituicaoEstadoSP().subscribe((data: any) => {
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

    const termoEscapado = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${termoEscapado})`, 'gi');
    return paragrafo.replace(regex, '<span class="highlight">$1</span>');
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Constituição do Estado de São Paulo (SP) - Texto Completo | Compilado de Leis',
      description:
        'Leia a Constituição do Estado de São Paulo atualizada, organizada por artigos para estudo, concursos e consulta jurídica rápida.',
    });
  }
}
