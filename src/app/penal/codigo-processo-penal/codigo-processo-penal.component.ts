import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-codigo-processo-penal',
  templateUrl: './codigo-processo-penal.component.html',
  styleUrls: ['./codigo-processo-penal.component.scss'],
})
export class CodigoProcessoPenalComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: PenalService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'CodigoPenal-Processo',
      'CodigoPenal-Processo into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getCodigoProcessoPenal().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
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
