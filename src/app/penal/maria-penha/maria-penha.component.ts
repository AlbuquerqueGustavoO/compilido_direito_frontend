import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-maria-penha',
  templateUrl: './maria-penha.component.html',
  styleUrls: ['./maria-penha.component.scss'],
})
export class MariaPenhaComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: PenalService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'CodigoPenal-Maria-Penha',
      'CodigoPenal-Maria-Penha into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getMariaPenha().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Lei Maria da Penha (Lei 11.340/2006) - Texto Completo e Atualizado | Compilado de Leis',
      description:
        'Consulte a Lei Maria da Penha (Lei 11.340/2006) atualizada, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
