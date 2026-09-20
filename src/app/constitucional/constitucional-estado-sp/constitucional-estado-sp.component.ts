import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { ConstituicaoService } from 'src/app/service/constituicao.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-constitucional-estado-sp',
  templateUrl: './constitucional-estado-sp.component.html',
  styleUrls: ['./constitucional-estado-sp.component.scss'],
})
export class ConstitucionalEstadoSpComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: ConstituicaoService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'Constitucional-Estado-SP',
      'Constitucional-Estado-SP into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getConstituicaoEstadoSP().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
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
