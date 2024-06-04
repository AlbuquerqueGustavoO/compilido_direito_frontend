import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';

@Component({
  selector: 'app-organizacao-criminosa',
  templateUrl: './organizacao-criminosa.component.html',
  styleUrls: ['./organizacao-criminosa.component.scss']
})
export class OrganizacaoCriminosaComponent implements OnInit {

  paragrafos: string[] = [];
  termoPesquisa: string = '';
  ocorrencias: number[] = [];
  ocorrenciaAtual: number = -1;
  isSearchVisible = false;
  loading = false;
  private termoPesquisaSubject = new Subject<string>();
  private termoPesquisaDebounced = new Subject<string>();



  constructor(private apiService: PenalService,
    private elementRef: ElementRef,
    private analyticsService: AnalyticsService) { }

  onTermoPesquisaChange(termo: string) {
    this.termoPesquisaSubject.next(termo); // Envie o termo de pesquisa para o subject
  }

  ngOnInit(): void {
    this.analyticsService.trackEvent('CodigoPenal-Organizacao-Criminosa', 'CodigoPenal-Organizacao-Criminosa into view');
    this.loading = true;
    this.apiService.getOrganizacaoCriminosa().subscribe((data: any) => {
      console.log('Dados recebidos da API:', data); // Verifica o objeto retornado pela API
      if (data !== undefined && typeof data === 'object') {
        if (data.hasOwnProperty('text') && typeof data.text === 'string') {
          let paragrafosComArt: string[] = data.text.split(/(?=Art)/);

          // Remover os 3 primeiros caracteres do primeiro parágrafo
          if (paragrafosComArt.length > 0) {
            paragrafosComArt[0] = paragrafosComArt[0].substring(3);
          }

          let paragrafos = paragrafosComArt.map(paragrafo => {
            paragrafo = paragrafo.replace(/\\n+/g, ' ');
            paragrafo = paragrafo.replace(/  /g, ' ');
            paragrafo = paragrafo.trim();
            paragrafo = paragrafo.replace(/ +/g, ' '); // Remover espaços duplicados
            paragrafo = paragrafo.replace(/\\+/g, ' '); // Remover espaços duplicados
            paragrafo = paragrafo.replace("Presidência da República  Secretaria-Geral  Subchefia para Assuntos Jurídicos    ", '');// Remover texto dentro de parênteses
            paragrafo = paragrafo.replace("     t    ", ' ');
            paragrafo = paragrafo.replace("    Vigência    ", '');
            paragrafo = paragrafo.replace("II - às organizações terroristas internacionais, reconhecidas segundo as normas de direito internacional, por foro do qual o Brasil faça parte, cujos atos de suporte ao terrorismo, bem como os atos preparatórios ou de execução de atos terroristas, ocorram ou possam ocorrer em território nacional.", '');
            paragrafo = paragrafo.replace("   Seção I    Da Colaboração Premiada    ", '');
            paragrafo = paragrafo.replace("§ 4º Nas mesmas hipóteses do caput , o Ministério Público poderá deixar de oferecer denúncia se o colaborador:", '');
            paragrafo = paragrafo.replace("§ 7º Realizado o acordo na forma do § 6º , o respectivo termo, acompanhado das declarações do colaborador e de cópia da investigação, será remetido ao juiz para homologação, o qual deverá verificar sua regularidade, legalidade e voluntariedade, podendo para este fim, sigilosamente, ouvir o colaborador, na presença de seu defensor.", '');
            paragrafo = paragrafo.replace("§ 8º O juiz poderá recusar homologação à proposta que não atender aos requisitos legais, ou adequá-la ao caso concreto.", '');
            paragrafo = paragrafo.replace("§ 13. Sempre que possível, o registro dos atos de colaboração será feito pelos meios ou recursos de gravação magnética, estenotipia, digital ou técnica similar, inclusive audiovisual, destinados a obter maior fidelidade das informações.", '');
            paragrafo = paragrafo.replace("§ 16. Nenhuma sentença condenatória será proferida com fundamento apenas nas declarações de agente colaborador.", '');
            paragrafo = paragrafo.replace("VI - cumprir pena em estabelecimento penal diverso dos demais corréus ou condenados.", '');
            paragrafo = paragrafo.replace("§ 3º O acordo de colaboração premiada deixa de ser sigiloso assim que recebida a denúncia, observado o disposto no art. 5º .", '');
            paragrafo = paragrafo.replace(" ...................................................................................", '');
            paragrafo = paragrafo.replace("    ..................................................................................................", '');
            paragrafo = paragrafo.replace(`    * ""`, '');
            paragrafo = paragrafo.replace(`    “ `, '');
            paragrafo = paragrafo.replace(`” `, '');
            paragrafo = paragrafo.replace(`    “`, '');
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
    resultado = resultado.replace(/(LEI Nº 12.850, DE 2 DE AGOSTO DE 2013)/g, '<h6 class="leiClass">$1</h6></br>');
    resultado = resultado.replace(/(CAPÍTULO I    DA ORGANIZAÇÃO CRIMINOSA)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    DA INVESTIGAÇÃO E DOS MEIOS DE OBTENÇÃO DA PROVA)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Da Colaboração Premiada    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Da Ação Controlada)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    Da Infiltração de Agentes)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV    Do Acesso a Registros, Dados Cadastrais, Documentos e Informações)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V    Dos Crimes Ocorridos na Investigação e na Obtenção da Prova)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III    DISPOSIÇÕES FINAIS)/g, '</br><h6 class="leiClass">$1</h6>');
    return resultado;
  }

}
