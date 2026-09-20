import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-improbidade-administrativa',
  templateUrl: './improbidade-administrativa.component.html',
  styleUrls: ['./improbidade-administrativa.component.scss'],
})
export class ImprobidadeAdministrativaComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: AdministrativoService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'Administrativo-Improbidade',
      'Administrativo-Improbidade into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getAdminImprobidade().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Lei de Improbidade Administrativa (Lei 8.429) - Texto Atualizado | Compilado de Leis',
      description:
        'Consulte a Lei de Improbidade Administrativa (Lei 8.429/1992) atualizada, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
