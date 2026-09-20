import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { SeoService } from 'src/app/service/seo.service';
import { EntradaLei, parseTextoLei } from '../../shared/legal-content/legal-text-parser';

@Component({
  selector: 'app-servidores-publicos',
  templateUrl: './servidores-publicos.component.html',
  styleUrls: ['./servidores-publicos.component.scss'],
})
export class ServidoresPublicosComponent implements OnInit {
  loading = false;
  entradas: EntradaLei[] = [];

  constructor(
    private apiService: AdministrativoService,
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'Administrativo-Servidores-Publico',
      'Administrativo-Servidores-Publico into view',
    );

    this.loading = true;
    this.updateSeo();
    this.apiService.getAdminServidoresPublico().subscribe((data: any) => {
      if (data?.text) {
        this.entradas = parseTextoLei(data.text);
      }
      this.loading = false;
    });
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Servidores Públicos - Direitos, Deveres e Lei 8.112 | Compilado de Leis',
      description:
        'Consulte conteúdos sobre Servidores Públicos no Direito Administrativo, incluindo direitos, deveres e normas da Lei 8.112 organizadas para estudo e consulta jurídica.',
    });
  }
}
