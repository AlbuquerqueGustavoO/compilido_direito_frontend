import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { CivilService } from 'src/app/service/civil.service';


@Component({
  selector: 'app-civil-codigo-processo',
  templateUrl: './civil-codigo-processo.component.html',
  styleUrls: ['./civil-codigo-processo.component.scss']
})
export class CivilCodigoProcessoComponent implements OnInit {


  paragrafos: string[] = [];
  termoPesquisa: string = '';
  ocorrencias: number[] = [];
  ocorrenciaAtual: number = -1;
  isSearchVisible = false;
  loading = false;
  private termoPesquisaSubject = new Subject<string>();
  private termoPesquisaDebounced = new Subject<string>();



  constructor(private apiService: CivilService,
    private elementRef: ElementRef,
    private analyticsService: AnalyticsService) { }

    onTermoPesquisaChange(termo: string) {
      this.termoPesquisaSubject.next(termo); // Envie o termo de pesquisa para o subject
    }
    
    ngOnInit(): void {
      this.analyticsService.trackEvent('Processo civil','Processo civil into view');
      this.loading = true;
      this.apiService.getCodigoCivil().subscribe((data: any) => {
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
              paragrafo = paragrafo.replace("Presidência da República  Secretaria-Geral  Subchefia para Assuntos Jurídicos", '');// Remover texto dentro de parênteses
              paragrafo = paragrafo.replace("     t    ", ' ');
              paragrafo = paragrafo.replace("    Texto compilado    ", '');
              paragrafo = paragrafo.replace("   ÍNDICE    Vigência", '');
              paragrafo = paragrafo.replace("Mensagem de veto    Vigência ", '');
              paragrafo = paragrafo.replace("III - o Município, por seu prefeito ou procurador;", '');
              paragrafo = paragrafo.replace("Art. 153. O escrivão ou chefe de secretaria deverá obedecer à ordem cronológica de recebimento para publicação e efetivação dos pronunciamentos judiciais.", '');
              paragrafo = paragrafo.replace("Art. 246. A citação será feita:", '');
              paragrafo = paragrafo.replace("I - pelo correio;", '');
              paragrafo = paragrafo.replace("II - por oficial de justiça;", '');
              paragrafo = paragrafo.replace("III - pelo escrivão ou chefe de secretaria, se o citando comparecer em cartório;", '');
              paragrafo = paragrafo.replace("IV - por edital;", '');
              paragrafo = paragrafo.replace("V - por meio eletrônico, conforme regulado em lei.", '');
              paragrafo = paragrafo.replace("§ 1º Com exceção das microempresas e das empresas de pequeno porte, as empresas públicas e privadas são obrigadas a manter cadastro nos sistemas de processo em autos eletrônicos, para efeito de recebimento de citações e intimações, as quais serão efetuadas preferencialmente por esse meio.", '');
              paragrafo = paragrafo.replace("Art. 247. A citação será feita pelo correio para qualquer comarca do país, exceto:", '');
              paragrafo = paragrafo.replace("I - a individuação, tão completa quanto possível, do documento ou da coisa;", '');
              paragrafo = paragrafo.replace("II - a finalidade da prova, indicando os fatos que se relacionam com o documento ou com a coisa;", '');
              paragrafo = paragrafo.replace("III - as circunstâncias em que se funda o requerente para afirmar que o documento ou a coisa existe e se acha em poder da parte contrária.", '');
              paragrafo = paragrafo.replace("§ 3º A decisão que fixa a multa é passível de cumprimento provisório, devendo ser depositada em juízo, permitido o levantamento do valor após o trânsito em julgado da sentença favorável à parte ou na pendência do agravo fundado nos incisos II ou III do art. 1.042.", '');
              paragrafo = paragrafo.replace("III - quando o executado não possuir bens penhoráveis;", '');
              paragrafo = paragrafo.replace("§ 4º Decorrido o prazo de que trata o § 1º sem manifestação do exequente, começa a correr o prazo de prescrição intercorrente.", '');
              paragrafo = paragrafo.replace("§ 5º O juiz, depois de ouvidas as partes, no prazo de 15 (quinze) dias, poderá, de ofício, reconhecer a prescrição de que trata o § 4º e extinguir o processo.", '');
              paragrafo = paragrafo.replace("III - garantir a observância de decisão do Supremo Tribunal Federal em controle concentrado de constitucionalidade;", '');
              paragrafo = paragrafo.replace("IV - garantir a observância de enunciado de súmula vinculante e de precedente proferido em julgamento de casos repetitivos ou em incidente de assunção de competência.", '');
              paragrafo = paragrafo.replace("§ 5º É inadmissível a reclamação proposta após o trânsito em julgado da decisão.", '');
              paragrafo = paragrafo.replace(" § 2º Quando o recurso estiver fundado em dissídio jurisprudencial, é vedado ao tribunal inadmiti-lo com base em fundamento genérico de que as circunstâncias fáticas são diferentes, sem demonstrar a existência da distinção.", '');
              paragrafo = paragrafo.replace("I - ao tribunal superior respectivo, no período compreendido entre a interposição do recurso e sua distribuição, ficando o relator designado para seu exame prevento para julgá-lo;", '');
              paragrafo = paragrafo.replace("III - ao presidente ou vice-presidente do tribunal local, no caso de o recurso ter sido sobrestado, nos termos do art. 1.037 .", '');
              paragrafo = paragrafo.replace("Art. 1.030. Recebida a petição do recurso pela secretaria do tribunal, o recorrido será intimado para apresentar contrarrazões no prazo de 15 (quinze) dias, findo o qual os autos serão remetidos ao respectivo tribunal superior.    Parágrafo único. A remessa de que trata o caput dar-se-á independentemente de juízo de admissibilidade.", '');
              paragrafo = paragrafo.replace("II - tenha sido proferido em julgamento de casos repetitivos;", '');
              paragrafo = paragrafo.replace("§ 7º Da decisão que indeferir o requerimento referido no § 6º caberá agravo, nos termos do art. 1.042 .", '');
              paragrafo = paragrafo.replace("§ 10. Não ocorrendo o julgamento no prazo de 1 (um) ano a contar do reconhecimento da repercussão geral, cessa, em todo o território nacional, a suspensão dos processos, que retomarão seu curso normal.", '');
              paragrafo = paragrafo.replace("§ 3º Da decisão que indeferir este requerimento caberá agravo, nos termos do art. 1.042 .", '');
              paragrafo = paragrafo.replace("§ 3º O conteúdo do acórdão abrangerá a análise de todos os fundamentos da tese jurídica discutida, favoráveis ou contrários.", '');
              paragrafo = paragrafo.replace("§ 2º Quando ocorrer a hipótese do inciso II do caput do art. 1.040 e o recurso versar sobre outras questões, caberá ao presidente do tribunal, depois do reexame pelo órgão de origem e independentemente de ratificação do recurso ou de juízo de admissibilidade, determinar a remessa do recurso ao tribunal superior para julgamento das demais questões.", '');
              paragrafo = paragrafo.replace("Art. 1.042. Cabe agravo contra decisão de presidente ou de vice-presidente do tribunal que:", '');
              paragrafo = paragrafo.replace("I - indeferir pedido formulado com base no art. 1.035, § 6º , ou no art. 1.036, § 2º , de inadmissão de recurso especial ou extraordinário intempestivo;", '');
              paragrafo = paragrafo.replace("II - inadmitir, com base no art. 1.040 , inciso I, recurso especial ou extraordinário sob o fundamento de que o acórdão recorrido coincide com a orientação do tribunal superior;", '');
              paragrafo = paragrafo.replace("III - inadmitir recurso extraordinário, com base no art. 1.035, § 8º , ou no art. 1.039 , parágrafo único, sob o fundamento de que o Supremo Tribunal Federal reconheceu a inexistência de repercussão geral da questão constitucional discutida.", '');
              paragrafo = paragrafo.replace("§ 1º Sob pena de não conhecimento do agravo, incumbirá ao agravante demonstrar, de forma expressa:", '');
              paragrafo = paragrafo.replace("I - a intempestividade do recurso especial ou extraordinário sobrestado, quando o recurso fundar-se na hipótese do inciso I do caput deste artigo;", '');
              paragrafo = paragrafo.replace("II - a existência de distinção entre o caso em análise e o precedente invocado, quando a inadmissão do recurso:", '');
              paragrafo = paragrafo.replace("a) especial ou extraordinário fundar-se em entendimento firmado em julgamento de recurso repetitivo por tribunal superior;", '');
              paragrafo = paragrafo.replace("b) extraordinário fundar-se em decisão anterior do Supremo Tribunal Federal de inexistência de repercussão geral da questão constitucional discutida.", '');
              paragrafo = paragrafo.replace("§ 2º A petição de agravo será dirigida ao presidente ou vice-presidente do tribunal de origem e independe do pagamento de custas e despesas postais.", '');
              paragrafo = paragrafo.replace(". ....................................................................    ..........................................................................................", '___</br>');
              paragrafo = paragrafo.replace(". ......................................................................    .............................................................................................", '___</br>');
              paragrafo = paragrafo.replace("    ...................................................................................", '');
              paragrafo = paragrafo.replace(".    ...................................................................................", '.');
              paragrafo = paragrafo.replace("...........", '');
              // paragrafo = paragrafo.replace("", '');
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
      resultado = resultado.replace(/(LEI Nº 13.105, DE 16 DE MARÇO DE 2015.)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(PARTE GERAL    LIVRO I    DAS NORMAS PROCESSUAIS CIVIS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO ÚNICO    DAS NORMAS FUNDAMENTAIS E DA APLICAÇÃO DAS NORMAS PROCESSUAIS)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO I    DAS NORMAS FUNDAMENTAIS DO PROCESSO CIVIL)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II    DA APLICAÇÃO DAS NORMAS PROCESSUAIS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(LIVRO II    DA FUNÇÃO JURISDICIONAL)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO I    DA JURISDIÇÃO E DA AÇÃO)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO II    DOS LIMITES DA JURISDIÇÃO NACIONAL E DA COOPERAÇÃO INTERNACIONAL)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO I    DOS LIMITES DA JURISDIÇÃO NACIONAL)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II    DA COOPERAÇÃO INTERNACIONAL)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção I    Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II    Do Auxílio Direto)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III    Da Carta Rogatória)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção IV    Disposições Comuns às Seções Anteriores)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO III    DA COMPETÊNCIA INTERNA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO I    DA COMPETÊNCIA)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II    Da Modificação da Competência)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III    Da Incompetência)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II    DA COOPERAÇÃO NACIONAL)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(LIVRO III    DOS SUJEITOS DO PROCESSO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO I    DAS PARTES E DOS PROCURADORES)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO I    DA CAPACIDADE PROCESSUAL)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II    DOS DEVERES DAS PARTES E DE SEUS PROCURADORES)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção I    Dos Deveres)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II    Da Responsabilidade das Partes por Dano Processual)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III    Das Despesas, dos Honorários Advocatícios e das Multas)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção IV    Da Gratuidade da Justiça)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO III    DOS PROCURADORES)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO IV    DA SUCESSÃO DAS PARTES E DOS PROCURADORES)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO II    DO LITISCONSÓRCIO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO III    DA INTERVENÇÃO DE TERCEIROS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO I    DA ASSISTÊNCIA)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção I    Disposições Comuns)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II    Da Assistência Simples)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III    Da Assistência Litisconsorcial)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II    DA DENUNCIAÇÃO DA LIDE)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO III    DO CHAMAMENTO AO PROCESSO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO IV    DO INCIDENTE DE DESCONSIDERAÇÃO DA PERSONALIDADE JURÍDICA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO V    DO AMICUS CURIAE)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO IV    DO JUIZ E DOS AUXILIARES DA JUSTIÇA)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO I    DOS PODERES, DOS DEVERES E DA RESPONSABILIDADE DO JUIZ)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II    DOS IMPEDIMENTOS E DA SUSPEIÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO III    DOS AUXILIARES DA JUSTIÇA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção I    Do Escrivão, do Chefe de Secretaria e do Oficial de Justiça)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II    Do Perito)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III    Do Depositário e do Administrador)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção IV    Do Intérprete e do Tradutor)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção V    Dos Conciliadores e Mediadores Judiciais)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO V    DO MINISTÉRIO PÚBLICO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO VI  DA ADVOCACIA PÚBLICA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO VII  DA DEFENSORIA PÚBLICA)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(LIVRO IV  DOS ATOS PROCESSUAIS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO I  DA FORMA, DO TEMPO E DO LUGAR DOS ATOS PROCESSUAIS)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO I  DA FORMA DOS ATOS PROCESSUAIS)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção I  Dos Atos em Geral)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II    Da Prática Eletrônica de Atos Processuais)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III  Dos Atos das Partes)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção IV  Dos Pronunciamentos do Juiz)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção V  Dos Atos do Escrivão ou do Chefe de Secretaria)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II  DO TEMPO E DO LUGAR DOS ATOS PROCESSUAIS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção I  Do Tempo)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Do Lugar)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO III  DOS PRAZOS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Da Verificação dos Prazos e das Penalidades)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO II  DA COMUNICAÇÃO DOS ATOS PROCESSUAIS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO I  DISPOSIÇÕES GERAIS)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II  DA CITAÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO III  DAS CARTAS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO IV  DAS INTIMAÇÕES)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO III  DAS NULIDADES)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO IV  DA DISTRIBUIÇÃO E DO REGISTRO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO V  DO VALOR DA CAUSA)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(LIVRO V  DA TUTELA PROVISÓRIA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO I  DISPOSIÇÕES GERAIS)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO II  DA TUTELA DE URGÊNCIA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II  DO PROCEDIMENTO DA TUTELA ANTECIPADA REQUERIDA EM CARÁTER ANTECEDENTE)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO III  DO PROCEDIMENTO DA TUTELA CAUTELAR REQUERIDA EM CARÁTER ANTECEDENTE)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO III  DA TUTELA DA EVIDÊNCIA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(LIVRO VI  DA FORMAÇÃO, DA SUSPENSÃO E DA EXTINÇÃO DO PROCESSO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO I  DA FORMAÇÃO DO PROCESSO)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO II  DA SUSPENSÃO DO PROCESSO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO III  DA EXTINÇÃO DO PROCESSO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(PARTE ESPECIAL    LIVRO I  DO PROCESSO DE CONHECIMENTO E DO CUMPRIMENTO DE SENTENÇA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO I  DO PROCEDIMENTO COMUM)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II  DA PETIÇÃO INICIAL)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção I  Dos Requisitos da Petição Inicial)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Do Pedido)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III  Do Indeferimento da Petição Inicial)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO III  DA IMPROCEDÊNCIA LIMINAR DO PEDIDO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO IV  DA CONVERSÃO DA AÇÃO INDIVIDUAL EM AÇÃO COLETIVA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO V  DA AUDIÊNCIA DE CONCILIAÇÃO OU DE MEDIAÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO VI  DA CONTESTAÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO VII  DA RECONVENÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO VIII  DA REVELIA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO IX  DAS PROVIDÊNCIAS PRELIMINARES E DO SANEAMENTO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção I  Da Não Incidência dos Efeitos da Revelia)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Do Fato Impeditivo, Modificativo ou Extintivo do Direito do Autor)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III  Das Alegações do Réu)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO X  DO JULGAMENTO CONFORME O ESTADO DO PROCESSO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção I  Da Extinção do Processo)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Do Julgamento Antecipado do Mérito)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III  Do Julgamento Antecipado Parcial do Mérito)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção IV  Do Saneamento e da Organização do Processo)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO XI  DA AUDIÊNCIA DE INSTRUÇÃO E JULGAMENTO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO XII  DAS PROVAS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Da Produção Antecipada da Prova)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III  Da Ata Notarial)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção IV  Do Depoimento Pessoal)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção V  Da Confissão)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção VI  Da Exibição de Documento ou Coisa)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção VII  Da Prova Documental)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção I  Da Força Probante dos Documentos)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção II  Da Arguição de Falsidade)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção III  Da Produção da Prova Documental)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção VIII  Dos Documentos Eletrônicos)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção IX  Da Prova Testemunhal)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção I  Da Admissibilidade e do Valor da Prova Testemunhal)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção II  Da Produção da Prova Testemunhal)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção X  Da Prova Pericial)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção XI  Da Inspeção Judicial)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO XIII  DA SENTENÇA E DA COISA JULGADA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Dos Elementos e dos Efeitos da Sentença)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III  Da Remessa Necessária)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção IV  Do Julgamento das Ações Relativas às Prestações de Fazer, de Não Fazer e de Entregar Coisa)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção V  Da Coisa Julgada)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO XIV  DA LIQUIDAÇÃO DE SENTENÇA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO II  DO CUMPRIMENTO DA SENTENÇA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II  DO CUMPRIMENTO PROVISÓRIO DA SENTENÇA QUE RECONHECE A EXIGIBILIDADE DE OBRIGAÇÃO DE PAGAR QUANTIA CERTA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO III  DO CUMPRIMENTO DEFINITIVO DA SENTENÇA QUE RECONHECE A EXIGIBILIDADE DE OBRIGAÇÃO DE PAGAR QUANTIA CERTA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO IV  DO CUMPRIMENTO DE SENTENÇA QUE RECONHEÇA A EXIGIBILIDADE DE OBRIGAÇÃO DE PRESTAR ALIMENTOS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO V  DO CUMPRIMENTO DE SENTENÇA QUE RECONHEÇA A EXIGIBILIDADE DE OBRIGAÇÃO DE PAGAR QUANTIA CERTA PELA FAZENDA PÚBLICA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO VI  DO CUMPRIMENTO DE SENTENÇA QUE RECONHEÇA A EXIGIBILIDADE DE OBRIGAÇÃO DE FAZER, DE NÃO FAZER OU DE ENTREGAR COISA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção I  Do Cumprimento de Sentença que Reconheça a Exigibilidade de Obrigação de Fazer ou de Não Fazer)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Do Cumprimento de Sentença que Reconheça a Exigibilidade de Obrigação de Entregar Coisa)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO III  DOS PROCEDIMENTOS ESPECIAIS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO I  DA AÇÃO DE CONSIGNAÇÃO EM PAGAMENTO)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II  DA AÇÃO DE EXIGIR CONTAS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO III  DAS AÇÕES POSSESSÓRIAS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Da Manutenção e da Reintegração de Posse)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III  Do Interdito Proibitório)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO IV  DA AÇÃO DE DIVISÃO E DA DEMARCAÇÃO DE TERRAS PARTICULARES)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Da Demarcação)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III  Da Divisão)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO V  DA AÇÃO DE DISSOLUÇÃO PARCIAL DE SOCIEDADE)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO VI  DO INVENTÁRIO E DA PARTILHA)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Da Legitimidade para Requerer o Inventário)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III  Do Inventariante e das Primeiras Declarações)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção IV  Das Citações e das Impugnações)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção V  Da Avaliação e do Cálculo do Imposto)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção VI  Das Colações)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção VII  Do Pagamento das Dívidas)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção VIII  Da Partilha)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção IX  Do Arrolamento)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção X  Disposições Comuns a Todas as Seções)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO VII  DOS EMBARGOS DE TERCEIRO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO VIII  DA OPOSIÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO IX  DA HABILITAÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO X  DAS AÇÕES DE FAMÍLIA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO XI  DA AÇÃO MONITÓRIA)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO XII  DA HOMOLOGAÇÃO DO PENHOR LEGAL)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO XIII  DA REGULAÇÃO DE AVARIA GROSSA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO XIV  DA RESTAURAÇÃO DE AUTOS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO XV  DOS PROCEDIMENTOS DE JURISDIÇÃO VOLUNTÁRIA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Da Notificação e da Interpelação)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III  Da Alienação Judicial)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção IV  Do Divórcio e da Separação Consensuais, da Extinção Consensual de União Estável e da Alteração do Regime de Bens do Matrimônio)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção V  Dos Testamentos e dos Codicilos)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção VI  Da Herança Jacente)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção VII  Dos Bens dos Ausentes)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção VIII  Das Coisas Vagas)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção IX  Da Interdição)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção X  Disposições Comuns à Tutela e à Curatela)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção XI  Da Organização e da Fiscalização das Fundações)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção XII  Da Ratificação dos Protestos Marítimos e dos Processos Testemunháveis Formados a Bordo)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(LIVRO II  DO PROCESSO DE EXECUÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO I  DA EXECUÇÃO EM GERAL)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II  DAS PARTES)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO III  DA COMPETÊNCIA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO IV  DOS REQUISITOS NECESSÁRIOS PARA REALIZAR QUALQUER EXECUÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção I  Do Título Executivo)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Da Exigibilidade da Obrigação)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO V  DA RESPONSABILIDADE PATRIMONIAL)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO II  DAS DIVERSAS ESPÉCIES DE EXECUÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II  DA EXECUÇÃO PARA A ENTREGA DE COISA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção I  Da Entrega de Coisa Certa)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Da Entrega de Coisa Incerta)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO III  DA EXECUÇÃO DAS OBRIGAÇÕES DE FAZER OU DE NÃO FAZER)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção I  Disposições Comuns)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Da Obrigação de Fazer)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III  Da Obrigação de Não Fazer)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO IV  DA EXECUÇÃO POR QUANTIA CERTA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Da Citação do Devedor e do Arresto)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III  Da Penhora, do Depósito e da Avaliação)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção I  Do Objeto da Penhora)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção II  Da Documentação da Penhora, de seu Registro e do Depósito)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção III  Do Lugar de Realização da Penhora)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção IV  Das Modificações da Penhora)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção V  Da Penhora de Dinheiro em Depósito ou em Aplicação Financeira)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção VI  Da Penhora de Créditos)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção VII  Da Penhora das Quotas ou das Ações de Sociedades Personificadas)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção VIII  Da Penhora de Empresa, de Outros Estabelecimentos e de Semoventes)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção IX  Da Penhora de Percentual de Faturamento de Empresa)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção X  Da Penhora de Frutos e Rendimentos de Coisa Móvel ou Imóvel)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção XI  Da Avaliação)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção IV  Da Expropriação de Bens)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção I  Da Adjudicação)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção II  Da Alienação)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção V  Da Satisfação do Crédito)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO V  DA EXECUÇÃO CONTRA A FAZENDA PÚBLICA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO VI  DA EXECUÇÃO DE ALIMENTOS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO III  DOS EMBARGOS À EXECUÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO IV  DA SUSPENSÃO E DA EXTINÇÃO DO PROCESSO DE EXECUÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO I  DA SUSPENSÃO DO PROCESSO DE EXECUÇÃO)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II  DA EXTINÇÃO DO PROCESSO DE EXECUÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(LIVRO III  DOS PROCESSOS NOS TRIBUNAIS E DOS MEIOS DE IMPUGNAÇÃO DAS DECISÕES JUDICIAIS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO I  DA ORDEM DOS PROCESSOS E DOS PROCESSOS DE COMPETÊNCIA ORIGINÁRIA DOS TRIBUNAIS)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II  DA ORDEM DOS PROCESSOS NO TRIBUNAL)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO III  DO INCIDENTE DE ASSUNÇÃO DE COMPETÊNCIA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO IV  DO INCIDENTE DE ARGUIÇÃO DE INCONSTITUCIONALIDADE)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO V  DO CONFLITO DE COMPETÊNCIA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO VI  DA HOMOLOGAÇÃO DE DECISÃO ESTRANGEIRA E DA CONCESSÃO DO EXEQUATUR À CARTA ROGATÓRIA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO VII  DA AÇÃO RESCISÓRIA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO VIII  DO INCIDENTE DE RESOLUÇÃO DE DEMANDAS REPETITIVAS)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO IX  DA RECLAMAÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(TÍTULO II  DOS RECURSOS)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO II  DA APELAÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO III  DO AGRAVO DE INSTRUMENTO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO IV  DO AGRAVO INTERNO)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO V  DOS EMBARGOS DE DECLARAÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(CAPÍTULO VI  DOS RECURSOS PARA O SUPREMO TRIBUNAL FEDERAL E PARA O SUPERIOR TRIBUNAL DE JUSTIÇA)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção I  Do Recurso Ordinário)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção II  Do Recurso Extraordinário e do Recurso Especial)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Subseção II  Do Julgamento dos Recursos Extraordinário e Especial Repetitivos)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção III  Do Agravo em Recurso Especial e em Recurso Extraordinário)/g, '</br></br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(Seção IV  Dos Embargos de Divergência)/g, '</br><h6 class="leiClass">$1</h6>');
      resultado = resultado.replace(/(LIVRO COMPLEMENTAR  DISPOSIÇÕES FINAIS E TRANSITÓRIAS)/g, '</br><h6 class="leiClass">$1</h6>');
      return resultado;
    }
}
