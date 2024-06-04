import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';

@Component({
  selector: 'app-maria-penha',
  templateUrl: './maria-penha.component.html',
  styleUrls: ['./maria-penha.component.scss']
})
export class MariaPenhaComponent implements OnInit {

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
    this.analyticsService.trackEvent('CodigoPenal-Maria-Penha', 'CodigoPenal-Maria-Penha into view');
    this.loading = true;
    this.apiService.getMariaPenha().subscribe((data: any) => {
      console.log('Dados recebidos da API:', data); // Verifica o objeto retornado pela API
      if (data !== undefined && typeof data === 'object') {
        if (data.hasOwnProperty('text') && typeof data.text === 'string') {
          let paragrafosComArt: string[] = data.text.split(/(?=Art)/);

          // Remover os 3 primeiros caracteres do primeiro parágrafo
          if (paragrafosComArt.length > 0) {
            paragrafosComArt[0] = paragrafosComArt[0].substring(6);
          }

          let paragrafos = paragrafosComArt.map(paragrafo => {
            paragrafo = paragrafo.replace(/\\n+/g, ' ');
            paragrafo = paragrafo.replace(/  /g, ' ');
            paragrafo = paragrafo.trim();
            paragrafo = paragrafo.replace(/ +/g, ' '); // Remover espaços duplicados
            paragrafo = paragrafo.replace(/\\+/g, ' '); // Remover espaços duplicados
            paragrafo = paragrafo.replace("Presidência da República  Secretaria-Geral  Subchefia para Assuntos Jurídicos    ", '');// Remover texto dentro de parênteses
            paragrafo = paragrafo.replace("     t    ", ' ');
            paragrafo = paragrafo.replace("    Texto compilado    Vigência ", '');
            paragrafo = paragrafo.replace("    Mensagem de veto t    ", ' ');
            paragrafo = paragrafo.replace(`    "`, '');
            paragrafo = paragrafo.replace(` "   `, '');
            paragrafo = paragrafo.replace(`    “`, '');
            paragrafo = paragrafo.replace(`     ” `, '');
            paragrafo = paragrafo.replace(`” `, '');
            paragrafo = paragrafo.replace(`    * ""`, '');
            paragrafo = paragrafo.replace("II - a violência psicológica, entendida como qualquer conduta que lhe cause dano emocional e diminuição da auto-estima ou que lhe prejudique e perturbe o pleno desenvolvimento ou que vise degradar ou controlar suas ações, comportamentos, crenças e decisões, mediante ameaça, constrangimento, humilhação, manipulação, isolamento, vigilância constante, perseguição contumaz, insulto, chantagem, ridicularização, exploração e limitação do direito de ir e vir ou qualquer outro meio que lhe cause prejuízo à saúde psicológica e à autodeterminação;", '');
            paragrafo = paragrafo.replace("V - informar à ofendida os direitos a ela conferidos nesta Lei e os serviços disponíveis.", '');
            paragrafo = paragrafo.replace("Art. 12-C. Verificada a existência de risco atual ou iminente à vida ou à integridade física da mulher em situação de violência doméstica e familiar, ou de seus dependentes, o agressor será imediatamente afastado do lar, domicílio ou local de convivência com a ofendida:         (Incluído pela Lei nº 13.827, de 2019)", '');
            paragrafo = paragrafo.replace("II - determinar o encaminhamento da ofendida ao órgão de assistência judiciária, quando for o caso;", '');
            paragrafo = paragrafo.replace("    Seção IV  ", '</br></br><h6 class="leiClass">Seção IV</h6>');
            paragrafo = paragrafo.replace(" .................................................    ................................................................", '');
            paragrafo = paragrafo.replace(" ..................................................    .................................................................", '');
            paragrafo = paragrafo.replace(" ............................................................    .................................................................", '');
            paragrafo = paragrafo.replace("...........................................................", '');
            paragrafo = paragrafo.replace("    .......", '');
            paragrafo = paragrafo.replace("..    ", '.');
            paragrafo = paragrafo.replace(" ..................................................", '');
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
    resultado = resultado.replace(/(LEI Nº 11.340, DE 7 DE AGOSTO DE 2006)/g, '<h6 class="leiClass">$1</h6></br>');
    resultado = resultado.replace(/(TÍTULO I    DISPOSIÇÕES PRELIMINARES)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO II    DA VIOLÊNCIA DOMÉSTICA E FAMILIAR CONTRA A MULHER)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I    DISPOSIÇÕES GERAIS)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    DAS FORMAS DE VIOLÊNCIA DOMÉSTICA E FAMILIAR CONTRA A MULHER)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO III    DA ASSISTÊNCIA À MULHER EM SITUAÇÃO DE VIOLÊNCIA DOMÉSTICA E FAMILIAR)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I    DAS MEDIDAS INTEGRADAS DE PREVENÇÃO)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    DA ASSISTÊNCIA À MULHER EM SITUAÇÃO DE VIOLÊNCIA DOMÉSTICA E FAMILIAR)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III    DO ATENDIMENTO PELA AUTORIDADE POLICIAL)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IV    DOS PROCEDIMENTOS)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    DAS MEDIDAS PROTETIVAS DE URGÊNCIA)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I    Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    Das Medidas Protetivas de Urgência que Obrigam o Agressor)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    Das Medidas Protetivas de Urgência à Ofendida)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III    DA ATUAÇÃO DO MINISTÉRIO PÚBLICO)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV    DA ASSISTÊNCIA JUDICIÁRIA)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO V    DA EQUIPE DE ATENDIMENTO MULTIDISCIPLINAR)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VI    DISPOSIÇÕES TRANSITÓRIAS)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VII    DISPOSIÇÕES FINAIS)/g, '</br><h6 class="leiClass">$1</h6>');
    return resultado;
  }

}
