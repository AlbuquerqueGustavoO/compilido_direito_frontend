import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { CivilService } from 'src/app/service/civil.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-civil-codigo-processo',
  templateUrl: './civil-codigo-processo.component.html',
  styleUrls: ['./civil-codigo-processo.component.scss'],
})
export class CivilCodigoProcessoComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: CivilService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'Processo civil',
      'Processo civil into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getCodigoCivil().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Código de Processo Civil (Lei 13.105/2015) - Texto Completo | Compilado de Leis',
      description:
        'Consulte o Código de Processo Civil (Lei 13.105/2015) atualizado, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
