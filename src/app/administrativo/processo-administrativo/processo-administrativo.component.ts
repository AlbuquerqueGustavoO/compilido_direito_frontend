import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-processo-administrativo',
  templateUrl: './processo-administrativo.component.html',
  styleUrls: ['./processo-administrativo.component.scss'],
})
export class ProcessoAdministrativoComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: AdministrativoService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'Administrativo-Processo-Admin',
      'Administrativo-Processo-Admin into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getAdminProcesso().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Processo Administrativo - Lei 9.784/1999 e Procedimentos Administrativos | Compilado de Leis',
      description:
        'Consulte conteúdos sobre Processo Administrativo no Direito Administrativo, incluindo a Lei 9.784/1999, princípios e procedimentos para estudo e consulta jurídica.',
    });
  }
}
