import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { AnalyticsService } from 'src/app/service/analytics.service';

@Component({
  selector: 'app-servidores-publicos',
  templateUrl: './servidores-publicos.component.html',
  styleUrls: ['./servidores-publicos.component.scss']
})
export class ServidoresPublicosComponent implements OnInit {
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
    this.analyticsService.trackEvent('Administrativo-Servidores-Publico','Administrativo-Servidores-Publico into view');
    this.loading = true;
    this.apiService.getAdminServidoresPublico().subscribe((data: any) => {
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
            paragrafo = paragrafo.replace("Mensagem de veto  ", '');
            paragrafo = paragrafo.replace("     t    ", '');
            paragrafo = paragrafo.replace("(Vide Lei nº 12.702, de 2012)  (Vide Lei nº 12.855, de 2013)  (Vide Lei nº 13.135, de 2015)  (Vide Medida Provisória nº 1.132, de 2022)", '');
            paragrafo = paragrafo.replace("..................................................................................................................", '');
            paragrafo = paragrafo.replace("..................................................................................................................................", '');
            paragrafo = paragrafo.replace("..........", '');
            paragrafo = paragrafo.replace(".........", '');
            paragrafo = paragrafo.replace("...", '');
            paragrafo = paragrafo.replace("...........................................................................................................................", '');
            paragrafo = paragrafo.replace("....................................................................................................................................", '');
            paragrafo = paragrafo.replace("           t", '');
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

    resultado = resultado.replace(/(LEI Nº 8 . 112, DE 11 DE DEZEMBRO DE 1990)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(O PRESIDENTE DA REPÚBLICA Faço saber que o Congresso Nacional decreta e eu sanciono a seguinte Lei:)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Produção de efeito  Partes mantidas pelo Congresso Nacional)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Título I    Capítulo Único    Das Disposições Preliminares)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Título II    Do Provimento, Vacância, Remoção, Redistribuição e Substituição    Capítulo I    Do Provimento    Seção I    Disposições Gerais)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Da Nomeação)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    Do Concurso Público)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV    Da Posse e do Exercício)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V    Da Estabilidade)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VII    Da Readaptação)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VIII    Da Reversão)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IX    Da Reintegração)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção X    Da Recondução)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção XI    Da Disponibilidade e do Aproveitamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo II    Da Vacância)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo III    Da Remoção e da Redistribuição    Seção I    Da Remoção)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Da Redistribuição)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo IV    Da Substituição)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Título III    Dos Direitos e Vantagens    Capítulo I    Do Vencimento e da Remuneração)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo II    Das Vantagens)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Das Indenizações)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção I    Da Ajuda de Custo)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção II    Das Diárias)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção III    Da Indenização de Transporte)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção IV    Do Auxílio-Moradia)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Das Gratificações e Adicionais)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção I    Da Retribuição pelo Exercício de Função de Direção, Chefia e Assessoramento)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção II    Da Gratificação Natalina)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção III    Do Adicional por Tempo de Serviço)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção IV    Dos Adicionais de Insalubridade, Periculosidade ou Atividades Penosas)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção V    Do Adicional por Serviço Extraordinário)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção VI    Do Adicional Noturno)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção VII    Do Adicional de Férias)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção VIII    Da Gratificação por Encargo de Curso ou Concurso)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo III    Das Férias)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo IV    Das Licenças    Seção I    Disposições Gerais)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Da Licença por Motivo de Doença em Pessoa da Família)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    Da Licença por Motivo de Afastamento do Cônjuge)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV    Da Licença para o Serviço Militar)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V    Da Licença para Atividade Política)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VI    Da Licença para Capacitação)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VII    Da Licença para Tratar de Interesses Particulares)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VIII    Da Licença para o Desempenho de Mandato Classista)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo V    Dos Afastamentos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Do Afastamento para Servir a Outro Órgão ou Entidade)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Do Afastamento para Exercício de Mandato Eletivo)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    Do Afastamento para Estudo ou Missão no Exterior)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo VI    Das Concessões)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo VII    Do Tempo de Serviço)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo VIII    Do Direito de Petição)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Título IV    Do Regime Disciplinar    Capítulo I    Dos Deveres)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo II    Das Proibições)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo III    Da Acumulação)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo IV    Das Responsabilidades)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo V    Das Penalidades)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Título V    Do Processo Administrativo Disciplinar)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo I    Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo II    Do Afastamento Preventivo)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo III    Do Processo Disciplinar)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Do Inquérito)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Do Julgamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    Da Revisão do Processo)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Título VI    Da Seguridade Social do Servidor)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo II    Dos Benefícios    Seção I    Da Aposentadoria)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Do Auxílio-Natalidade)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    Do Salário-Família)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV    Da Licença para Tratamento de Saúde)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V    Da Licença à Gestante, à Adotante e da Licença-Paternidade)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VI    Da Licença por Acidente em Serviço)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VII    Da Pensão)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VIII    Do Auxílio-Funeral)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IX    Do Auxílio-Reclusão)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo III    Da Assistência à Saúde)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo IV    Do Custeio)/g, '<br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Título VII    Capítulo Único    Da Contratação Temporária de Excepcional Interesse Público)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Título VIII    Capítulo Único    Das Disposições Gerais)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Título IX    Capítulo Único    Das Disposições Transitórias e Finais)/g, '</br><h6 class="leiClass">$1</h6>');
    return resultado;
  }
}
