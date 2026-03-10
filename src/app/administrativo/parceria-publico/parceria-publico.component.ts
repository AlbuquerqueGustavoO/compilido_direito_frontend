import { Component, ElementRef, OnInit } from '@angular/core';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { SeoService } from 'src/app/service/seo.service';

@Component({
  selector: 'app-parceria-publico',
  templateUrl: './parceria-publico.component.html',
  styleUrls: ['./parceria-publico.component.scss'],
})
export class ParceriaPublicoComponent implements OnInit {
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
      'Administrativo-Parceria',
      'Administrativo-Parceria into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getAdminParceriaPublica().subscribe((data: any) => {
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
        'Parcerias Público-Privadas (PPP) - Lei 11.079/2004 | Compilado de Leis',
      description:
        'Consulte conteúdos sobre Parcerias Público-Privadas (PPP) no Direito Administrativo, incluindo a Lei 11.079/2004, princípios e normas para estudo e consulta jurídica.',
    });
  }
}