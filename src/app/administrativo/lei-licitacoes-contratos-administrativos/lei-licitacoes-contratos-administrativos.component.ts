import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AdministrativoService } from 'src/app/service/administrativo.service';

@Component({
  selector: 'app-lei-licitacoes-contratos-administrativos',
  templateUrl: './lei-licitacoes-contratos-administrativos.component.html',
  styleUrls: ['./lei-licitacoes-contratos-administrativos.component.scss'],
})

export class LeiLicitacoesContratosAdministrativosComponent implements OnInit {
  paragrafos: string[] = [];
  termoPesquisa: string = '';
  ocorrencias: number[] = [];
  ocorrenciaAtual: number = -1;
  isSearchVisible = false;
  loading = false;
  private termoPesquisaSubject = new Subject<string>();
  private termoPesquisaDebounced = new Subject<string>();


  constructor(private apiService: AdministrativoService, private elementRef: ElementRef) { }


  onTermoPesquisaChange(termo: string) {
    this.termoPesquisaSubject.next(termo); // Envie o termo de pesquisa para o subject
  }
  
  ngOnInit(): void {
    this.loading = true;
    this.apiService.getAdminContratos().subscribe((data: any) => {
      console.log('Dados recebidos da API:', data); // Verifica o objeto retornado pela API
      if (data !== undefined && typeof data === 'object') {
        if (data.hasOwnProperty('text') && typeof data.text === 'string') {
          let paragrafosComArt: string[] = data.text.split(/(?=Art)/);

          // Remover os 3 primeiros caracteres do primeiro parágrafo
          if (paragrafosComArt.length > 0) {
            paragrafosComArt[0] = paragrafosComArt[0].substring(6);
          }

          let paragrafos = paragrafosComArt.map(paragrafo => {
            // Remover texto dentro de parênteses

            // Remover texto dentro de parênteses
            paragrafo = paragrafo.replace(/\([^)]+\)/g, (match) => {
              // Substituir quebras de linha dentro dos parênteses por um espaço em branco
              return match.replace(/\\n/g, ' ');
            });

            // Substituir quebras de linha por um espaço em branco e remover múltiplas quebras de linha
            paragrafo = paragrafo.replace(/\\n+/g, ' ');

            // Remover espaços em branco duplicados
            paragrafo = paragrafo.replace(/  /g, ' ');

            // Remover espaços em branco extras no início e no final
            paragrafo = paragrafo.trim();
            //paragrafo = paragrafo.replace(/\([^)]+\)/g, ''); // Remover texto dentro de parênteses

            // // Aplicar outras transformações apenas se o ponto não estiver dentro de parênteses
            // if (!paragrafo.includes('(') || !paragrafo.includes(')')) {
            //   paragrafo = paragrafo.replace(/\\n/g, ''); // Substituir \n por espaço
            // }
            paragrafo = paragrafo.replace(/ +/g, ' '); // Remover espaços duplicados
            paragrafo = paragrafo.replace(/\\+/g, ' '); // Remover espaços duplicados
            console.log(paragrafo)
            paragrafo = paragrafo.replace("Presidência da República  Secretaria-Geral  Subchefia para Assuntos Jurídicos   ", ''); // Remover texto dentro de parênteses
            paragrafo = paragrafo.replace("    Mensagem de veto    Promulgação partes vetadas    Regulamento    Regulamento     t    ", '');
            paragrafo = paragrafo.replace(". .......................................................................................................    ..........................................................................................................................", '-');
            paragrafo = paragrafo.replace("    ................................................................................................................", '');
            paragrafo = paragrafo.replace("Art. 2º  ", '');
            paragrafo = paragrafo.replace(".............................................................................................................", '');
            paragrafo = paragrafo.replace(".........", 'Art 2º');
            paragrafo = paragrafo.replace("..................................................................................................................", '');
            paragrafo = paragrafo.replace(".................", '');
            paragrafo = paragrafo.replace("......", '');
            paragrafo = paragrafo.replace("........", '');
            paragrafo = paragrafo.replace("..........", '');
            paragrafo = paragrafo.replace("                                                  t    ", '');
            paragrafo = paragrafo.replace("    Mensagem de veto t    ", '');
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

  // formatarParagrafo(paragrafo: string): string {
  //   return paragrafo.split(/([.;:])/).map(frase => {
  //     return frase.trim() + (frase.trim() && /[.;:]$/.test(frase.trim()) ? '<br>' : '');
  //   }).join('');
  // }

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
    resultado = resultado.replace(/(LEI Nº 14.133, DE 1º DE ABRIL DE 2021)/g, '<h6 class="leiClass">$1</h6><br>');
    resultado = resultado.replace(/(Lei de Licitações e Contratos Administrativos.)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(O PRESIDENTE DA REPÚBLICA Faço saber que o Congresso Nacional decreta e eu sanciono a seguinte Lei:)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO I )/g, '<h6 class="leiClass">$1</h6><br>');
    resultado = resultado.replace(/(DISPOSIÇÕES PRELIMINARES )/g, '<h6 class="leiClass">$1</h6><br>');
    resultado = resultado.replace(/(CAPÍTULO I    DO ÂMBITO DE APLICAÇÃO DESTA LEI)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    DOS PRINCÍPIOS)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III    DAS DEFINIÇÕES)/g, '<br><br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV    DOS AGENTES PÚBLICOS)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO II    DAS LICITAÇÕES)/g, '<br><br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I    DO PROCESSO LICITATÓRIO)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    DA FASE PREPARATÓRIA)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Da Instrução do Processo Licitatório)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção II    Das Obras e Serviços de Engenharia)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Das Modalidades de Licitação)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    Dos Critérios de Julgamento)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV    Disposições Setoriais    Subseção I    Das Compras)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção IV    Da Locação de Imóveis)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção III    Dos Serviços em Geral)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III    DA DIVULGAÇÃO DO EDITAL DE LICITAÇÃO)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV    DA APRESENTAÇÃO DE PROPOSTAS E LANCES)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V    DO JULGAMENTO)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI    DA HABILITAÇÃO)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII    DO ENCERRAMENTO DA LICITAÇÃO)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VIII    DA CONTRATAÇÃO DIRETA)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Do Processo de Contratação Direta)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Da Inexigibilidade de Licitação)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    Da Dispensa de Licitação)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IX    DAS ALIENAÇÕES)/g, '<br><br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO X    DOS INSTRUMENTOS AUXILIARES)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Dos Procedimentos Auxiliares)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Do Credenciamento)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    Da Pré-Qualificação)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV    Do Procedimento de Manifestação de Interesse)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V    Do Sistema de Registro de Preços)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VI    Do Registro Cadastral)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO III    DOS CONTRATOS ADMINISTRATIVOS)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I    DA FORMALIZAÇÃO DOS CONTRATOS)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    DAS GARANTIAS)/g, '<br><br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III    DA ALOCAÇÃO DE RISCOS)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV    DAS PRERROGATIVAS DA ADMINISTRAÇÃO)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V    DA DURAÇÃO DOS CONTRATOS)/g, '<br><br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI    DA EXECUÇÃO DOS CONTRATOS)/g, '<br><br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII    DA ALTERAÇÃO DOS CONTRATOS E DOS PREÇOS)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VIII    DAS HIPÓTESES DE EXTINÇÃO DOS CONTRATOS)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IX    DO RECEBIMENTO DO OBJETO DO CONTRATO)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO X    DOS PAGAMENTOS)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XI    DA NULIDADE DOS CONTRATOS)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XII    DOS MEIOS ALTERNATIVOS DE RESOLUÇÃO DE CONTROVÉRSIAS)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IV    DAS IRREGULARIDADES)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I    DAS INFRAÇÕES E SANÇÕES ADMINISTRATIVAS)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    DAS IMPUGNAÇÕES, DOS PEDIDOS DE ESCLARECIMENTO E DOS RECURSOS)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III    DO CONTROLE DAS CONTRATAÇÕES)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO V    DISPOSIÇÕES GERAIS)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I    DO PORTAL NACIONAL DE CONTRATAÇÕES PÚBLICAS)+/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    DAS ALTERAÇÕES LEGISLATIVAS)+/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II-B    DOS CRIMES EM LICITAÇÕES E CONTRATOS ADMINISTRATIVOS)+/g, '<br><br><h6 class="leiClass">$1</h6>');
    paragrafo = paragrafo.replace(/(Art. 2º  .............................................................................................................    ...........................................................................................................................)+/g, 'xxx');
    return resultado;
  }
}
