import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { CivilService } from 'src/app/service/civil.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-civil',
  templateUrl: './civil.component.html',
  styleUrls: ['./civil.component.scss'],
})
export class CivilComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: CivilService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent('Página civil', 'civil into view');

    this.loading = true;
    this.updateSeo();
    this.apiService.getTexto().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Código Civil Brasileiro (Lei 10.406/2002) - Texto Completo | Compilado de Leis',
      description:
        'Consulte o Código Civil Brasileiro (Lei 10.406/2002) atualizado, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
