import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AdministrativoService } from 'src/app/service/administrativo.service';

@Component({
  selector: 'app-improbidade-administrativa',
  templateUrl: './improbidade-administrativa.component.html',
  styleUrls: ['./improbidade-administrativa.component.scss']
})
export class ImprobidadeAdministrativaComponent implements OnInit {
  paragrafos: string[] = [];
  termoPesquisa: string = '';
  ocorrencias: number[] = [];
  ocorrenciaAtual: number = -1;
  isSearchVisible = false;
  loading = false;
  private termoPesquisaSubject = new Subject<string>();
  private termoPesquisaDebounced = new Subject<string>();


  constructor(private apiService: AdministrativoService, private elementRef: ElementRef) { }


  onTermoPesquisaChange(termo: string) {
    this.termoPesquisaSubject.next(termo); // Envie o termo de pesquisa para o subject
  }
  
  ngOnInit(): void {
    this.loading = true;
    this.apiService.getAdminImprobidade().subscribe((data: any) => {
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
            paragrafo = paragrafo.replace("    Presidência da República  Casa Civil  Subchefia para Assuntos Jurídicos    ", '');// Remover texto dentro de parênteses
            paragrafo = paragrafo.replace("Texto compilado     (Vide ADI 7236)", '');
            paragrafo = paragrafo.replace(" Texto compilado   t Dispõe sobre as sanções aplicáveis aos agentes públicos nos casos de enriquecimento ilícito no exercício de mandato, cargo, emprego ou função na administração pública direta, indireta ou fundacional e dá outras providências.", '');
            paragrafo = paragrafo.replace("     t    ", ' ');
            paragrafo = paragrafo.replace("Art. 1° Os atos de improbidade praticados por qualquer agente público, servidor ou não, contra a administração direta, indireta ou fundacional de qualquer dos Poderes da União, dos Estados, do Distrito Federal, dos Municípios, de Território, de empresa incorporada ao patrimônio público ou de entidade para cuja criação ou custeio o erário haja concorrido ou concorra com mais de cinqüenta por cento do patrimônio ou da receita anual, serão punidos na forma desta lei.    Parágrafo único. Estão também sujeitos às penalidades desta lei os atos de improbidade praticados contra o patrimônio de entidade que receba subvenção, benefício ou incentivo, fiscal ou creditício, de órgão público bem como daquelas para cuja criação ou custeio o erário haja concorrido ou concorra com menos de cinqüenta por cento do patrimônio ou da receita anual, limitando-se, nestes casos, a sanção patrimonial à repercussão do ilícito sobre a contribuição dos cofres públicos.", ' ');
            paragrafo = paragrafo.replace("Art. 2° Reputa-se agente público, para os efeitos desta lei, todo aquele que exerce, ainda que transitoriamente ou sem remuneração, por eleição, nomeação, designação, contratação ou qualquer outra forma de investidura ou vínculo, mandato, cargo, emprego ou função nas entidades mencionadas no artigo anterior.", ' ');
            paragrafo = paragrafo.replace("Art. 3° As disposições desta lei são aplicáveis, no que couber, àquele que, mesmo não sendo agente público, induza ou concorra para a prática do ato de improbidade ou dele se beneficie sob qualquer forma direta ou indireta.", ' ');
            paragrafo = paragrafo.replace("Art. 4° Os agentes públicos de qualquer nível ou hierarquia são obrigados a velar pela estrita observância dos princípios de legalidade, impessoalidade, moralidade e publicidade no trato dos assuntos que lhe são afetos. (Revogado pela Lei nº 14.230, de 2021)", ' ');
            paragrafo = paragrafo.replace("     Art. 5° Ocorrendo lesão ao patrimônio público por ação ou omissão, dolosa ou culposa, do agente ou de terceiro, dar-se-á o integral ressarcimento do dano.        (Revogado pela Lei nº 14.230, de 2021)", ' ');
            paragrafo = paragrafo.replace("Art. 6° No caso de enriquecimento ilícito, perderá o agente público ou terceiro beneficiário os bens ou valores acrescidos ao seu patrimônio.         (Revogado pela Lei nº 14.230, de 2021)", ' ');
            paragrafo = paragrafo.replace("Art. 7° Quando o ato de improbidade causar lesão ao patrimônio público ou ensejar enriquecimento ilícito, caberá a autoridade administrativa responsável pelo inquérito representar ao Ministério Público, para a indisponibilidade dos bens do indiciado.    Parágrafo único. A indisponibilidade a que se refere o caput deste artigo recairá sobre bens que assegurem o integral ressarcimento do dano, ou sobre o acréscimo patrimonial resultante do enriquecimento ilícito.", ' ');
            paragrafo = paragrafo.replace(" Art. 8° O sucessor daquele que causar lesão ao patrimônio público ou se enriquecer ilicitamente está sujeito às cominações desta lei até o limite do valor da herança.", ' ');
            paragrafo = paragrafo.replace("Art. 9° Constitui ato de improbidade administrativa importando enriquecimento ilícito auferir qualquer tipo de vantagem patrimonial indevida em razão do exercício de cargo, mandato, função, emprego ou atividade nas entidades mencionadas no art. 1° desta lei, e notadamente:", ' ');
            paragrafo = paragrafo.replace("    IV - utilizar, em obra ou serviço particular, veículos, máquinas, equipamentos ou material de qualquer natureza, de propriedade ou à disposição de qualquer das entidades mencionadas no art. 1° desta lei, bem como o trabalho de servidores públicos, empregados ou terceiros contratados por essas entidades;    ", ' ');
            paragrafo = paragrafo.replace("VI - receber vantagem econômica de qualquer natureza, direta ou indireta, para fazer declaração falsa sobre medição ou avaliação em obras públicas ou qualquer outro serviço, ou sobre quantidade, peso, medida, qualidade ou característica de mercadorias ou bens fornecidos a qualquer das entidades mencionadas no art. 1º desta lei;", ' ');
            paragrafo = paragrafo.replace("VII - adquirir, para si ou para outrem, no exercício de mandato, cargo, emprego ou função pública, bens de qualquer natureza cujo valor seja desproporcional à evolução do patrimônio ou à renda do agente público", ' ');
            paragrafo = paragrafo.replace("Art. 10. Constitui ato de improbidade administrativa que causa lesão ao erário qualquer ação ou omissão, dolosa ou culposa, que enseje perda patrimonial, desvio, apropriação, malbaratamento ou dilapidação dos bens ou haveres das entidades referidas no art. 1º desta lei, e notadamente:", ' ');
            paragrafo = paragrafo.replace("I - facilitar ou concorrer por qualquer forma para a incorporação ao patrimônio particular, de pessoa física ou jurídica, de bens, rendas, verbas ou valores integrantes do acervo patrimonial das entidades mencionadas no art. 1º desta lei;    ", ' ');
            paragrafo = paragrafo.replace("VIII - frustrar a licitude de processo licitatório ou dispensá-lo indevidamente    VIII - frustrar a licitude de processo licitatório ou de processo seletivo para celebração de parcerias com entidades sem fins lucrativos, ou dispensá-los indevidamente;          (Redação dada pela Lei nº 13.019, de 2014)     (Vigência)    ", ' ');
            paragrafo = paragrafo.replace("X - agir negligentemente na arrecadação de tributo ou renda, bem como no que diz respeito à conservação do patrimônio público;    ", ' ');
            paragrafo = paragrafo.replace("XIX - frustrar a licitude de processo seletivo para celebração de parcerias da administração pública com entidades privadas ou dispensá-lo indevidamente;    (Incluído pela Lei nº 13.019, de 2014)     (Vigência)    XIX - agir negligentemente na celebração, fiscalização e análise das prestações de contas de parcerias firmadas pela administração pública com entidades privadas;       (Incluído pela Lei nº 13.019, de 2014, com a redação dada pela Lei nº 13.204, de 2015)     ", ' ');
            paragrafo = paragrafo.replace("XX - agir negligentemente na celebração, fiscalização e análise das prestações de contas de parcerias firmadas pela administração pública com entidades privadas;   (Incluído pela Lei nº 13.019, de 2014)     (Vigência)    ", ' ');
            paragrafo = paragrafo.replace("XXI - liberar recursos de parcerias firmadas pela administração pública com entidades privadas sem a estrita observância das normas pertinentes ou influir de qualquer forma para a sua aplicação irregular.   (Incluído pela Lei nº 13.019, de 2014)     (Vigência)    ", ' ');
            paragrafo = paragrafo.replace("Seção II-A    Dos Atos de Improbidade Administrativa Decorrentes de Concessão ou Aplicação Indevida de Benefício Financeiro ou Tributário    (Incluído pela Lei Complementar nº 157, de 2016)  (Produção de efeito)      (Revogado pela Lei nº 14.230, de 2021)", ' ');
            paragrafo = paragrafo.replace("Art. 10-A.  Constitui ato de improbidade administrativa qualquer ação ou omissão para conceder, aplicar ou manter benefício financeiro ou tributário contrário ao que dispõem o caput e o § 1º do art. 8º-A da Lei Complementar nº 116, de 31 de julho de 2003.  (Incluído pela Lei Complementar nº 157, de 2016)  (Produção de efeito)        (Revogado pela Lei nº 14.230, de 2021)    ", ' ');
            paragrafo = paragrafo.replace("Art. 11. Constitui ato de improbidade administrativa que atenta contra os princípios da administração pública qualquer ação ou omissão que viole os deveres de honestidade, imparcialidade, legalidade, e lealdade às instituições, e notadamente:", ' ');
            paragrafo = paragrafo.replace("I - praticar ato visando fim proibido em lei ou regulamento ou diverso daquele previsto, na regra de competência;    ", ' ');
            paragrafo = paragrafo.replace("II - retardar ou deixar de praticar, indevidamente, ato de ofício;    ", ' ');
            paragrafo = paragrafo.replace("III - revelar fato ou circunstância de que tem ciência em razão das atribuições e que deva permanecer em segredo;    ", ' ');
            paragrafo = paragrafo.replace("IV - negar publicidade aos atos oficiais;    ", ' ');
            paragrafo = paragrafo.replace("V - frustrar a licitude de concurso público;    ", ' ');
            paragrafo = paragrafo.replace("VI - deixar de prestar contas quando esteja obrigado a fazê-lo;", ' ');
            paragrafo = paragrafo.replace("    (Vide Medida Provisória nº 2.088-35, de 2000)       ", ' ');
            paragrafo = paragrafo.replace("IX - deixar de cumprir a exigência de requisitos de acessibilidade previstos na legislação.         (Incluído pela Lei nº 13.146, de 2015)       (Vigência)    ", ' ');
            paragrafo = paragrafo.replace("X - transferir recurso a entidade privada, em razão da prestação de serviços na área de saúde sem a prévia celebração de contrato, convênio ou instrumento congênere, nos termos do parágrafo único do art. 24 da Lei nº 8.080, de 19 de setembro de 1990.               (Incluído pela Lei nº 13.650, de 2018)    ", ' ');
            paragrafo = paragrafo.replace("Art. 12. Independentemente das sanções penais, civis e administrativas, previstas na legislação específica, está o responsável pelo ato de improbidade sujeito às seguintes cominações:", ' ');
            paragrafo = paragrafo.replace("Art. 12.  Independentemente das sanções penais, civis e administrativas previstas na legislação específica, está o responsável pelo ato de improbidade sujeito às seguintes cominações, que podem ser aplicadas isolada ou cumulativamente, de acordo com a gravidade do fato:         (Redação dada pela Lei nº 12.120, de 2009).    I - na hipótese do art. 9°, perda dos bens ou valores acrescidos ilicitamente ao patrimônio, ressarcimento integral do dano, quando houver, perda da função pública, suspensão dos direitos políticos de oito a dez anos, pagamento de multa civil de até três vezes o valor do acréscimo patrimonial e proibição de contratar com o Poder Público ou receber benefícios ou incentivos fiscais ou creditícios, direta ou indiretamente, ainda que por intermédio de pessoa jurídica da qual seja sócio majoritário, pelo prazo de dez anos;    II - na hipótese do art. 10, ressarcimento integral do dano, perda dos bens ou valores acrescidos ilicitamente ao patrimônio, se concorrer esta circunstância, perda da função pública, suspensão dos direitos políticos de cinco a oito anos, pagamento de multa civil de até duas vezes o valor do dano e proibição de contratar com o Poder Público ou receber benefícios ou incentivos fiscais ou creditícios, direta ou indiretamente, ainda que por intermédio de pessoa jurídica da qual seja sócio majoritário, pelo prazo de cinco anos;    III - na hipótese do art. 11, ressarcimento integral do dano, se houver, perda da função pública, suspensão dos direitos políticos de três a cinco anos, pagamento de multa civil de até cem vezes o valor da remuneração percebida pelo agente e proibição de contratar com o Poder Público ou receber benefícios ou incentivos fiscais ou creditícios, direta ou indiretamente, ainda que por intermédio de pessoa jurídica da qual seja sócio majoritário, pelo prazo de três anos.    IV - na hipótese prevista no art. 10-A, perda da função pública, suspensão dos direitos políticos de 5 (cinco) a 8 (oito) anos e multa civil de até 3 (três) vezes o valor do benefício financeiro ou tributário concedido. (Incluído pela Lei Complementar nº 157, de 2016)    Parágrafo único. Na fixação das penas previstas nesta lei o juiz levará em conta a extensão do dano causado, assim como o proveito patrimonial obtido pelo agente.", ' ');
            paragrafo = paragrafo.replace("Art. 13. A posse e o exercício de agente público ficam condicionados à apresentação de declaração dos bens e valores que compõem o seu patrimônio privado, a fim de ser arquivada no serviço de pessoal competente. (Regulamento)    (Regulamento)    § 1° A declaração compreenderá imóveis, móveis, semoventes, dinheiro, títulos, ações, e qualquer outra espécie de bens e valores patrimoniais, localizado no País ou no exterior, e, quando for o caso, abrangerá os bens e valores patrimoniais do cônjuge ou companheiro, dos filhos e de outras pessoas que vivam sob a dependência econômica do declarante, excluídos apenas os objetos e utensílios de uso doméstico.    § 2º A declaração de bens será anualmente atualizada e na data em que o agente público deixar o exercício do mandato, cargo, emprego ou função.    § 3º Será punido com a pena de demissão, a bem do serviço público, sem prejuízo de outras sanções cabíveis, o agente público que se recusar a prestar declaração dos bens, dentro do prazo determinado, ou que a prestar falsa.    § 4º O declarante, a seu critério, poderá entregar cópia da declaração anual de bens apresentada à Delegacia da Receita Federal na conformidade da legislação do Imposto sobre a Renda e proventos de qualquer natureza, com as necessárias atualizações, para suprir a exigência contida no caput e no § 2° deste artigo .", ' ');
            paragrafo = paragrafo.replace("§ 3º Atendidos os requisitos da representação, a autoridade determinará a imediata apuração dos fatos que, em se tratando de servidores federais, será processada na forma prevista nos arts. 148 a 182 da Lei nº 8.112, de 11 de dezembro de 1990 e, em se tratando de servidor militar, de acordo com os respectivos regulamentos disciplinares.    ", ' ');
            paragrafo = paragrafo.replace("Art. 16. Havendo fundados indícios de responsabilidade, a comissão representará ao Ministério Público ou à procuradoria do órgão para que requeira ao juízo competente a decretação do seqüestro dos bens do agente ou terceiro que tenha enriquecido ilicitamente ou causado dano ao patrimônio público.    § 1º O pedido de seqüestro será processado de acordo com o disposto nos arts. 822 e 825 do Código de Processo Civil.    § 2° Quando for o caso, o pedido incluirá a investigação, o exame e o bloqueio de bens, contas bancárias e aplicações financeiras mantidas pelo indiciado no exterior, nos termos da lei e dos tratados internacionais.", ' ');
            paragrafo = paragrafo.replace("Art. 17. A ação principal, que terá o rito ordinário, será proposta pelo Ministério Público ou pela pessoa jurídica interessada, dentro de trinta dias da efetivação da medida cautelar.    § 1º É vedada a transação, acordo ou conciliação nas ações de que trata o caput.         (Revogado pela Medida provisória nº 703, de 2015)       (Vigência encerrada)    § 1º É vedada a transação, acordo ou conciliação nas ações de que trata o caput.    § 1º As ações de que trata este artigo admitem a celebração de acordo de não persecução cível, nos termos desta Lei.      (Redação dada pela Lei nº 13.964, de 2019)    § 2º A Fazenda Pública, quando for o caso, promoverá as ações necessárias à complementação do ressarcimento do patrimônio público.    § 3º No caso da ação principal ter sido proposta pelo Ministério Público, a pessoa jurídica interessada integrará a lide na qualidade de litisconsorte, devendo suprir as omissões e falhas da inicial e apresentar ou indicar os meios de prova de que disponha.    § 3o  No caso de a ação principal ter sido proposta pelo Ministério Público, aplica-se, no que couber, o disposto no § 3o do art. 6o da Lei no 4.717, de 29 de junho de 1965.    (Redação dada pela Medida Provisória nº 1.337, de 1996)       (Redação dada pela Medida Provisória nº 1.472-31, de 1996)    § 3o  No caso de a ação principal ter sido proposta pelo Ministério Público, aplica-se, no que couber, o disposto no § 3o do art. 6o da Lei no 4.717, de 29 de junho de 1965.         (Redação dada pela Lei nº 9.366, de 1996)    § 4º O Ministério Público, se não intervir no processo como parte, atuará obrigatoriamente, como fiscal da lei, sob pena de nulidade.    § 5o  A propositura da ação prevenirá a jurisdição do juízo para todas as ações posteriormente intentadas que possuam a mesma causa de pedir ou o mesmo objeto. (Incluído pela Medida provisória nº 1.984-16, de 2000)       (Incluído pela Medida provisória nº 2.180-35, de 2001)    § 6o  A ação será instruída com documentos ou justificação que contenham indícios suficientes da existência do ato de improbidade ou com razões fundamentadas da impossibilidade de apresentação de qualquer dessas provas, observada a legislação vigente, inclusive as disposições inscritas nos arts. 16 a 18 do Código de Processo Civil.  (Vide Medida Provisória nº 2.088-35, de 2000)      (Incluído pela Medida Provisória nº 2.225-45, de 2001)    § 7o  Estando a inicial em devida forma, o juiz mandará autuá-la e ordenará a notificação do requerido, para oferecer manifestação por escrito, que poderá ser instruída com documentos e justificações, dentro do prazo de quinze dias.  (Vide Medida Provisória nº 2.088-35, de 2000)        (Incluído pela Medida Provisória nº 2.225-45, de 2001)    § 8o  Recebida a manifestação, o juiz, no prazo de trinta dias, em decisão fundamentada, rejeitará a ação, se convencido da inexistência do ato de improbidade, da improcedência da ação ou da inadequação da via eleita.  (Vide Medida Provisória nº 2.088-35, de 2000)  (Incluído pela Medida Provisória nº 2.225-45, de 2001)    § 9o  Recebida a petição inicial, será o réu citado para apresentar contestação.   (Vide Medida Provisória nº 2.088-35, de 2000)    (Incluído pela Medida Provisória nº 2.225-45, de 2001)    § 10.  Da decisão que receber a petição inicial, caberá agravo de instrumento.   (Vide Medida Provisória nº 2.088-35, de 2000)      (Incluído pela Medida Provisória nº 2.225-45, de 2001)", ' ');
            paragrafo = paragrafo.replace("§ 11.  Em qualquer fase do processo, reconhecida a inadequação da ação de improbidade, o juiz extinguirá o processo sem julgamento do mérito.  (Vide Medida Provisória nº 2.088-35, de 2000)        (Incluído pela Medida Provisória nº 2.225-45, de 2001)    ", ' ');
            paragrafo = paragrafo.replace("§ 12.  Aplica-se aos depoimentos ou inquirições realizadas nos processos regidos por esta Lei o disposto no art. 221, caput e § 1o, do Código de Processo Penal.    (Vide Medida Provisória nº 2.088-35, de 2000)    (Incluído pela Medida Provisória nº 2.225-45, de 2001)    ", ' ');
            paragrafo = paragrafo.replace("§ 13.  Para os efeitos deste artigo, também se considera pessoa jurídica interessada o ente tributante que figurar no polo ativo da obrigação tributária de que tratam o § 4º do art. 3º e o art. 8º-A da Lei Complementar nº 116, de 31 de julho de 2003.        (Incluído pela Lei Complementar nº 157, de 2016)    ", ' ');
            paragrafo = paragrafo.replace("Art. 18. A sentença que julgar procedente ação civil de reparação de dano ou decretar a perda dos bens havidos ilicitamente determinará o pagamento ou a reversão dos bens, conforme o caso, em favor da pessoa jurídica prejudicada pelo ilícito.", ' ');
            paragrafo = paragrafo.replace("Parágrafo único. A autoridade judicial ou administrativa competente poderá determinar o afastamento do agente público do exercício do cargo, emprego ou função, sem prejuízo da remuneração, quando a medida se fizer necessária à instrução processual.    ", ' ');
            paragrafo = paragrafo.replace("I - da efetiva ocorrência de dano ao patrimônio público;    I - da efetiva ocorrência de dano ao patrimônio público, salvo quanto à pena de ressarcimento;         (Redação dada pela Lei nº 12.120, de 2009).    ", ' ');
            paragrafo = paragrafo.replace("Art. 22. Para apurar qualquer ilícito previsto nesta lei, o Ministério Público, de ofício, a requerimento de autoridade administrativa ou mediante representação formulada de acordo com o disposto no art. 14, poderá requisitar a instauração de inquérito policial ou procedimento administrativo.", ' ');
            paragrafo = paragrafo.replace("Art. 23. As ações destinadas a levar a efeitos as sanções previstas nesta lei podem ser propostas:    I - até cinco anos após o término do exercício de mandato, de cargo em comissão ou de função de confiança;    II - dentro do prazo prescricional previsto em lei específica para faltas disciplinares puníveis com demissão a bem do serviço público, nos casos de exercício de cargo efetivo ou emprego.    III - até cinco anos da data da apresentação à administração pública da prestação de contas final pelas entidades referidas no parágrafo único do art. 1o desta Lei.         (Incluído pela Lei nº 13.019, de 2014)       (Vigência)", ' ');
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
    resultado = resultado.replace(/(LEI Nº 8.429, DE 2 DE JUNHO DE 1992)/g, '<h6 class="leiClass">$1</h6><br>');
    resultado = resultado.replace(/(CAPÍTULO I  Das Disposições Gerais)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Dos Atos de Improbidade Administrativa)/g, '<br><br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Dos Atos de Improbidade Administrativa que Importam Enriquecimento Ilícito)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Dos Atos de Improbidade Administrativa que Causam Prejuízo ao Erário)/g, '<br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Dos Atos de Improbidade Administrativa que Atentam Contra os Princípios da Administração Pública)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Das Penas)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Da Declaração de Bens)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Do Procedimento Administrativo e do Processo Judicial)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  Das Disposições Penais)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII  Da Prescrição)/g, '</br></br><h6 class="leiClass">$1</h6>');
    return resultado;
  }
}
