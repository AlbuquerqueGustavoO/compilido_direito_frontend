import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { PenalService } from 'src/app/service/penal.service';

@Component({
  selector: 'app-ocultacao-bens',
  templateUrl: './ocultacao-bens.component.html',
  styleUrls: ['./ocultacao-bens.component.scss']
})
export class OcultacaoBensComponent implements OnInit {

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
    this.analyticsService.trackEvent('CodigoPenal-Ocultacao-Bens', 'CodigoPenal-Ocultacao-Bens into view');
    this.loading = true;
    this.apiService.getOcultacaoBens().subscribe((data: any) => {
      //console.log('Dados recebidos da API:', data); // Verifica o objeto retornado pela API
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
            paragrafo = paragrafo.replace("    Presidência da República  Casa Civil  Subchefia para Assuntos Jurídicos", '');// Remover texto dentro de parênteses
            paragrafo = paragrafo.replace("     t    ", ' ');
            paragrafo = paragrafo.replace("    Texto compilado    ", '');
            paragrafo = paragrafo.replace("Art. 1º Ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de crime:", '');
            paragrafo = paragrafo.replace("I - de tráfico ilícito de substâncias entorpecentes ou drogas afins;", '');
            paragrafo = paragrafo.replace("II - de terrorismo;    II – de terrorismo e seu financiamento;                    (Redação dada pela Lei nº 10.701, de 2003)", '');
            paragrafo = paragrafo.replace("III - de contrabando ou tráfico de armas, munições ou material destinado à sua produção;", '');
            paragrafo = paragrafo.replace("IV - de extorsão mediante seqüestro;", '');
            paragrafo = paragrafo.replace("V - contra a Administração Pública, inclusive a exigência, para si ou para outrem, direta ou indiretamente, de qualquer vantagem, como condição ou preço para a prática ou omissão de atos administrativos;", '');
            paragrafo = paragrafo.replace("VII - praticado por organização criminosa.", '');
            paragrafo = paragrafo.replace("VIII – praticado por particular contra a administração pública estrangeira (arts. 337-B, 337-C e 337-D do Decreto-Lei nº 2.848, de 7 de dezembro de 1940 – Código Penal).                   (Incluído pela Lei nº 10.467, de 2002)    Pena: reclusão de três a dez anos e multa.", '');
            paragrafo = paragrafo.replace("§ 1º Incorre na mesma pena quem, para ocultar ou dissimular a utilização de bens, direitos ou valores provenientes de qualquer dos crimes antecedentes referidos neste artigo:", '');
            paragrafo = paragrafo.replace("§ 2º Incorre, ainda, na mesma pena quem:", '');
            paragrafo = paragrafo.replace("I - utiliza, na atividade econômica ou financeira, bens, direitos ou valores que sabe serem provenientes de qualquer dos crimes antecedentes referidos neste artigo;", '');
            paragrafo = paragrafo.replace("§ 4º A pena será aumentada de um a dois terços, nos casos previstos nos incisos I a VI do caput deste artigo, se o crime for cometido de forma habitual ou por intermédio de organização criminosa.    § 4o  A pena será aumentada de um a dois terços, se os crimes definidos nesta Lei forem cometidos de forma reiterada ou por intermédio de organização criminosa.    (Redação dada pela Lei nº 12.683, de 2012)", '');
            paragrafo = paragrafo.replace("§ 5º A pena será reduzida de um a dois terços e começará a ser cumprida em regime aberto, podendo o juiz deixar de aplicá-la ou substituí-la por pena restritiva de direitos, se o autor, co-autor ou partícipe colaborar espontaneamente com as autoridades, prestando esclarecimentos que conduzam à apuração das infrações penais e de sua autoria ou à localização dos bens, direitos ou valores objeto do crime.", '');
            paragrafo = paragrafo.replace("II - independem do processo e julgamento dos crimes antecedentes referidos no artigo anterior, ainda que praticados em outro país;", '');
            paragrafo = paragrafo.replace("b) quando o crime antecedente for de competência da Justiça Federal.", '');
            paragrafo = paragrafo.replace("§ 1º A denúncia será instruída com indícios suficientes da existência do crime antecedente, sendo puníveis os fatos previstos nesta Lei, ainda que desconhecido ou isento de pena o autor daquele crime.", '');
            paragrafo = paragrafo.replace("§ 2º No processo por crime previsto nesta Lei, não se aplica o disposto no art. 366 do Código de Processo Penal.", '');
            paragrafo = paragrafo.replace("Art. 3º Os crimes disciplinados nesta Lei são insuscetíveis de fiança e liberdade provisória e, em caso de sentença condenatória, o juiz decidirá fundamentadamente se o réu poderá apelar em liberdade.                      (Revogado pela Lei nº 12.683, de 2012)", '');
            paragrafo = paragrafo.replace("Art. 4º O juiz, de ofício, a requerimento do Ministério Público, ou representação da autoridade policial, ouvido o Ministério Público em vinte e quatro horas, havendo indícios suficientes, poderá decretar, no curso do inquérito ou da ação penal, a apreensão ou o seqüestro de bens, direitos ou valores do acusado, ou existentes em seu nome, objeto dos crimes previstos nesta Lei, procedendo-se na forma dos arts. 125 a 144 do Decreto-Lei nº 3.689, de 3 de outubro de 1941 - Código de Processo Penal.    § 1º As medidas assecuratórias previstas neste artigo serão levantadas se a ação penal não for iniciada no prazo de cento e vinte dias, contados da data em que ficar concluída a diligência.    § 2º O juiz determinará a liberação dos bens, direitos e valores apreendidos ou seqüestrados quando comprovada a licitude de sua origem.    § 3º Nenhum pedido de restituição será conhecido sem o comparecimento pessoal do acusado, podendo o juiz determinar a prática de atos necessários à conservação de bens, direitos ou valores, nos casos do art. 366 do Código de Processo Penal.    § 4º A ordem de prisão de pessoas ou da apreensão ou seqüestro de bens, direitos ou valores, poderá ser suspensa pelo juiz, ouvido o Ministério Público, quando a sua execução imediata possa comprometer as investigações.", '');
            paragrafo = paragrafo.replace("Art. 5º Quando as circunstâncias o aconselharem, o juiz, ouvido o Ministério Público, nomeará pessoa qualificada para a administração dos bens, direitos ou valores apreendidos ou seqüestrados, mediante termo de compromisso.", '');
            paragrafo = paragrafo.replace("Art. 6º O administrador dos bens:", '');
            paragrafo = paragrafo.replace("Parágrafo único. Os atos relativos à administração dos bens apreendidos ou seqüestrados serão levados ao conhecimento do Ministério Público, que requererá o que entender cabível.", '');
            paragrafo = paragrafo.replace("I - a perda, em favor da União, dos bens, direitos e valores objeto de crime previsto nesta Lei, ressalvado o direito do lesado ou de terceiro de boa-fé;", '');
            paragrafo = paragrafo.replace("Art. 8º O juiz determinará, na hipótese de existência de tratado ou convenção internacional e por solicitação de autoridade estrangeira competente, a apreensão ou o seqüestro de bens, direitos ou valores oriundos de crimes descritos no art. 1º, praticados no estrangeiro.", '');
            paragrafo = paragrafo.replace("§ 2º Na falta de tratado ou convenção, os bens, direitos ou valores apreendidos ou seqüestrados por solicitação de autoridade estrangeira competente ou os recursos provenientes da sua alienação serão repartidos entre o Estado requerente e o Brasil, na proporção de metade, ressalvado o direito do lesado ou de terceiro de boa-fé.", '');
            paragrafo = paragrafo.replace("    CAPÍTULO V    Das Pessoas Sujeitas À Lei", '');
            paragrafo = paragrafo.replace("Art. 9º Sujeitam-se às obrigações referidas nos arts. 10 e 11 as pessoas jurídicas que tenham, em caráter permanente ou eventual, como atividade principal ou acessória, cumulativamente ou não:", '');
            paragrafo = paragrafo.replace("I - as bolsas de valores e bolsas de mercadorias ou futuros;", '');
            paragrafo = paragrafo.replace("V - as empresas de arrendamento mercantil (leasing) e as de fomento comercial (factoring);", '');
            paragrafo = paragrafo.replace("VI - as sociedades que efetuem distribuição de dinheiro ou quaisquer bens móveis, imóveis, mercadorias, serviços, ou, ainda, concedam descontos na sua aquisição, mediante sorteio ou método assemelhado;", '');
            paragrafo = paragrafo.replace("X - as pessoas jurídicas que exerçam atividades de promoção imobiliária ou compra e venda de imóveis;", '');
            paragrafo = paragrafo.replace("XII – as pessoas físicas ou jurídicas que comercializem bens de luxo ou de alto valor ou exerçam atividades que envolvam grande volume de recursos em espécie.            (Incluído pela Lei nº 10.701, de 2003)", '');
            paragrafo = paragrafo.replace("II - manterão registro de toda transação em moeda nacional ou estrangeira, títulos e valores mobiliários, títulos de crédito, metais, ou qualquer ativo passível de ser convertido em dinheiro, que ultrapassar limite fixado pela autoridade competente e nos termos de instruções por esta expedidas;", '');
            paragrafo = paragrafo.replace("III - deverão atender, no prazo fixado pelo órgão judicial competente, as requisições formuladas pelo Conselho criado pelo art. 14, que se processarão em segredo de justiça.", '');
            paragrafo = paragrafo.replace("II - deverão comunicar, abstendo-se de dar aos clientes ciência de tal ato, no prazo de vinte e quatro horas, às autoridades competentes:", '');
            paragrafo = paragrafo.replace("a) todas as transações constantes do inciso II do art. 10 que ultrapassarem limite fixado, para esse fim, pela mesma autoridade e na forma e condições por ela estabelecidas;    a) todas as transações constantes do inciso II do art. 10 que ultrapassarem limite fixado, para esse fim, pela mesma autoridade e na forma e condições por ela estabelecidas, devendo ser juntada a identificação a que se refere o inciso I do mesmo artigo;            (Redação dada pela Lei nº 10.701, de 2003)", '');
            paragrafo = paragrafo.replace("b) a proposta ou a realização de transação prevista no inciso I deste artigo.", '');
            paragrafo = paragrafo.replace("§ 3º As pessoas para as quais não exista órgão próprio fiscalizador ou regulador farão as comunicações mencionadas neste artigo ao Conselho de Controle das Atividades Financeiras - COAF e na forma por ele estabelecida.", '');
            paragrafo = paragrafo.replace("II - multa pecuniária variável, de um por cento até o dobro do valor da operação, ou até duzentos por cento do lucro obtido ou que presumivelmente seria obtido pela realização da operação, ou, ainda, multa de até R$ 200.000,00 (duzentos mil reais);", '');
            paragrafo = paragrafo.replace("IV - cassação da autorização para operação ou funcionamento.", '');
            paragrafo = paragrafo.replace("§ 2º A multa será aplicada sempre que as pessoas referidas no art. 9º, por negligência ou dolo:", '');
            paragrafo = paragrafo.replace("II – não realizarem a identificação ou o registro previstos nos incisos I e II do art. 10;", '');
            paragrafo = paragrafo.replace("III - deixarem de atender, no prazo, a requisição formulada nos termos do inciso III do art. 10;", '');
            paragrafo = paragrafo.replace("O procedimento para a aplicação das sanções previstas neste Capítulo será regulado por decreto, assegurados o contraditório e a ampla defesa.                (Revogado pela Medida Provisória nº 893, de 2019)", '');
            paragrafo = paragrafo.replace("Art. 14. É criado, no âmbito do Ministério da Fazenda, o Conselho de Controle de Atividades Financeiras - COAF, com a finalidade de disciplinar, aplicar penas administrativas, receber, examinar e identificar as ocorrências suspeitas de atividades ilícitas previstas nesta Lei, sem prejuízo da competência de outros órgãos e entidades.", '');
            paragrafo = paragrafo.replace("Art. 14.  Fica criado, no âmbito do Ministério da Justiça e Segurança Pública, o Conselho de Controle de Atividades Financeiras - COAF, com a finalidade de disciplinar, aplicar penas administrativas, receber, examinar e identificar as ocorrências suspeitas de atividades ilícitas previstas nesta Lei, sem prejuízo da competência de outros órgãos e entidades.                  (Redação dada pela Medida Provisória nº 870, de 2019)", '');
            paragrafo = paragrafo.replace("Art. 14. É criado, no âmbito do Ministério da Fazenda, o Conselho de Controle de Atividades Financeiras - COAF, com a finalidade de disciplinar, aplicar penas administrativas, receber, examinar e identificar as ocorrências suspeitas de atividades ilícitas previstas nesta Lei, sem prejuízo da competência de outros órgãos e entidades.", '');
            paragrafo = paragrafo.replace("Art. 14.  Fica criado, no âmbito do Ministério da Economia, o Conselho de Controle de Atividades Financeiras - Coaf, com a finalidade de disciplinar, aplicar penas administrativas, receber, examinar e identificar as ocorrências suspeitas de atividades ilícitas previstas nesta Lei, sem prejuízo das competências de outros órgãos e entidades.           (Redação dada pela Medida Provisória nº 886, de 2019)", '');
            paragrafo = paragrafo.replace("Art. 17-F.  O tratamento de dados pessoais pelo Coaf:        (Incluído pela Medida Provisória nº 1.158, de 2023)  Vigência encerrada    I - será realizado de forma estritamente necessária para o atendimento às suas finalidades legais;       (Incluído pela Medida Provisória nº 1.158, de 2023)  Vigência encerrada    II - garantirá a exatidão e a atualização dos dados, respeitadas as medidas adequadas para a eliminação ou a retificação de dados inexatos;      (Incluído pela Medida Provisória nº 1.158, de 2023)  Vigência encerrada    III - não superará o período necessário para o atendimento às suas finalidades legais;     (Incluído pela Medida Provisória nº 1.158, de 2023)  Vigência encerrada    IV - considerará, na hipótese de compartilhamento, a sua realização por intermédio de comunicação formal, com garantia de sigilo, certificação do destinatário e estabelecimento de instrumentos efetivos de apuração e correção de eventuais desvios cometidos em seus procedimentos internos;     (Incluído pela Medida Provisória nº 1.158, de 2023)   Vigência encerrada    V - garantirá níveis adequados de segurança, respeitadas as medidas técnicas e administrativas para impedir acessos, destruição, perda, alteração, comunicação, compartilhamento, transferência ou difusão não autorizadas ou ilícitas;    (Incluído pela Medida Provisória nº 1.158, de 2023)   Vigência encerrada    VI - será dotado de medidas especiais de segurança quando se tratar de dados:     (Incluído pela Medida Provisória nº 1.158, de 2023)   Vigência encerrada    a) sensíveis, nos termos do disposto no inciso II do caput do art. 5º da Lei nº 13.709, de 14 de agosto de 2018; e        (Incluído pela Medida Provisória nº 1.158, de 2023)    Vigência encerrada    b) protegidos por sigilo; e      (Incluído pela Medida Provisória nº 1.158, de 2023)   Vigência encerrada    VII - não será utilizado para fins discriminatórios, ilícitos ou abusivos.      (Incluído pela Medida Provisória nº 1.158, de 2023)   Vigência encerrada", '');
            paragrafo = paragrafo.replace(`    *                                         ""`, '');
            paragrafo = paragrafo.replace("), ", ')');
            paragrafo = paragrafo.replace("),", ')');
            paragrafo = paragrafo.replace(").", ')');
            paragrafo = paragrafo.replace(").", ')');
            paragrafo = paragrafo.replace(").", ')');
            paragrafo = paragrafo.replace("):", ')');
            paragrafo = paragrafo.replace(");", ')');
            paragrafo = paragrafo.replace(");                    ", ')');
            paragrafo = paragrafo.replace(");                ", ')');
            paragrafo = paragrafo.replace(");                     ", ')');
            paragrafo = paragrafo.replace(");                    ", ')');
            paragrafo = paragrafo.replace(");                   ", ')');
            paragrafo = paragrafo.replace(");                   ", ')');
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
    resultado = resultado.replace(/\(([^);]+)\)\s*/g, '($1)<br><br>');

    resultado = resultado.replace(/(LEI Nº 9 . 613, DE 3 DE MARÇO DE 1998 .)/g, '<h6 class="leiClass">$1</h6></br>');
    resultado = resultado.replace(/(CAPÍTULO I    Dos Crimes de  "Lavagem " ou Ocultação de Bens, Direitos e Valores)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    Disposições Processuais Especiais)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III    Dos Efeitos da Condenação)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV    Dos Bens, Direitos ou Valores Oriundos de Crimes Praticados no Estrangeiro)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    CAPÍTULO V  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI    Da Identificação dos Clientes e Manutenção de Registros)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII    Da Comunicação de Operações Financeiras)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VIII    Da Responsabilidade Administrativa)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IX    Do Conselho de Controle de Atividades Financeiras)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(     CAPÍTULO X  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    return resultado;
  }


}
