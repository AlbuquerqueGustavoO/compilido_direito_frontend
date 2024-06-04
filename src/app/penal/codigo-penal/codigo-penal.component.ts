import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';

@Component({
  selector: 'app-codigo-processo-penal',
  templateUrl: './codigo-penal.component.html',
  styleUrls: ['./codigo-penal.component.scss']
})
export class CodigoPenalComponent implements OnInit {

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
    this.analyticsService.trackEvent('CodigoPenal', 'CodigoPenal into view');
    this.loading = true;
    this.apiService.getCodigoPenal().subscribe((data: any) => {
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
            paragrafo = paragrafo.replace(" DECRETO-LEI No 2.848, DE 7 DE DEZEMBRO DE 1940    Vigência    (Vide Lei nº 1.521, de 1951)    (Vide Lei nº 5.741, de 1971)    (Vide Lei nº 5.988, de 1973)    (Vide Lei nº 6.015, de 1973)    (Vide Lei nº 6.404, de 1976)    (Vide Lei nº 6.515, de 1977)    (Vide Lei nº 6.538, de 1978)    (Vide Lei nº 6.710, de 1979)    (Vide Lei nº 7.492, de 1986)    (Vide Lei nº 8.176, de 1991)     t    Código Penal.", '');
            paragrafo = paragrafo.replace("O PRESIDENTE DA REPÚBLICA, usando da atribuição que lhe confere o art. 180 da Constituição, decreta a seguinte Lei:", '');
            paragrafo = paragrafo.replace("                           PARTE GERAL  ", '');
            paragrafo = paragrafo.replace("  (Redação dada pela Lei nº 7.209, de 11.7.1984)            Anterioridade da Lei", '');
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
    resultado = resultado.replace(/(TÍTULO I  DA APLICAÇÃO DA LEI PENAL)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO II  DO CRIME            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO III  DA IMPUTABILIDADE PENAL            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IV  DO CONCURSO DE PESSOAS)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO V  DAS PENAS)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  DAS ESPÉCIES DE PENA)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  DAS PENAS PRIVATIVAS DE LIBERDADE            )/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  DAS PENAS RESTRITIVAS DE DIREITOS            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO III  DA PENA DE MULTA            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  DA COMINAÇÃO DAS PENAS            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  DA APLICAÇÃO DA PENA            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  DA SUSPENSÃO CONDICIONAL DA PENA            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  DO LIVRAMENTO CONDICIONAL            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  DOS EFEITOS DA CONDENAÇÃO           )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII  DA REABILITAÇÃO            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VI  DAS MEDIDAS DE SEGURANÇA            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VII  DA AÇÃO PENAL            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VIII  DA EXTINÇÃO DA PUNIBILIDADE            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    PARTE ESPECIAL  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO I  DOS CRIMES CONTRA A PESSOA)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  DOS CRIMES CONTRA A VIDA            )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  DAS LESÕES CORPORAIS            )/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  DA PERICLITAÇÃO DA VIDA E DA SAÚDE            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  DA RIXA            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  DOS CRIMES CONTRA A HONRA            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  DOS CRIMES CONTRA A LIBERDADE INDIVIDUAL    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  DOS CRIMES CONTRA A LIBERDADE PESSOAL            )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  DOS CRIMES CONTRA A INVIOLABILIDADE DO DOMICÍLIO            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO III  DOS CRIMES CONTRA A  INVIOLABILIDADE DE CORRESPONDÊNCIA            )/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO IV  DOS CRIMES CONTRA A INVIOLABILIDADE DOS SEGREDOS            )/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO II  DOS CRIMES CONTRA O PATRIMÔNIO    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  DO FURTO            )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  DO ROUBO E DA EXTORSÃO            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  DA USURPAÇÃO            )/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  DO DANO            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  DA APROPRIAÇÃO INDÉBITA            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  DO ESTELIONATO E OUTRAS FRAUDES            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII  DA RECEPTAÇÃO            )/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VIII  DISPOSIÇÕES GERAIS)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO III  DOS CRIMES CONTRA A PROPRIEDADE IMATERIAL    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  DOS CRIMES CONTRA A PROPRIEDADE INTELECTUAL            )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  DOS CRIMES CONTRA O PRIVILÉGIO DE INVENÇÃO            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  DOS CRIMES CONTRA AS  MARCAS DE INDÚSTRIA E COMÉRCIO            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  DOS CRIMES DE CONCORRÊNCIA DESLEAL            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IV  DOS CRIMES CONTRA  A ORGANIZAÇÃO DO TRABALHO            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO V  DOS CRIMES CONTRA O SENTIMENTO  RELIGIOSO E CONTRA O RESPEITO AOS MORTOS    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  DOS CRIMES CONTRA O SENTIMENTO RELIGIOSO           )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  DOS CRIMES CONTRA O RESPEITO AOS MORTOS            )/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VI  DOS CRIMES CONTRA A DIGNIDADE SEXUAL   )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  DOS CRIMES CONTRA A LIBERDADE SEXUAL   )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    CAPÍTULO I-A  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(DA EXPOSIÇÃO DA INTIMIDADE SEXUAL    )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  DOS CRIMES SEXUAIS CONTRA VULNERÁVEL   )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  DO RAPTO            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  DISPOSIÇÕES GERAIS)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  DO LENOCÍNIO E DO TRÁFICO DE PESSOA PARA FIM DE  PROSTITUIÇÃO OU OUTRA FORMA DE  EXPLORAÇÃO SEXUAL   )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(            Mediação para servir a lascívia de outrem)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  DO ULTRAJE PÚBLICO AO PUDOR            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII  DISPOSIÇÕES GERAIS   )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VII  DOS CRIMES CONTRA A FAMÍLIA    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  DOS CRIMES CONTRA O CASAMENTO            )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  DOS CRIMES CONTRA O ESTADO DE FILIAÇÃO            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  DOS CRIMES CONTRA A ASSISTÊNCIA FAMILIAR            )/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  DOS CRIMES CONTRA O  PÁTRIO PODER, TUTELA CURATELA            )/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VIII  DOS CRIMES CONTRA A INCOLUMIDADE PÚBLICA    )/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  DOS CRIMES DE PERIGO COMUM            )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  DOS CRIMES CONTRA A  SEGURANÇA DOS MEIOS DE COMUNICAÇÃO  E)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/( TRANSPORTE E OUTROS SERVIÇOS PÚBLICOS            )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  DOS CRIMES CONTRA A SAÚDE PÚBLICA            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IX  DOS CRIMES CONTRA A PAZ PÚBLICA            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO X  DOS CRIMES CONTRA A FÉ PÚBLICA    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  DA MOEDA FALSA            )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  DA FALSIDADE DE TÍTULOS E OUTROS PAPÉIS PÚBLICOS            )/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  DA FALSIDADE DOCUMENTAL            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  DE OUTRAS FALSIDADES            )/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    CAPÍTULO V  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(DAS FRAUDES EM CERTAMES DE INTERESSE PÚBLICO   )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO XI  DOS CRIMES CONTRA A ADMINISTRAÇÃO PÚBLICA    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  DOS CRIMES PRATICADOS  POR FUNCIONÁRIO PÚBLICO )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CONTRA A ADMINISTRAÇÃO EM GERAL            )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  DOS CRIMES PRATICADOS POR  PARTICULAR )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    CAPÍTULO II-A  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(DOS CRIMES PRATICADOS POR PARTICULAR)/g, '><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CONTRA A ADMINISTRAÇÃO PÚBLICA ESTRANGEIRA            )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II-B    DOS CRIMES EM LICITAÇÕES E CONTRATOS ADMINISTRATIVOS    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  DOS CRIMES CONTRA A ADMINISTRAÇÃO DA JUSTIÇA            )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  DOS CRIMES CONTRA AS FINANÇAS PÚBLICAS  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    TÍTULO XII  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(DOS CRIMES CONTRA O ESTADO  DEMOCRÁTICO DE DIREITO)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    CAPÍTULO I  )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(DOS CRIMES CONTRA A SOBERANIA NACIONAL    )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    CAPÍTULO II           )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(DOS CRIMES CONTRA AS INSTITUIÇÕES DEMOCRÁTICAS    )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Abolição violenta do Estado Democrático de Direito         )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    CAPÍTULO III           )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(DOS CRIMES CONTRA O FUNCIONAMENTO DAS INSTITUIÇÕES DEMOCRÁTICAS NO PROCESSO ELEITORAL    )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Interrupção do processo eleitoral         )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    CAPÍTULO IV           )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(DOS CRIMES CONTRA O FUNCIONAMENTO  DOS SERVIÇOS ESSENCIAIS    )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    CAPÍTULO VI           )/g, '</br></br><h6 class="leiClass">$1</h6>');
    return resultado;
  }

}
