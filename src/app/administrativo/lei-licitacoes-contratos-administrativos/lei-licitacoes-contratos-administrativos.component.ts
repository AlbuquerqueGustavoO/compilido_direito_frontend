import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-lei-licitacoes-contratos-administrativos',
  templateUrl: './lei-licitacoes-contratos-administrativos.component.html',
  styleUrls: ['./lei-licitacoes-contratos-administrativos.component.scss'],
})
export class LeiLicitacoesContratosAdministrativosComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: AdministrativoService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'Administrativo-Licitacoes',
      'Administrativo-Licitacoes into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getAdminContratos().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Lei de Licitações e Contratos Administrativos (Lei 14.133) | Compilado de Leis',
      description:
        'Consulte a Lei de Licitações e Contratos Administrativos (Lei 14.133/2021) atualizada, com artigos organizados para estudo, concursos públicos e consulta jurídica.',
    });
  }
}
