import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { PenalService } from 'src/app/service/penal.service';

@Component({
  selector: 'app-lei-drogas',
  templateUrl: './lei-drogas.component.html',
  styleUrls: ['./lei-drogas.component.scss']
})
export class LeiDrogasComponent implements OnInit {

  paragrafos: string[] = [];
  termoPesquisa: string = '';
  ocorrencias: number[] = [];
  ocorrenciaAtual: number = -1;
  isSearchVisible = false;
  loading = false;
  private termoPesquisaSubject = new Subject<string>();
  private termoPesquisaDebounced = new Subject<string>();



  constructor(private apiService: PenalService, private elementRef: ElementRef) { }

  onTermoPesquisaChange(termo: string) {
    this.termoPesquisaSubject.next(termo); // Envie o termo de pesquisa para o subject
  }

  ngOnInit(): void {
    this.loading = true;
    this.apiService.getDrogas().subscribe((data: any) => {
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
            paragrafo = paragrafo.replace("Texto compilado  Mensagem de veto  Regulamento    ", '');
            paragrafo = paragrafo.replace("    Mensagem de veto t    ", ' ');
            paragrafo = paragrafo.replace("    CAPÍTULO II  DA COMPOSIÇÃO E DA ORGANIZAÇÃO D O SISTEMA NACIONAL DE POLÍTICAS PÚBLICAS SOBRE DROGAS    ", '');
            paragrafo = paragrafo.replace("    CAPÍTULO IV  DA COLETA, ANÁLISE E DISSEMINAÇÃO DE INFORMAÇÕES SOBRE DROGAS", '');
            paragrafo = paragrafo.replace("Art. 32. As plantações ilícitas serão imediatamente destruídas pelas autoridades de polícia judiciária, que recolherão quantidade suficiente para exame pericial, de tudo lavrando auto de levantamento das condições encontradas, com a delimitação do local, asseguradas as medidas necessárias para a preservação da prova.    § 1º A destruição de drogas far-se-á por incineração, no prazo máximo de 30 (trinta) dias, guardando-se as amostras necessárias à preservação da prova.    § 2º A incineração prevista no § 1º deste artigo será precedida de autorização judicial, ouvido o Ministério Público, e executada pela autoridade de polícia judiciária competente, na presença de representante do Ministério Público e da autoridade sanitária competente, mediante auto circunstanciado e após a perícia realizada no local da incineração.", '');
            paragrafo = paragrafo.replace("Art. 50-A. A destruição de drogas apreendidas sem a ocorrência de prisão em flagrante será feita por incineração, no prazo máximo de 30 (trinta) dias contado da data da apreensão, guardando-se amostra necessária à realização do laudo definitivo, aplicando-se, no que couber, o procedimento dos §§ 3º a 5º do art. 50.             (Incluído pela Lei nº 12.961, de 2014)", '');
            paragrafo = paragrafo.replace("Art. 60. O juiz, de ofício, a requerimento do Ministério Público ou mediante representação da autoridade de polícia judiciária, ouvido o Ministério Público, havendo indícios suficientes, poderá decretar, no curso do inquérito ou da ação penal, a apreensão e outras medidas assecuratórias relacionadas aos bens móveis e imóveis ou valores consistentes em produtos dos crimes previstos nesta Lei, ou que constituam proveito auferido com sua prática, procedendo-se na forma dos arts. 125 a 144 do Decreto-Lei nº 3.689, de 3 de outubro de 1941 - Código de Processo Penal.    § 1º Decretadas quaisquer das medidas previstas neste artigo, o juiz facultará ao acusado que, no prazo de 5 (cinco) dias, apresente ou requeira a produção de provas acerca da origem lícita do produto, bem ou valor objeto da decisão.    § 2º Provada a origem lícita do produto, bem ou valor, o juiz decidirá pela sua liberação.    § 3º Nenhum pedido de restituição será conhecido sem o comparecimento pessoal do acusado, podendo o juiz determinar a prática de atos necessários à conservação de bens, direitos ou valores.    § 4º A ordem de apreensão ou seqüestro de bens, direitos ou valores poderá ser suspensa pelo juiz, ouvido o Ministério Público, quando a sua execução imediata possa comprometer as investigações.", '');
            paragrafo = paragrafo.replace("Art. 60-A. Quando as medidas assecuratórias de que trata o art. 60 recaírem sobre moeda estrangeira, títulos, valores mobiliários ou cheques emitidos como ordem de pagamento, será determinada, imediatamente, a conversão em moeda nacional.             (Incluído pela Medida Provisória nº 885, de 2019)    § 1º  A moeda estrangeira apreendida em espécie será encaminhada a instituição financeira ou equiparada para alienação na forma prevista pelo Conselho Monetário Nacional.             (Incluído pela Medida Provisória nº 885, de 2019)    § 2º  Em caso de impossibilidade da alienação a que se refere o § 1º, a moeda estrangeira será custodiada pela instituição financeira até decisão sobre o seu destino.             (Incluído pela Medida Provisória nº 885, de 2019)    § 3º  Após a decisão sobre o destino da moeda estrangeira, caso seja verificada a inexistência de valor de mercado, a moeda poderá ser doada à representação diplomática do seu país de origem ou destruída.             (Incluído pela Medida Provisória nº 885, de 2019)    § 4º  Os valores relativos às apreensões feitas antes da data de entrada em vigor da Medida Provisória nº 885, de 17 de junho de 2019 , e que estejam custodiados nas dependências do Banco Central do Brasil serão transferidos, no prazo de trezentos e sessenta dias, à Caixa Econômica Federal para que se proceda à alienação ou custódia, de acordo com o previsto nesta Lei.             (Incluído pela Medida Provisória nº 885, de 2019)", '');
            paragrafo = paragrafo.replace("Art. 61. Não havendo prejuízo para a produção da prova dos fatos e comprovado o interesse público ou social, ressalvado o disposto no art. 62 desta Lei, mediante autorização do juízo competente, ouvido o Ministério Público e cientificada a Senad, os bens apreendidos poderão ser utilizados pelos órgãos ou pelas entidades que atuam na prevenção do uso indevido, na atenção e reinserção social de usuários e dependentes de drogas e na repressão à produção não autorizada e ao tráfico ilícito de drogas, exclusivamente no interesse dessas atividades.    Parágrafo único. Recaindo a autorização sobre veículos, embarcações ou aeronaves, o juiz ordenará à autoridade de trânsito ou ao equivalente órgão de registro e controle a expedição de certificado provisório de registro e licenciamento, em favor da instituição à qual tenha deferido o uso, ficando esta livre do pagamento de multas, encargos e tributos anteriores, até o trânsito em julgado da decisão que decretar o seu perdimento em favor da União.", '');
            paragrafo = paragrafo.replace("Art. 61.  A apreensão de veículos, embarcações, aeronaves e quaisquer outros meios de transporte e dos maquinários, utensílios, instrumentos e objetos de qualquer natureza utilizados para a prática dos crimes definidos nesta Lei será imediatamente comunicada pela autoridade de polícia judiciária responsável pela investigação ao juízo competente.         (Redação dada pela Lei nº 13.840, de 2019)", '');
            paragrafo = paragrafo.replace("§ 6º  Os valores arrecadados, descontadas as despesas do leilão, serão depositados em conta judicial remunerada e, após sentença condenatória transitada em julgado, serão revertidos ao Funad.             (Incluído pela Lei nº 13.840, de 2019)             (Revogado pela Medida Provisória nº 885, de 2019)    § 7º  No caso da alienação de veículos, embarcações ou aeronaves, o juiz ordenará à autoridade ou ao órgão de registro e controle a expedição de certificado de registro e licenciamento em favor do arrematante, ficando este livre do pagamento de multas, encargos e tributos anteriores, sem prejuízo da cobrança de débitos fiscais, os quais permanecem sob responsabilidade do antigo proprietário.         (Incluído pela Lei nº 13.840, de 2019)             (Revogado pela Medida Provisória nº 885, de 2019)    § 8º  Nos casos em que a apreensão tiver recaído sobre dinheiro, inclusive moeda estrangeira, ou cheques emitidos como ordem de pagamento para fins ilícitos, o juiz determinará sua conversão em moeda nacional corrente, que será depositada em conta judicial remunerada, e, após sentença condenatória com trânsito em julgado, será revertida ao Funad.             (Incluído pela Lei nº 13.840, de 2019)             (Revogado pela Medida Provisória nº 885, de 2019)", '');
            paragrafo = paragrafo.replace("Art. 62. Os veículos, embarcações, aeronaves e quaisquer outros meios de transporte, os maquinários, utensílios, instrumentos e objetos de qualquer natureza, utilizados para a prática dos crimes definidos nesta Lei, após a sua regular apreensão, ficarão sob custódia da autoridade de polícia judiciária, excetuadas as armas, que serão recolhidas na forma de legislação específica.", '');
            paragrafo = paragrafo.replace("§ 1º Comprovado o interesse público na utilização de qualquer dos bens mencionados neste artigo, a autoridade de polícia judiciária poderá deles fazer uso, sob sua responsabilidade e com o objetivo de sua conservação, mediante autorização judicial, ouvido o Ministério Público.             (Revogado pela Medida Provisória nº 885, de 2019)", '');
            paragrafo = paragrafo.replace("§ 2º Feita a apreensão a que se refere o caput deste artigo, e tendo recaído sobre dinheiro ou cheques emitidos como ordem de pagamento, a autoridade de polícia judiciária que presidir o inquérito deverá, de imediato, requerer ao juízo competente a intimação do Ministério Público.", '');
            paragrafo = paragrafo.replace("§ 3º Intimado, o Ministério Público deverá requerer ao juízo, em caráter cautelar, a conversão do numerário apreendido em moeda nacional, se for o caso, a compensação dos cheques emitidos após a instrução do inquérito, com cópias autênticas dos respectivos títulos, e o depósito das correspondentes quantias em conta judicial, juntando-se aos autos o recibo.", '');
            paragrafo = paragrafo.replace("§ 4º Após a instauração da competente ação penal, o Ministério Público, mediante petição autônoma, requererá ao juízo competente que, em caráter cautelar, proceda à alienação dos bens apreendidos, excetuados aqueles que a União, por intermédio da Senad, indicar para serem colocados sob uso e custódia da autoridade de polícia judiciária, de órgãos de inteligência ou militares, envolvidos nas ações de prevenção ao uso indevido de drogas e operações de repressão à produção não autorizada e ao tráfico ilícito de drogas, exclusivamente no interesse dessas atividades.", '');
            paragrafo = paragrafo.replace("§ 5º Excluídos os bens que se houver indicado para os fins previstos no § 4º deste artigo, o requerimento de alienação deverá conter a relação de todos os demais bens apreendidos, com a descrição e a especificação de cada um deles, e informações sobre quem os tem sob custódia e o local onde se encontram.", '');
            paragrafo = paragrafo.replace("§ 6º Requerida a alienação dos bens, a respectiva petição será autuada em apartado, cujos autos terão tramitação autônoma em relação aos da ação penal principal.", '');
            paragrafo = paragrafo.replace("§ 7º Autuado o requerimento de alienação, os autos serão conclusos ao juiz, que, verificada a presença de nexo de instrumentalidade entre o delito e os objetos utilizados para a sua prática e risco de perda de valor econômico pelo decurso do tempo, determinará a avaliação dos bens relacionados, cientificará a Senad e intimará a União, o Ministério Público e o interessado, este, se for o caso, por edital com prazo de 5 (cinco) dias.", '.');
            paragrafo = paragrafo.replace("§ 9º Realizado o leilão, permanecerá depositada em conta judicial a quantia apurada, até o final da ação penal respectiva, quando será transferida ao Funad, juntamente com os valores de que trata o § 3º deste artigo.", '');
            paragrafo = paragrafo.replace("§ 8º Feita a avaliação e dirimidas eventuais divergências sobre o respectivo laudo, o juiz, por sentença, homologará o valor atribuído aos bens e determinará sejam alienados em leilão.", '');
            paragrafo = paragrafo.replace("§ 10. Terão apenas efeito devolutivo os recursos interpostos contra as decisões proferidas no curso do procedimento previsto neste artigo.", '');
            paragrafo = paragrafo.replace("§ 11. Quanto aos bens indicados na forma do § 4º deste artigo, recaindo a autorização sobre veículos, embarcações ou aeronaves, o juiz ordenará à autoridade de trânsito ou ao equivalente órgão de registro e controle a expedição de certificado provisório de registro e licenciamento, em favor da autoridade de polícia judiciária ou órgão aos quais tenha deferido o uso, ficando estes livres do pagamento de multas, encargos e tributos anteriores, até o trânsito em julgado da decisão que decretar o seu perdimento em favor da União.", '');
            paragrafo = paragrafo.replace("§ 12. Na alienação de veículos, embarcações ou aeronaves, a autoridade de trânsito ou o órgão de registro equivalente procederá à regularização dos bens no prazo de trinta dias, de modo que o arrematante ficará livre do pagamento de multas, encargos e tributos anteriores, sem prejuízo de execução fiscal em relação ao antigo proprietário.             (Incluído pela Medida Provisória nº 885, de 2019)    § 13.  Na hipótese de que trata o § 12, a autoridade de trânsito ou o órgão de registro equivalente poderá emitir novos identificadores dos bens.             (Incluído pela Medida Provisória nº 885, de 2019)", '');
            paragrafo = paragrafo.replace("Art. 62-A.  O depósito, em dinheiro, de valores referentes ao produto da alienação ou relacionados a numerários apreendidos ou que tenham sido convertidos, serão efetuados na Caixa Econômica Federal, por meio de documento de arrecadação destinado a essa finalidade.             (Incluído pela Medida Provisória nº 885, de 2019)    § 1º  Os depósitos a que se refere o caput serão repassados pela Caixa Econômica Federal para a Conta Única do Tesouro Nacional, independentemente de qualquer formalidade, no prazo de vinte e quatro horas, contado do momento da realização do depósito.             (Incluído pela Medida Provisória nº 885, de 2019)    § 2º  Na hipótese de absolvição do acusado em decisão judicial, o valor do depósito será devolvido ao acusado pela Caixa Econômica Federal no prazo de até três dias úteis, acrescido de juros, na forma estabelecida pelo § 4º do art. 39 da Lei nº 9.250, de 26 de dezembro de 1995 .             (Incluído pela Medida Provisória nº 885, de 2019)    § 3º  Na hipótese de decretação do seu perdimento em favor da União, o valor do depósito será transformado em pagamento definitivo, respeitados os direitos de eventuais lesados e de terceiros de boa-fé.             (Incluído pela Medida Provisória nº 885, de 2019)    § 4º  Os valores devolvidos pela Caixa Econômica Federal, por decisão judicial, serão efetuados como anulação de receita do Fundo Nacional Antidrogas no exercício em que ocorrer a devolução.             (Incluído pela Medida Provisória nº 885, de 2019)    § 5º  A Caixa Econômica Federal manterá o controle dos valores depositados ou devolvidos.             (Incluído pela Medida Provisória nº 885, de 2019)", '');
            paragrafo = paragrafo.replace("Art. 63. Ao proferir a sentença de mérito, o juiz decidirá sobre o perdimento do produto, bem ou valor apreendido, seqüestrado ou declarado indisponível.", '');
            paragrafo = paragrafo.replace("§ 1º Os valores apreendidos em decorrência dos crimes tipificados nesta Lei e que não forem objeto de tutela cautelar, após decretado o seu perdimento em favor da União, serão revertidos diretamente ao Funad.", '');
            paragrafo = paragrafo.replace("§ 2º Compete à Senad a alienação dos bens apreendidos e não leiloados em caráter cautelar, cujo perdimento já tenha sido decretado em favor da União.", '');
            paragrafo = paragrafo.replace("§ 3º A Senad poderá firmar convênios de cooperação, a fim de dar imediato cumprimento ao estabelecido no § 2º deste artigo.             (Revogado pela Medida Provisória nº 885, de 2019)", '');
            paragrafo = paragrafo.replace("Art. 63-C.  Compete à Secretaria Nacional de Políticas sobre Drogas do Ministério da Justiça e Segurança Pública proceder à destinação dos bens apreendidos e não leiloados em caráter cautelar, cujo perdimento seja decretado em favor da União, por meio das seguintes modalidades:             (Incluído pela Medida Provisória nº 885, de 2019)    I - alienação, mediante:             (Incluído pela Medida Provisória nº 885, de 2019)    a) licitação;             (Incluído pela Medida Provisória nº 885, de 2019)    b) doação com encargo a entidades ou órgãos públicos que contribuam para o alcance das finalidades do Fundo Nacional Antidrogas; ou             (Incluído pela Medida Provisória nº 885, de 2019)    c) venda direta, observado o disposto no inciso II do caput do art. 24 da Lei nº 8.666, de 21 de junho de 1993 ;             (Incluído pela Medida Provisória nº 885, de 2019)    II - incorporação ao patrimônio de órgão da administração pública, observadas as finalidades do Fundo Nacional Antidrogas;             (Incluído pela Medida Provisória nº 885, de 2019)    III - destruição; ou             (Incluído pela Medida Provisória nº 885, de 2019)    IV - inutilização.             (Incluído pela Medida Provisória nº 885, de 2019)    § 1º  A alienação por meio de licitação será na modalidade leilão, para bens móveis e imóveis, independentemente do valor de avaliação, isolado ou global, de bem ou de lotes, assegurada a venda pelo maior lance, por preço que não seja inferior a cinquenta por cento do valor da avaliação.             (Incluído pela Medida Provisória nº 885, de 2019)    § 2º  O edital do leilão a que se refere o § 1º será amplamente divulgado em jornais de grande circulação e em sítios eletrônicos oficiais, principalmente no Município em que será realizado, dispensada a publicação em diário oficial.             (Incluído pela Medida Provisória nº 885, de 2019)    § 3º  Nas alienações realizadas por meio de sistema eletrônico da administração pública, a publicidade dada pelo sistema substituirá a publicação em diário oficial e em jornais de grande circulação.             (Incluído pela Medida Provisória nº 885, de 2019)    § 4º  Na alienação de veículos, embarcações ou aeronaves, a autoridade de trânsito ou o órgão de registro equivalente procederá à regularização dos bens no prazo de trinta dias, de modo que o arrematante ficará livre do pagamento de multas, encargos e tributos anteriores, sem prejuízo de execução fiscal em relação ao antigo proprietário.             (Incluído pela Medida Provisória nº 885, de 2019)    § 5º  Na hipótese do § 4º, a autoridade de trânsito ou o órgão de registro equivalente poderá emitir novos identificadores dos bens.             (Incluído pela Medida Provisória nº 885, de 2019)    § 6º  A Secretaria Nacional de Políticas sobre Drogas do Ministério da Justiça e Segurança Pública poderá celebrar convênios ou instrumentos congêneres com órgãos e entidades da União, dos Estados, do Distrito Federal ou dos Municípios, a fim de dar imediato cumprimento ao estabelecido neste artigo.             (Incluído pela Medida Provisória nº 885, de 2019)    § 7º  Observados os procedimentos licitatórios previstos em lei, fica autorizada a contratação da iniciativa privada para a execução das ações de avaliação, administração e alienação dos bens a que se refere esta Lei.             (Incluído pela Medida Provisória nº 885, de 2019)", '');
            paragrafo = paragrafo.replace("Art. 63-D.  Compete ao Ministério da Justiça e Segurança Pública regulamentar os procedimentos relativos à administração, à preservação e à destinação dos recursos provenientes de delitos e atos ilícitos e estabelecer os valores abaixo dos quais se deve proceder à sua destruição ou inutilização.             (Incluído pela Medida Provisória nº 885, de 2019)", '');
            paragrafo = paragrafo.replace("Art. 72. Sempre que conveniente ou necessário, o juiz, de ofício, mediante representação da autoridade de polícia judiciária, ou a requerimento do Ministério Público, determinará que se proceda, nos limites de sua jurisdição e na forma prevista no § 1º do art. 32 desta Lei, à destruição de drogas em processos já encerrados.", '');
            paragrafo = paragrafo.replace("Art. 72. Encerrado o processo penal ou arquivado o inquérito policial, o juiz, de ofício, mediante representação do delegado de polícia ou a requerimento do Ministério Público, determinará a destruição das amostras guardadas para contraprova, certificando isso nos autos.             (Redação dada pela Lei nº 12.961, de 2014)", '');
            paragrafo = paragrafo.replace("Art. 73. A União poderá celebrar convênios com os Estados visando à prevenção e repressão do tráfico ilícito e do uso indevido de drogas.", '');
            paragrafo = paragrafo.replace(`    * ""`,'');
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
    resultado = resultado.replace(/(LEI Nº 11.343, DE 23 DE AGOSTO DE 2006)/g, '<h6 class="leiClass">$1</h6></br>');
    resultado = resultado.replace(/(TÍTULO I  DISPOSIÇÕES PRELIMINARES)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO II  DO SIS TEMA NACIONAL DE POLÍTICAS PÚBLICAS SOBRE DROGAS)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  DOS PRINCÍPIOS E DOS OBJETIVOS DO SIS TEMA NACIONAL DE POLÍTICAS PÚBLICAS SOBRE DROGAS)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(DO SISTEMA NACIONAL DE POLÍTICAS PÚBLICAS SOBRE DROGAS    Seção I)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    Seção II    )/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    CAPÍTULO II-A    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    Seção I    )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    CAPÍTULO III  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO III  DAS ATIVIDADES DE PREVENÇÃO DO USO INDEVIDO, ATENÇÃO E REINSERÇÃO SOCIAL DE USUÁRIOS E DEPENDENTES DE DROGAS)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  DA PREVENÇÃO)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  DAS ATIVIDADES DE ATENÇÃO E DE REINSERÇÃO SOCIAL DE USUÁRIOS O U DEPENDENTES DE DROGAS)/g, '</br></br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV    )/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    Seção V    )/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VI    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IV  DA REPRESSÃO À PRODUÇÃO NÃO AUTORIZADA E AO TRÁFICO ILÍCITO DE DROGAS)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  DISPOSIÇÕES GERAIS)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  DOS CRIMES)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  DO PROCEDIMENTO PENAL)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Da Investigação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Da Instrução Criminal)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  DA APREENSÃO, ARRECADAÇÃO E DESTINAÇÃO DE BENS DO ACUSADO)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO V  DA COOPERAÇÃO INTERNACIONAL)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO V-A    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VI  DISPOSIÇÕES FINAIS E TRANSITÓRIAS)/g, '</br></br><h6 class="leiClass">$1</h6>');
    return resultado;
  }


}
