import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-parceria-publico',
  templateUrl: './parceria-publico.component.html',
  styleUrls: ['./parceria-publico.component.scss'],
})
export class ParceriaPublicoComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: AdministrativoService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'Administrativo-Parceria',
      'Administrativo-Parceria into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getAdminParceriaPublica().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Parcerias Público-Privadas (PPP) - Lei 11.079/2004 | Compilado de Leis',
      description:
        'Consulte conteúdos sobre Parcerias Público-Privadas (PPP) no Direito Administrativo, incluindo a Lei 11.079/2004, princípios e normas para estudo e consulta jurídica.',
    });
  }
}
