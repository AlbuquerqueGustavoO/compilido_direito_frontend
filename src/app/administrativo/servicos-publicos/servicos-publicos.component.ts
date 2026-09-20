import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-servicos-publicos',
  templateUrl: './servicos-publicos.component.html',
  styleUrls: ['./servicos-publicos.component.scss'],
})
export class ServicosPublicosComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: AdministrativoService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'Administrativo-Servicos-Publico',
      'Administrativo-Servicos-Publico into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getAdminServicosPublico().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Serviços Públicos no Direito Administrativo - Conceitos e Legislação | Compilado de Leis',
      description:
        'Consulte conteúdos sobre Serviços Públicos no Direito Administrativo, incluindo conceitos, princípios e legislação organizada para estudo e consulta jurídica.',
    });
  }
}
