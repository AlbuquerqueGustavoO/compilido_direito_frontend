import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { AnalyticsService } from 'src/app/service/analytics.service';

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


  constructor(private apiService: AdministrativoService,
  private elementRef: ElementRef,
  private analyticsService: AnalyticsService) { }


  onTermoPesquisaChange(termo: string) {
    this.termoPesquisaSubject.next(termo); // Envie o termo de pesquisa para o subject
  }
  
  ngOnInit(): void {
    this.analyticsService.trackEvent('Administrativo-Licitacoes','Administrativo-Licitacoes into view');
    this.loading = true;
    this.apiService.getAdminContratos().subscribe((data: any) => {
      //console.log('Dados recebidos da API:', data); // Verifica o objeto retornado pela API
      if (data !== undefined && typeof data === 'object') {
        if (data.hasOwnProperty('text') && typeof data.text === 'string') {
          let paragrafosComArt: string[] = data.text.split(/(?=Art)/);

          // Remover os 3 primeiros caracteres do primeiro parágrafo
          if (paragrafosComArt.length > 0) {
            paragrafosComArt[0] = paragrafosComArt[0].substring(6);
          }

          let paragrafos = paragrafosComArt.map(paragrafo => {
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

            // // Aplicar outras transformações apenas se o ponto não estiver dentro de parênteses
            // if (!paragrafo.includes('(') || !paragrafo.includes(')')) {
            //   paragrafo = paragrafo.replace(/\\n/g, ''); // Substituir \n por espaço
            // }
            paragrafo = paragrafo.replace(/ +/g, ' '); // Remover espaços duplicados
            paragrafo = paragrafo.replace(/\\+/g, ' '); // Remover espaços duplicados
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
            paragrafo = paragrafo.replace("(Vide Decreto nº 10.922, de 2021)      (Vigência)    (Vide Decreto nº 11.317, de 2022)       Vigência     ", '');
            paragrafo = paragrafo.replace("(Vide Decreto nº 10.922, de 2021)      (Vigência)      (Vide Decreto nº 11.317, de 2022)       Vigência     ", '');
            paragrafo = paragrafo.replace("(Vide Decreto nº 10.922, de 2021)      (Vigência)       (Vide Decreto nº 11.317, de 2022)       Vigência     ", '');
            paragrafo = paragrafo.replace("(Vide Decreto nº 10.922, de 2021)      (Vigência)      (Vide Decreto nº 11.317, de 2022)       Vigência     ", '');
            paragrafo = paragrafo.replace("XVI - para aquisição, por pessoa jurídica de direito público interno, de insumos estratégicos para a saúde produzidos por fundação que, regimental ou estatutariamente, tenha por finalidade apoiar órgão da Administração Pública direta, sua autarquia ou fundação em projetos de ensino, pesquisa, extensão, desenvolvimento institucional, científico e tecnológico e de estímulo à inovação, inclusive na gestão administrativa e financeira necessária à execução desses projetos, ou em parcerias que envolvam transferência de tecnologia de produtos estratégicos para o SUS, nos termos do inciso XII do caput deste artigo, e que tenha sido criada para esse fim específico em data anterior à entrada em vigor desta Lei, desde que o preço contratado seja compatível com o praticado no mercado.", '');
            paragrafo = paragrafo.replace("XVI - para aquisição, por pessoa jurídica de direito público interno, de insumos estratégicos para a saúde produzidos por fundação que, regimental ou estatutariamente, tenha por finalidade apoiar órgão da Administração Pública direta, sua autarquia ou fundação em projetos de ensino, pesquisa, extensão, desenvolvimento institucional, científico e tecnológico e de estímulo à inovação, inclusive na gestão administrativa e financeira necessária à execução desses projetos, ou em parcerias que envolvam transferência de tecnologia de produtos estratégicos para o SUS, nos termos do inciso XII do caput deste artigo, e que tenha sido criada para esse fim específico em data anterior à entrada em vigor desta Lei, desde que o preço contratado seja compatível com o praticado no mercado; e   (Redação dada pela Medida Provisória nº 1.166, de 2023)    ", '');
            paragrafo = paragrafo.replace("XVII - para a contratação de entidades privadas sem ﬁns lucrativos para a implementação de cisternas ou outras tecnologias sociais de acesso à água para consumo humano e produção de alimentos, para beneﬁciar as famílias rurais de baixa renda atingidas pela seca ou pela falta regular de água.      (Incluído pela Medida Provisória nº 1.166, de 2023)    ", '');
            paragrafo = paragrafo.replace("(Vide Decreto nº 10.922, de 2021)      (Vigência)      (Vide Decreto nº 11.317, de 2022)       Vigência     ", '');
            paragrafo = paragrafo.replace("§ 3º A faculdade conferida pelo § 2º deste artigo estará limitada a órgãos e entidades da Administração Pública federal, estadual, distrital e municipal que, na condição de não participantes, desejarem aderir à ata de registro de preços de órgão ou entidade gerenciadora federal, estadual ou distrital.    ", '');
            paragrafo = paragrafo.replace("(Vide Decreto nº 10.922, de 2021)      (Vigência)    (Vide Decreto nº 11.317, de 2022)       Vigência     ", '');
            paragrafo = paragrafo.replace("Art. 191. Até o decurso do prazo de que trata o inciso II do caput do art. 193, a Administração poderá optar por licitar ou contratar diretamente de acordo com esta Lei ou de acordo com as leis citadas no referido inciso, e a opção escolhida deverá ser indicada expressamente no edital ou no aviso ou instrumento de contratação direta, vedada a aplicação combinada desta Lei com as citadas no referido inciso.    Parágrafo único. Na hipótese do caput deste artigo, se a Administração optar por licitar de acordo com as leis citadas no inciso II do caput do art. 193 desta Lei, o contrato respectivo será regido pelas regras nelas previstas durante toda a sua vigência.    (Revogado pela Medida Provisória nº 1.167, de 2023)   Vigência encerrada ", '');
            paragrafo = paragrafo.replace("Art. 191. Até o decurso do prazo de que trata o inciso II do caput do art. 193, a Administração poderá optar por licitar ou contratar diretamente de acordo com esta Lei ou de acordo com as leis citadas no referido inciso, desde que:    (Redação dada pela Medida Provisória nº 1.167, de 2023)    Vigência encerrada    I - a publicação do edital ou do ato autorizativo da contratação direta ocorra até 29 de dezembro de 2023; e        (Incluído pela Medida Provisória nº 1.167, de 2023)     Vigência encerrada    II -a opção escolhida seja expressamente indicada no edital ou no ato autorizativo da contratação direta.       (Incluído pela Medida Provisória nº 1.167, de 2023)    Vigência encerrada    § 1º Na hipótese do caput, se a Administração optar por licitar de acordo com as leis citadas no inciso II do caput do art. 193, o respectivo contrato será regido pelas regras nelas previstas durante toda a sua vigência.    (Incluído pela Medida Provisória nº 1.167, de 2023)    Vigência encerrada    § 2º É vedada a aplicação combinada desta Lei com as citadas no inciso II do caput do art. 193.      (Incluído pela Medida Provisória nº 1.167, de 2023)     Vigência encerrada", '');
            paragrafo = paragrafo.replace("II - a Lei nº 8.666, de 21 de junho de 1993, a Lei nº 10.520, de 17 de julho de 2002, e os arts. 1º a 47-A da Lei nº 12.462, de 4 de agosto de 2011, após decorridos 2 (dois) anos da publicação oficial desta Lei.    ", '');
            paragrafo = paragrafo.replace("II - em 30 de dezembro de 2023:       (Redação dada pela Medida Provisória nº 1.167, de 2023)       Vigência encerrada    a) a Lei nº 8.666, de 1993;      (Incluído pela Medida Provisória nº 1.167, de 2023)      Vigência encerrada    b) a Lei nº 10.520, de 2002; e      (Incluído pela Medida Provisória nº 1.167, de 2023)      Vigência encerrada    c) os art. 1º a art. 47-A da Lei nº 12.462, de 2011.       (Incluído pela Medida Provisória nº 1.167, de 2023)      Vigência encerrada    ", '');
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

    resultado = resultado.replace(/(LEI Nº 14 . 133, DE 1º DE ABRIL DE 2021)/g, '<h6 class="leiClass">$1</h6><br>');
    resultado = resultado.replace(/(Lei de Licitações e Contratos Administrativos .)/g, '<h6 class="leiClass">$1</h6>');
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
