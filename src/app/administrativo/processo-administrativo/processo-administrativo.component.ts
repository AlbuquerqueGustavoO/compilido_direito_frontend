import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { AnalyticsService } from 'src/app/service/analytics.service';

@Component({
  selector: 'app-processo-administrativo',
  templateUrl: './processo-administrativo.component.html',
  styleUrls: ['./processo-administrativo.component.scss']
})
export class ProcessoAdministrativoComponent implements OnInit {
  paragrafos: string[] = [];
  termoPesquisa: string = '';
  ocorrencias: number[] = [];
  ocorrenciaAtual: number = -1;
  isSearchVisible = false;
  loading = false;
  private termoPesquisaSubject = new Subject<string>();
  private termoPesquisaDebounced = new Subject<string>();


  constructor(private apiService: AdministrativoService,
    private elementRef: ElementRef,
    private analyticsService: AnalyticsService) { }


  onTermoPesquisaChange(termo: string) {
    this.termoPesquisaSubject.next(termo); // Envie o termo de pesquisa para o subject
  }

  ngOnInit(): void {
    this.analyticsService.trackEvent('Administrativo-Processo-Admin','Administrativo-Processo-Admin into view');
    this.loading = true;
    this.apiService.getAdminProcesso().subscribe((data: any) => {
      //console.log('Dados recebidos da API:', data); // Verifica o objeto retornado pela API
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
            paragrafo = paragrafo.replace("    Presidência da República  Casa Civil  Subchefia para Assuntos Jurídicos    ", '');// Remover texto dentro de parênteses
            paragrafo = paragrafo.replace("  t    ", '');
            paragrafo = paragrafo.replace("), ", ')');
            paragrafo = paragrafo.replace("),", ')');
            paragrafo = paragrafo.replace(").                         ", ')');
            paragrafo = paragrafo.replace(").                       ", ')');
            paragrafo = paragrafo.replace(").", ')');
            paragrafo = paragrafo.replace(").   ", ')');
            paragrafo = paragrafo.replace(") . ", ')');
            paragrafo = paragrafo.replace("):", ')');
            paragrafo = paragrafo.replace(");", ')');
            paragrafo = paragrafo.replace(") ;", ')');
            paragrafo = paragrafo.replace(") ; ", ')');
            paragrafo = paragrafo.replace(");                    ", ')');
            paragrafo = paragrafo.replace(");                ", ')');
            paragrafo = paragrafo.replace(");                     ", ')');
            paragrafo = paragrafo.replace(");                    ", ')');
            paragrafo = paragrafo.replace(");                   ", ')');
            paragrafo = paragrafo.replace(");                   ", ')');
            //console.log(paragrafo)
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
    let resultado = '';
    const regex = /([.;:]|\§\d+|Artigo\s+\d+\.)/g;
    let numeroParagrafo = '';
    let novoParagrafo = true;

    paragrafo.split(regex).forEach((frase, index, array) => {
        frase = frase.trim().replace(/\(NR\)\s*-\s*/, ''); // Remove "(NR) -"

        if (/^§\d+$/.test(frase)) { // Se for um parágrafo iniciado com "§" mantém a numeração original
            numeroParagrafo = frase;
            novoParagrafo = true;
        } else if (/[;:]$/.test(frase) || /^Artigo\s+\d+\.$/.test(frase)) { // Verifica se é o final de uma frase ou "Artigo [número]."
            resultado += frase + `<br>`;
            if (/[;:]$/.test(frase) && array[index + 1] && array[index + 1].trim() !== '') {
                resultado += '<br>';
            }
        } else if (frase.length > 0) { // Adiciona o texto se não estiver vazio
            if (novoParagrafo) {
                resultado += `${numeroParagrafo} ${frase}`;
                novoParagrafo = false;
            } else {
                resultado += ` ${frase}`;
            }
            numeroParagrafo = ''; // Limpa o número do parágrafo depois de usá-lo
        }
    });

    // Ajustar textos dentro de parênteses
    resultado = resultado.replace(/\(\s*([^)]*)\s*\)/g, (match, p1) => {
      return `(${p1.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ')})`;
    });

    // Adicionar quebra de linha após "Artigo [número]."
    resultado = resultado.replace(/(Artigo\s+\d+\.)\s*/g, '$1<br>');

    // Adicionar quebra de linha após ponto final, ponto de exclamação e ponto de interrogação seguidos de letra maiúscula
    resultado = resultado.replace(/([.!?])\s*(?=[A-Z])/g, "$1<br>");

    // Adicionar quebra de linha após qualquer texto dentro de parênteses
    resultado = resultado.replace(/\(([^):]+)\)\s*/g, '($1)<br><br>');

    resultado = resultado.replace(/(LEI Nº 9 . 784 , DE 29 DE JANEIRO DE 1999 .)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(O PRESIDENTE DA REPÚBLICA Faço saber que o Congresso Nacional decreta e eu sanciono a seguinte Lei:)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Regula o processo administrativo no âmbito da Administração Pública Federal .)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  DAS DISPOSIÇÕES GERAIS)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  DOS DIREITOS DOS ADMINISTRADOS)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  DOS DEVERES DO ADMINISTRADO)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  DO INÍCIO DO PROCESSO)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  DOS INTERESSADOS)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  DA COMPETÊNCIA)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII  DOS IMPEDIMENTOS E DA SUSPEIÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VIII  DA FORMA, TEMPO E LUGAR DOS ATOS DO PROCESSO)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IX  DA COMUNICAÇÃO DOS ATOS)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO X  DA INSTRUÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XI  DO DEVER DE DECIDIR)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XII  DA MOTIVAÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XIII  DA DESISTÊNCIA E OUTROS CASOS DE EXTINÇÃO DO PROCESSO)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XIV  DA ANULAÇÃO, REVOGAÇÃO E CONVALIDAÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XV  DO RECURSO ADMINISTRATIVO E DA REVISÃO)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XVI  DOS PRAZOS)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XVII  DAS SANÇÕES)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XVIII  DAS DISPOSIÇÕES FINAIS)/g, '</br><h6 class="leiClass">$1</h6>');
    return resultado;
  }
}
