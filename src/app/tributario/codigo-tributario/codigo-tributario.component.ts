import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { TributarioService } from 'src/app/service/tributario.service';

@Component({
  selector: 'app-codigo-tributario',
  templateUrl: './codigo-tributario.component.html',
  styleUrls: ['./codigo-tributario.component.scss']
})
export class CodigoTributarioComponent implements OnInit {

  paragrafos: string[] = [];
  termoPesquisa: string = '';
  ocorrencias: number[] = [];
  ocorrenciaAtual: number = -1;
  isSearchVisible = false;
  loading = false;
  private termoPesquisaSubject = new Subject<string>();
  private termoPesquisaDebounced = new Subject<string>();



  constructor(private apiService: TributarioService,
    private elementRef: ElementRef,
    private analyticsService: AnalyticsService) { }

  onTermoPesquisaChange(termo: string) {
    this.termoPesquisaSubject.next(termo); // Envie o termo de pesquisa para o subject
  }

  ngOnInit(): void {
    this.analyticsService.trackEvent('Tributario-Codigo', 'Tributario-Codigo into view');
    this.loading = true;
    this.apiService.getCodigoTributario().subscribe((data: any) => {
      console.log('Dados recebidos da API:', data); // Verifica o objeto retornado pela API
      if (data !== undefined && typeof data === 'object') {
        if (data.hasOwnProperty('text') && typeof data.text === 'string') {
          let paragrafosComArt: string[] = data.text.split(/(?=Art)/);

          // Remover os 3 primeiros caracteres do primeiro parágrafo
          if (paragrafosComArt.length > 0) {
            paragrafosComArt[0] = paragrafosComArt[0].substring(6);
          }

          let paragrafos = paragrafosComArt.map(paragrafo => {
            // Substituir quebras de linha por um espaço em branco e remover múltiplas quebras de linha
            paragrafo = paragrafo.replace(/\\n+/g, ' ');
            paragrafo = paragrafo.replace(/  /g, ' ');
            paragrafo = paragrafo.trim();
            paragrafo = paragrafo.replace(/ +/g, ' '); // Remover espaços duplicados
            paragrafo = paragrafo.replace(/\\+/g, ' '); // Remover espaços duplicados
            paragrafo = paragrafo.replace("Presidência da República  Casa Civil  Subchefia para Assuntos Jurídicos    ", '');// Remover texto dentro de parênteses
            paragrafo = paragrafo.replace("Denominado Código Tributário Nacional    Vigência    (Vide Decreto-lei nº 82, de 1966)  (Vide Decreto nº 6.306, de 2007)     t    Dispõe sobre o Sistema Tributário Nacional e institui normas gerais de direito tributário aplicáveis à União, Estados e Municípios.", '');
            paragrafo = paragrafo.replace("§ 3º A lei poderá dispor que uma parcela, não superior a 20% (vinte por cento), do impôsto de que trata o inciso I seja destinada ao custeio do respectivo serviço de lançamento e arrecadação. (Suspensa a execução pela RSF nº 337, de 1983)", '');
            paragrafo = paragrafo.replace("...............................................................", ' ');
            paragrafo = paragrafo.replace("     t    ", ' ');
            paragrafo = paragrafo.replace("      t    ", ' =');
            paragrafo = paragrafo.replace(".....................................     t    ", ' =');
            paragrafo = paragrafo.replace(" .....................................     t    ", ' =');
            paragrafo = paragrafo.replace(".....................................     t    ", ' =');
            paragrafo = paragrafo.replace(" .....................................     t    ", ' =');
            paragrafo = paragrafo.replace(".....................................     t    ", ' =');
            paragrafo = paragrafo.replace(" .....................................     t    ", ' =');
            paragrafo = paragrafo.replace(".....................................     t    ", ' =');
            paragrafo = paragrafo.replace(" .....................................     t    ", ' =');
            paragrafo = paragrafo.replace(".....................................     t    ", ' =');
            paragrafo = paragrafo.replace(" .....................................     t    ", ' =');
            paragrafo = paragrafo.replace(".....................................     t    ", ' =');
            paragrafo = paragrafo.replace("............................................... .........     t    ", ' =');
            paragrafo = paragrafo.replace("................. .................................", ' . ');
            paragrafo = paragrafo.replace("............................................................................... ..................", ' . ');
            paragrafo = paragrafo.replace("...................................................................", ' . ');
            paragrafo = paragrafo.replace("................................................................................ ..........................", ' . ');
            paragrafo = paragrafo.replace("comunicará ao Banco do Brasil S.A.", 'comunicará ao Banco do Brasil SA');
            console.log(paragrafo)

            if (paragrafo.startsWith('Art')) {
              // Remover o ponto (.) antes de adicionar "Artigo"
              let formattedParagrafo = this.formatarParagrafo(paragrafo.replace(/^Art\s*/, '')).replace('.', '');
              return 'Artigo ' + formattedParagrafo.replace('<br>', '');
            } else {
              return this.formatarParagrafo(paragrafo);
            }
          });

          // Remover quebras de linha extras
          paragrafos = paragrafos.map(paragrafo => paragrafo.trim()).filter(paragrafo => paragrafo !== '');

          this.paragrafos = paragrafos;
          this.atualizarOcorrencias();
          this.loading = false;
        } else {
          console.error('Dados inválidos recebidos da API: Propriedade "text" não encontrada ou não é uma string');
        }
      } else {
        console.error('Dados inválidos recebidos da API: Resposta não é um objeto válido');
      }
    });

    // Aplicar debounce à função highlightWord
    this.termoPesquisaDebounced.pipe(
      debounceTime(300),
    ).subscribe(termo => {
      this.termoPesquisa = termo;
      this.atualizarOcorrencias();
    });

    // Aplicar debounceTime, distinctUntilChanged e filter ao termo de pesquisa
    this.termoPesquisaSubject.pipe(
      debounceTime(300),
      filter(termo => termo.trim() !== ''),
      filter(termo => termo.length > 5),
      distinctUntilChanged(),
    ).subscribe(termo => {
      this.termoPesquisaDebounced.next(termo);
    });
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
      if (this.isSearchVisible) {
        searchContainer.classList.remove('hidden');
        searchContainer.classList.add('slide-in-right');
      } else {
        searchContainer.classList.remove('slide-in-right');
        searchContainer.classList.add('slide-out-left');
        setTimeout(() => {
          searchContainer.classList.add('hidden');
        }, 500); // O tempo deve ser o mesmo que a duração da animação em milissegundos
      }
    }
  }

  scrollToParagrafo(paragrafoId: string) {
    const elemento = document.getElementById(paragrafoId);
    if (elemento) {
      elemento.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }
  }

  pesquisarProximaOcorrencia() {
    if (this.ocorrencias.length === 0) return;
    this.ocorrenciaAtual = (this.ocorrenciaAtual + 1) % this.ocorrencias.length;
    this.scrollToParagrafo('paragrafo-' + this.ocorrencias[this.ocorrenciaAtual]);
  }

  pesquisarOcorrenciaAnterior() {
    if (this.ocorrencias.length === 0) return;
    this.ocorrenciaAtual = (this.ocorrenciaAtual - 1 + this.ocorrencias.length) % this.ocorrencias.length;
    this.scrollToParagrafo('paragrafo-' + this.ocorrencias[this.ocorrenciaAtual]);
  }

  atualizarOcorrencias() {
    this.ocorrencias = [];
    const termo = this.termoPesquisa.trim().toLowerCase();
    if (termo !== '') {
      for (let i = 0; i < this.paragrafos.length; i++) {
        const paragrafo = this.paragrafos[i].toLowerCase();
        if (paragrafo.includes(termo)) {
          this.ocorrencias.push(i);
        }
      }
    }
  }

  highlightWord(paragrafo: string, termo: string): string {
    if (!termo || termo.trim() === '' || termo.length <= 5) {
      return paragrafo; // Não destaca a palavra se o termo não atender aos critérios do filtro
    }

    const regex = new RegExp('(' + termo + ')', 'gi');
    return paragrafo.replace(regex, '<span class="highlight">$1</span>');
  }

  pesquisar() {
    const termo = this.termoPesquisa.trim().toLowerCase();
    if (termo !== '') {
      this.atualizarOcorrencias();
      if (this.ocorrencias.length === 0) {
        alert('Palavra-chave não encontrada nos parágrafos.');
      } else {
        this.ocorrenciaAtual = 0;
        this.scrollToParagrafo('paragrafo-' + this.ocorrencias[this.ocorrenciaAtual]);
      }
    }
  }

  formatarParagrafo(paragrafo: string): string {
    let shouldBreakLine = false;
    let resultado = '';
    paragrafo.split(/([.;:])/).forEach((frase, index, array) => {
      if (/[.;:]$/.test(frase.trim())) {
        resultado += frase.trim();
        shouldBreakLine = true;
      } else {
        if (shouldBreakLine && !frase.trim().match(/^Lei nº|\d+/i)) {
          resultado += '<br>';
        }
        resultado += frase.trim();
        shouldBreakLine = false;
      }
    });
    resultado = resultado.replace(/(LEI Nº 5.172, DE 25 DE OUTUBRO DE 1966.)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(O PRESIDENTE DA REPÚBLICA Faço saber que o Congresso Nacional decreta e eu sanciono a seguinte lei:)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(DISPOSIÇÃO PRELIMINAR)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(LIVRO PRIMEIRO    SISTEMA TRIBUTÁRIO NACIONAL)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO I    Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO II    Competência Tributária)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I    Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    Limitações da Competência Tributária)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II    Disposições Especiais)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO III    Impostos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    Impostos sôbre o Comércio Exterior)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Impôsto sôbre a Importação)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Impôsto sôbre a Exportação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III    Impostos sôbre o Patrimônio e a Renda)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Impôsto sôbre a Propriedade Territorial Rural)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Impôsto sôbre a Propriedade Predial e Territorial Urbana)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    Impôsto sôbre a Transmissão de Bens Imóveis e de Direitos a êles Relativos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV    Impôsto sôbre a Renda e Proventos de Qualquer Natureza)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV    Impostos sôbre a Produção e a Circulação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Impôsto sôbre Produtos Industrializados)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Impôsto Estadual sôbre Operações Relativas à Circulação de Mercadorias)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    Impôsto Municipal sôbre Operações Relativas à Circulação de Mercadorias)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV    Impôsto sôbre Operações de Crédito, Câmbio e Seguro, e sôbre Operações Relativas a Títulos e Valôres Mobiliários)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V    Impôsto sôbre Serviços de Transportes e Comunicações)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VI    Impôsto sôbre Serviços de Qualquer Natureza)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V    Impostos Especiais)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Impôsto sôbre Operações Relativas a Combustíveis, Lubrificantes, Energia Elétrica e Minerais do País)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Impostos Extraordinários)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IV    Taxas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO V    Contribuição de Melhoria)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VI    Distribuições de Receitas Tributárias)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    Impôsto sôbre a Propriedade Territorial Rural e sobre a Renda e Proventos de qualquer natureza)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III    Fundos de Participação dos Estados e dos Municípios)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Constituição dos Fundos)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Critério de Distribuição do Fundo de Participação dos Estados)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO III    Critério de Distribuição do Fundo de Participação dos Municípios)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV    Cálculo e Pagamento das Quotas Estaduais e Municipais)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V  Comprovação da Aplicação das Quotas Estaduais e Municipais)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Impôsto sôbre Operações Relativas a Combustíveis, Lubrificantes, Energia Elétrica e Minerais do País)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO I    Legislação Tributária)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Disposição Preliminar)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Leis, Tratados e Convenções Internacionais e Decretos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    Normas Complementares)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    Vigência da Legislação Tributária)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III    Aplicação da Legislação Tributária)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV    Interpretação e Integração da Legislação Tributária)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO II    Obrigação Tributária)/g, '</br><h6 class="leiClass">$1</h6>');    
    resultado = resultado.replace(/(CAPÍTULO II    Fato Gerador)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III    Sujeito Ativo)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV    Sujeito Passivo)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Solidariedade)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    Capacidade Tributária)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV    Domicílio Tributário)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V    Responsabilidade Tributária)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Disposição Geral)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Responsabilidade dos Sucessores)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    Responsabilidade de Terceiros)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV    Responsabilidade por Infrações)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO III    Crédito Tributário)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    Constituição de Crédito Tributário)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I    Lançamento)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II    Modalidades de Lançamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III    Suspensão do Crédito Tributário)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I    Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II    Moratória)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV    Extinção do Crédito Tributário)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I    Modalidades de Extinção)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II    Pagamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO III    Pagamento Indevido)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO IV    Demais Modalidades de Extinção)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V    Exclusão de Crédito Tributário)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II    Isenção)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO III    Anistia)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI    Garantias e Privilégios do Crédito Tributário)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II    Preferências)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IV    Administração Tributária)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I    Fiscalização)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    Dívida Ativa)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III    Certidões Negativas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Disposições Finais e Transitórias)/g, '</br><h6 class="leiClass">$1</h6>');
    return resultado;
  }
}
