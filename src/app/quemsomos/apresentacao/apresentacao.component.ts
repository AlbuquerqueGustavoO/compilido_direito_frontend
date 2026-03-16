import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { SeoService } from 'src/app/service/seo.service';

@Component({
  selector: 'app-apresentacao',
  templateUrl: './apresentacao.component.html',
  styleUrls: ['./apresentacao.component.scss'],
})

export class ApresentacaoComponent implements OnInit {
  referencias = [
    {
      titulo: 'Constituição Federal',
      texto:
        'Norma máxima do ordenamento jurídico brasileiro, estabelecendo direitos fundamentais, organização do Estado e princípios que regem a sociedade.',
      link: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm',
    },
    {
      titulo: 'Constituição Estado SP',
      texto:
        'Define a organização política e administrativa do Estado de São Paulo, além dos direitos e deveres no âmbito estadual.',
      link: 'https://www.al.sp.gov.br/repositorio/legislacao/constituicao/1989/compilacao-constituicao-0-05.10.1989.html',
    },
    {
      titulo: 'Código Civil',
      texto:
        'Regulamenta as relações civis entre pessoas físicas e jurídicas, incluindo contratos, propriedade, família e responsabilidade civil.',
      link: 'https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm',
    },
    {
      titulo: 'Código de Processo Civil',
      texto:
        'Estabelece as regras para a tramitação de processos judiciais na área civil, garantindo o devido processo legal.',
      link: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm',
    },
    {
      titulo: 'Lei de Introdução às Normas do Direito Brasileiro',
      texto:
        'Define princípios sobre aplicação, interpretação e vigência das leis no Brasil.',
      link: 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del4657compilado.htm',
    },
    {
      titulo: 'Lei de Licitações e Contratos Administrativos',
      texto:
        'Regulamenta os procedimentos de contratação pública, estabelecendo regras para licitações e contratos com a administração.',
      link: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm',
    },
    {
      titulo: 'Improbidade Administrativa',
      texto:
        'Dispõe sobre atos ilícitos cometidos por agentes públicos que causem enriquecimento ilícito ou prejuízo ao erário.',
      link: 'https://www.planalto.gov.br/ccivil_03/leis/l8429.htm',
    },
    {
      titulo: 'Serviços Públicos',
      texto:
        'Estabelece normas para concessão e permissão de serviços públicos à iniciativa privada.',
      link: 'https://www.planalto.gov.br/ccivil_03/leis/l8987compilada.htm',
    },
    {
      titulo: 'Processo Administrativo',
      texto:
        'Define regras para a condução de processos administrativos no âmbito da administração pública federal.',
      link: 'https://www.planalto.gov.br/ccivil_03/leis/l9784.htm',
    },
    {
      titulo: 'Servidores Públicos',
      texto:
        'Dispõe sobre o regime jurídico dos servidores públicos civis da União, incluindo direitos e deveres.',
      link: 'https://www.planalto.gov.br/ccivil_03/leis/l8112compilado.htm',
    },
    {
      titulo: 'Parcerias Público-Privadas',
      texto:
        'Regulamenta contratos de parceria entre o setor público e privado para execução de projetos de interesse público.',
      link: 'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/lei/l11079.htm',
    },
    {
      titulo: 'Código Tributário Nacional',
      texto:
        'Define o sistema tributário brasileiro e estabelece normas gerais sobre impostos, taxas e contribuições.',
      link: 'https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm',
    },
    {
      titulo: 'Código Penal',
      texto:
        'Estabelece os crimes e as penas aplicáveis no Brasil, regulando a responsabilidade penal.',
      link: 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm',
    },
    {
      titulo: 'Código de Processo Penal',
      texto:
        'Define as regras para investigação, julgamento e execução das ações penais.',
      link: 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del3689.htm',
    },
    {
      titulo: 'Crimes Hediondos',
      texto:
        'Dispõe sobre crimes considerados de extrema gravidade e estabelece regras mais rigorosas para punição.',
      link: 'https://www.planalto.gov.br/ccivil_03/leis/L8072compilada.htm',
    },
    {
      titulo: 'Lei Maria da Penha',
      texto:
        'Cria mecanismos para prevenir e combater a violência doméstica e familiar contra a mulher.',
      link: 'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11340.htm',
    },
    {
      titulo: 'Lei de Drogas',
      texto:
        'Define crimes e medidas relacionadas ao uso, produção e tráfico de substâncias entorpecentes.',
      link: 'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11343.htm',
    },
    {
      titulo: 'Lei da Organização Criminosa',
      texto:
        'Regulamenta a investigação e punição de organizações criminosas e estabelece meios de obtenção de prova.',
      link: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/lei/l12850.htm',
    },
    {
      titulo: 'Lei de Ocultação de Bens',
      texto:
        'Dispõe sobre crimes de lavagem ou ocultação de bens, direitos e valores provenientes de atividades ilícitas.',
      link: 'https://www.planalto.gov.br/ccivil_03/leis/l9613.htm',
    },
  ];

  constructor(
    private analyticsService: AnalyticsService,
    private seo: SeoService,
  ) {}

  ngOnInit(): void {
    this.analyticsService.trackEvent(
      'QuemSomos-Apresentacao',
      'QuemSomos-Apresentacao into view',
    );

    this.updateSeo();
  }

  updateSeo() {
    this.seo.updateSeo({
      title:
        'Compilado de Leis | Plataforma de Pesquisa da Legislação Brasileira',
      description:
        'Conheça o Compilado de Leis, plataforma de pesquisa jurídica criada em 2014 que reúne Constituição, códigos e leis brasileiras para estudo e consulta.',
    });
  }
}
