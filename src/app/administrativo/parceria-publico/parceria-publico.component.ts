import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AdministrativoService } from 'src/app/service/administrativo.service';
import { AnalyticsService } from 'src/app/service/analytics.service';

@Component({
  selector: 'app-parceria-publico',
  templateUrl: './parceria-publico.component.html',
  styleUrls: ['./parceria-publico.component.scss']
})
export class ParceriaPublicoComponent implements OnInit {
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
    this.analyticsService.trackEvent('Administrativo-Parceria','Administrativo-Parceria into view');
    this.loading = true;
    this.apiService.getAdminParceriaPublica().subscribe((data: any) => {
      //console.log('Dados recebidos da API:', data); // Verifica o objeto retornado pela API
      if (data !== undefined && typeof data === 'object') {
        if (data.hasOwnProperty('text') && typeof data.text === 'string') {
          let paragrafosComArt: string[] = data.text.split(/(?=Art)/);

          // Remover os 3 primeiros caracteres do primeiro parágrafo
          if (paragrafosComArt.length > 0) {
            paragrafosComArt[0] = paragrafosComArt[0].substring(3);
          }

          let paragrafos = paragrafosComArt.map(paragrafo => {
            // Substituir quebras de linha por um espaço em branco e remover múltiplas quebras de linha
            paragrafo = paragrafo.replace(/\\n+/g, ' ');
            paragrafo = paragrafo.replace(/  /g, ' ');
            paragrafo = paragrafo.trim();
            paragrafo = paragrafo.replace(/ +/g, ' '); // Remover espaços duplicados
            paragrafo = paragrafo.replace(/\\+/g, ' '); // Remover espaços duplicados
            paragrafo = paragrafo.replace("Presidência da República  Casa Civil  Subchefia para Assuntos Jurídicos    ", '');// Remover texto dentro de parênteses
            paragrafo = paragrafo.replace("Mensagem de veto    ", '');
            paragrafo = paragrafo.replace("Texto compilado    (Vide Lei nº 14.133, de 2021)     t    ", '');
            paragrafo = paragrafo.replace("Parágrafo único. Esta Lei se aplica aos órgãos da Administração Pública direta, aos fundos especiais, às autarquias, às fundações públicas, às empresas públicas, às sociedades de economia mista e às demais entidades controladas direta ou indiretamente pela União, Estados, Distrito Federal e Municípios.", ' ');
            paragrafo = paragrafo.replace("I – cujo valor do contrato seja inferior a R$ 20.000.000,00 (vinte milhões de reais);", ' ');
            paragrafo = paragrafo.replace("I – os requisitos e condições em que o parceiro público autorizará a transferência do controle da sociedade de propósito específico para os seus financiadores, com o objetivo de promover a sua reestruturação financeira e assegurar a continuidade da prestação dos serviços, não se aplicando para este efeito o previsto no inciso I do parágrafo único do art. 27 da Lei nº 8.987, de 13 de fevereiro de 1995;", ' ');
            paragrafo = paragrafo.replace("Parágrafo único. O contrato poderá prever o pagamento ao parceiro privado de remuneração variável vinculada ao seu desempenho, conforme metas e padrões de qualidade e disponibilidade definidos no contrato.    § 1º O contrato poderá prever o pagamento ao parceiro privado de remuneração variável vinculada ao seu desempenho, conforme metas e padrões de qualidade e disponibilidade definidos no contrato.         (Incluído pela Medida Provisória nº 575, de 2012)    § 2º O contrato poderá prever o aporte de recursos em favor do parceiro privado, autorizado por lei específica, para a construção ou aquisição de bens reversíveis, nos termos dos incisos X e XI do caput do art. 18 da Lei nº 8.987, de 13 de fevereiro de 1995         . (Incluído pela Medida Provisória nº 575, de 2012)    § 3º O valor do aporte de recursos realizado nos termos do § 2º poderá ser excluído da determinação:         (Incluído pela Medida Provisória nº 575, de 2012)    I - do lucro líquido para fins de apuração do lucro real e da base de cálculo da Contribuição Social sobre o Lucro Líquido - CSLL; e         (Incluído pela Medida Provisória nº 575, de 2012)    II - da base de cálculo da Contribuição para o PIS/PASEP e da Contribuição para o Financiamento da Seguridade Social - COFINS.         (Incluído pela Medida Provisória nº 575, de 2012)    § 4º A parcela excluída nos termos do § 3º deverá ser computada na determinação do lucro líquido para fins de apuração do lucro real, da base de cálculo da CSLL e da base de cálculo da Contribuição para o PIS/PASEP e da COFINS, na proporção em que o custo para a construção ou aquisição de bens a que se refere o § 2º for realizado, inclusive mediante depreciação ou extinção da concessão, nos termos do art. 35 da Lei nº 8.987, de 1995 .         (Incluído pela Medida Provisória nº 575, de 2012)", ' ');
            paragrafo = paragrafo.replace("§ 4º A parcela excluída nos termos do § 3º deverá ser computada na determinação do lucro líquido para fins de apuração do lucro real, da base de cálculo da CSLL e da base de cálculo da Contribuição para o PIS/Pasep e da Cofins, na proporção em que o custo para a realização de obras e aquisição de bens a que se refere o § 2º deste artigo for realizado, inclusive mediante depreciação ou extinção da concessão, nos termos do art. 35 da Lei nº 8.987, de 13 de fevereiro de 1995. (Incluído pela Lei nº 12.766, de 2012)", ' ');
            paragrafo = paragrafo.replace("Parágrafo único. É facultado à Administração Pública, nos termos do contrato, efetuar o pagamento da contraprestação relativa a parcela fruível de serviço objeto do contrato de parceria público-privada.    §1º É facultado à Administração Pública, nos termos do contrato, efetuar o pagamento da contraprestação relativa a parcela fruível do serviço objeto do contrato de parceria público-privada.         (Incluído pela Medida Provisória nº 575, de 2012)    § 2º O aporte de recursos de que trata o § 2º do art. 6º , quando realizado durante a fase dos investimentos a cargo do parceiro privado, deverá guardar proporcionalidade com as etapas efetivamente executadas.         (Incluído pela Medida Provisória nº 575, de 2012)", ' ');
            paragrafo = paragrafo.replace("Art. 10. A contratação de parceria público-privada será precedida de licitação na modalidade de concorrência, estando a abertura do processo licitatório condicionada a:", ' ');
            paragrafo = paragrafo.replace("VI – submissão da minuta de edital e de contrato à consulta pública, mediante publicação na imprensa oficial, em jornais de grande circulação e por meio eletrônico, que deverá informar a justificativa para a contratação, a identificação do objeto, o prazo de duração do contrato, seu valor estimado, fixando-se prazo mínimo de 30 (trinta) dias para recebimento de sugestões, cujo termo dar-se-á pelo menos 7 (sete) dias antes da data prevista para a publicação do edital; e    VI - submissão da minuta de edital e de contrato à consulta pública, por meio de publicação na imprensa oficial e em sítio eletrônico oficial, que deverá informar a justificativa para a contratação, a identificação do objeto, o prazo de duração do contrato e o seu valor estimado, com a indicação do prazo mínimo de trinta dias para recebimento de sugestões, cujo termo final ocorrerá com, no mínimo, sete dias de antecedência em relação à data prevista para a publicação do edital; e             (Redação dada pela Medida Provisória nº 896, de 2019)              (Vigência encerrada)", ' ');
            paragrafo = paragrafo.replace("Art. 16. Ficam a União, suas autarquias e fundações públicas autorizadas a participar, no limite global de R$ 6.000.000.000,00 (seis bilhões de reais), em Fundo Garantidor de Parcerias Público-Privadas – FGP, que terá por finalidade prestar garantia de pagamento de obrigações pecuniárias assumidas pelos parceiros públicos federais em virtude das parcerias de que trata esta Lei.         (Vide Decreto nº 7.070, de 2010)", ' ');
            paragrafo = paragrafo.replace("Art. 16. Ficam a União, seus fundos especiais, suas autarquias, suas fundações públicas e suas empresas estatais dependentes autorizadas a participar, no limite global de R$ 6.000.000.000,00 (seis bilhões de reais), em Fundo Garantidor de Parcerias Público-Privadas - FGP, que terá por finalidade prestar garantia de pagamento de obrigações pecuniárias assumidas pelos parceiros públicos federais em virtude das parcerias de que trata esta Lei.         (Redação dada pela Medida provisória nº 513, de 2.010)", ' ');
            paragrafo = paragrafo.replace("Art. 16. Ficam a União, seus fundos especiais, suas autarquias, suas fundações públicas e suas empresas estatais dependentes autorizadas a participar, no limite global de R$ 6.000.000.000,00 (seis bilhões de reais), em Fundo Garantidor de Parcerias Público-Privadas - FGP, que terá por finalidade prestar garantia de pagamento de obrigações pecuniárias assumidas pelos parceiros públicos federais em virtude das parcerias de que trata esta Lei.         (Redação dada pela Lei nº 12.409, de 2011)", ' ');
            paragrafo = paragrafo.replace("§ 8º A capitalização do FGP, quando realizada por meio de recursos orçamentários, dar-se-á por ação orçamentária específica para esta finalidade, no âmbito de Encargos Financeiros da União.         (Incluído pela Medida provisória nº 513, de 2.010)", ' ');
            paragrafo = paragrafo.replace("Art. 18. As garantias do FGP serão prestadas proporcionalmente ao valor da participação de cada cotista, sendo vedada a concessão de garantia cujo valor presente líquido, somado ao das garantias anteriormente prestadas e demais obrigações, supere o ativo total do FGP.", ' ');
            paragrafo = paragrafo.replace("Art. 18. O estatuto e o regulamento do FGP devem deliberar sobre a política de concessão de garantias, inclusive no que se refere à relação entre ativos e passivos do Fundo.         (Redação dada pela Medida provisória nº 513, de 2.010) ", ' ');
            paragrafo = paragrafo.replace("§ 4º No caso de crédito líquido e certo, constante de título exigível aceito e não pago pelo parceiro público, a garantia poderá ser acionada pelo parceiro privado a partir do 45º (quadragésimo quinto) dia do seu vencimento.    § 4º O FGP poderá prestar garantia mediante contratação de instrumentos disponíveis em mercado, inclusive para complementação das modalidades previstas no § 1º .         (Redação dada pela Medida Provisória nº 575, de 2012)", ' ');
            paragrafo = paragrafo.replace("§ 5º O parceiro privado poderá acionar a garantia relativa a débitos constantes de faturas emitidas e ainda não aceitas pelo parceiro público, desde que, transcorridos mais de 90 (noventa) dias de seu vencimento, não tenha havido sua rejeição expressa por ato motivado.    § 5º O parceiro privado poderá acionar o FGP nos casos de:         (Redação dada pela Medida Provisória nº 575, de 2012)    I - crédito líquido e certo, constante de título exigível aceito e não pago pelo parceiro público após quinze dias contados da data de vencimento; e         (Incluído pela Medida Provisória nº 575, de 2012)    II - débitos constantes de faturas emitidas e não aceitas pelo parceiro público após quarenta e cinco dias contados da data de vencimento, desde que não tenha havido rejeição expressa por ato motivado.         (Incluído pela Medida Provisória nº 575, de 2012)", ' ');
            paragrafo = paragrafo.replace("§ 8º O FGP poderá usar parcela da cota da União para prestar garantia aos seus fundos especiais, às suas autarquias, às suas fundações públicas e às suas empresas estatais dependentes.         (Incluído pela Medida provisória nº 513, de 2.010)", ' ');
            paragrafo = paragrafo.replace("§ 9º O FGP é obrigado a honrar faturas aceitas e não pagas pelo parceiro público.         (Incluído pela Medida Provisória nº 575, de 2012)", ' ');
            paragrafo = paragrafo.replace("§ 10. O FGP é proibido de pagar faturas rejeitadas expressamente por ato motivado.         (Incluído pela Medida Provisória nº 575, de 2012)", ' ');
            paragrafo = paragrafo.replace("§ 11. O parceiro público deverá informar o FGP sobre qualquer fatura rejeitada e sobre os motivos da rejeição, no prazo de quarenta dias contados da data de vencimento.         (Incluído pela Medida Provisória nº 575, de 2012)", ' ');
            paragrafo = paragrafo.replace("§ 12. A ausência de aceite ou rejeição expressa de fatura por parte do parceiro público no prazo de quarenta dias contado da data de vencimento implicará aceitação tácita.         (Incluído pela Medida Provisória nº 575, de 2012)", ' ');
            paragrafo = paragrafo.replace("§ 13. O agente público que contribuir por ação ou omissão para a aceitação tácita de que trata o §12 ou que rejeitar fatura sem motivação será responsabilizado pelos danos que causar, em conformidade com a legislação civil, administrativa e penal em vigor.         (Incluído pela Medida Provisória nº 575, de 2012)", ' ');
            paragrafo = paragrafo.replace("....................................................................................", ' ');
            paragrafo = paragrafo.replace(".........................................................................................", ' ');
            paragrafo = paragrafo.replace(".........................................................................................", ' ');
            paragrafo = paragrafo.replace("Art. 28. A União não poderá conceder garantia e realizar transferência voluntária aos Estados, Distrito Federal e Municípios se a soma das despesas de caráter continuado derivadas do conjunto das parcerias já contratadas por esses entes tiver excedido, no ano anterior, a 1% (um por cento) da receita corrente líquida do exercício ou se as despesas anuais dos contratos vigentes nos 10 (dez) anos subseqüentes excederem a 1% (um por cento) da receita corrente líquida projetada para os respectivos exercícios.", ' ');
            paragrafo = paragrafo.replace("Art. 28. A União não poderá conceder garantia e realizar transferência voluntária aos Estados, Distrito Federal e Municípios se a soma das despesas de caráter continuado derivadas do conjunto das parcerias já contratadas por esses entes tiver excedido, no ano anterior, a 3% (três por cento) da receita corrente líquida do exercício ou se as despesas anuais dos contratos vigentes nos 10 (dez) anos subsequentes excederem a 3% (três por cento) da receita corrente líquida projetada para os respectivos exercícios.         (Redação dada pela Lei nº 12.024, de 2009)", ' ');
            paragrafo = paragrafo.replace("Art. 28. A União não poderá conceder garantia ou realizar transferência voluntária aos Estados, Distrito Federal e Municípios se a soma das despesas de caráter continuado derivadas do conjunto das parcerias já contratadas por esses entes tiver excedido, no ano anterior, a cinco por cento da receita corrente líquida do exercício ou se as despesas anuais dos contratos vigentes nos dez anos subsequentes excederem a cinco por cento da receita corrente líquida projetada para os respectivos exercícios.         (Redação dada pela Medida Provisória nº 575, de 2012)", ' ');
            paragrafo = paragrafo.replace("§ 2º Na aplicação do limite previsto no caput deste artigo, serão computadas as despesas derivadas de contratos de parceria celebrados pela Administração Pública direta, autarquias, fundações públicas, empresas públicas, sociedades de economia mista e demais entidades controladas, direta ou indiretamente, pelo respectivo ente.", ' ');
            // console.log(paragrafo)

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
    resultado = resultado.replace(/\(([^):,]+)\)\s*/g, '($1)<br><br>');

    resultado = resultado.replace(/(LEI Nº 11 . 079, DE 30 DE DEZEMBRO DE 2004)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Institui normas gerais para licitação e contratação de parceria público-privada no âmbito da administração pública .)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(O PRESIDENTE DA REPÚBLICA Faço saber que o Congresso Nacional decreta e eu sanciono a seguinte Lei:)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo I    DISPOSIÇÕES PRELIMINARES)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo II    DOS CONTRATOS DE PARCERIA PÚBLICO-PRIVADA)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo III    DAS GARANTIAS)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo IV    DA SOCIEDADE DE PROPÓSITO ESPECÍFICO)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo V    DA LICITAÇÃO)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo VI    DISPOSIÇÕES APLICÁVEIS À UNIÃO)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Capítulo VII    DISPOSIÇÕES FINAIS)/g, '</br></br><h6 class="leiClass">$1</h6>');
    return resultado;
  }
}
