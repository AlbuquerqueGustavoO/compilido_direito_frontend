import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-codigo-processo-penal',
  templateUrl: './codigo-penal.component.html',
  styleUrls: ['./codigo-penal.component.scss'],
})
export class CodigoPenalComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: PenalService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent('CodigoPenal', 'CodigoPenal into view');
    this.updateSeo();
    this.loading = true;
    this.apiService.getCodigoPenal().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Código Penal Brasileiro (Decreto-Lei 2.848/1940) - Texto Completo | Compilado de Leis',
      description:
        'Consulte o Código Penal Brasileiro (Decreto-Lei 2.848/1940) atualizado, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
