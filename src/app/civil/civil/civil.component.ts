import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, skip, tap } from 'rxjs/operators';
import { CivilService } from 'src/app/service/civil.service';

@Component({
  selector: 'app-civil',
  templateUrl: './civil.component.html',
  styleUrls: ['./civil.component.scss']
})
export class CivilComponent implements OnInit {
  paragrafos: string[] = [];
  termoPesquisa: string = '';
  ocorrencias: number[] = [];
  ocorrenciaAtual: number = -1;
  isSearchVisible = false;
  loading = false;
  private termoPesquisaSubject = new Subject<string>();
  private termoPesquisaDebounced = new Subject<string>();


  constructor(private apiService: CivilService, private elementRef: ElementRef) { }


  onTermoPesquisaChange(termo: string) {
    this.termoPesquisaSubject.next(termo); // Envie o termo de pesquisa para o subject
  }

  ngOnInit(): void {
    this.loading = true;
    this.apiService.getTexto().subscribe((data: any) => {
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
            paragrafo = paragrafo.replace("    Presidência da República  Casa Civil  Subchefia para Assuntos Jurídicos", '');// Remover texto dentro de parênteses
            paragrafo = paragrafo.replace("     t    ", ' ');
            paragrafo = paragrafo.replace("    Texto compilado    ", '');
            paragrafo = paragrafo.replace("   ÍNDICE    Vigência", '');
            paragrafo = paragrafo.replace("   Vigência ", '.');
            paragrafo = paragrafo.replace("P A R T E    G E R A L    LIVRO I  DAS PESSOAS", '<h6 class="leiClass"></br>PARTE GERAL, LIVRO I  DAS PESSOAS</h6>');
            paragrafo = paragrafo.replace("SUBTÍTULO II  Da Sociedade Personificada", 'SUBTÍTULO II Da Sociedade Personificada');
            paragrafo = paragrafo.replace("CAPÍTULO I  Da Tutela    Seção I  Dos Tutores", '</br></br><h6 class="leiClass">CAPÍTULO I Da Tutela Seção I Dos Tutores</h6>');
            paragrafo = paragrafo.replace("CAPÍTULO II  Da Curatela    Seção I  Dos Interditos", '</br><h6 class="leiClass">CAPÍTULO II Da Curatela, Seção I Dos Interditos</h6>');
            paragrafo = paragrafo.replace(`FERNANDO HENRIQUE CARDOSO  Aloysio Nunes Ferreira Filho    Este texto não substitui o publicado no DOU de 11.1.2002    ÍNDICE    P A R T E G E R A L  LIVRO I DAS PESSOAS  TÍTULO I DAS PESSOAS NATURAIS  CAPÍTULO I DA PERSONALIDADE E DA CAPACIDADE  CAPÍTULO II DOS DIREITOS DA PERSONALIDADE  CAPÍTULO III DA AUSÊNCIA  Seção I Da Curadoria dos Bens do Ausente  Seção II Da Sucessão Provisória  Seção III Da Sucessão Definitiva  TÍTULO II DAS PESSOAS JURÍDICAS  CAPÍTULO I DISPOSIÇÕES GERAIS  CAPÍTULO II DAS ASSOCIAÇÕES  CAPÍTULO III DAS FUNDAÇÕES  TÍTULO III Do Domicílio  LIVRO II DOS BENS  TÍTULO ÚNICO DAS DIFERENTES CLASSES DE BENS  CAPÍTULO I DOS BENS CONSIDERADOS EM SI MESMOS  Seção I Dos Bens Imóveis  Seção II Dos Bens Móveis  Seção III Dos Bens Fungíveis e Consumíveis  Seção IV Dos Bens Divisíveis  Seção V Dos Bens Singulares e Coletivos  CAPÍTULO II DOS BENS RECIPROCAMENTE CONSIDERADOS  CAPÍTULO III DOS BENS PÚBLICOS  LIVRO III DOS FATOS JURÍDICOS  TÍTULO I DO NEGÓCIO JURÍDICO  CAPÍTULO I DISPOSIÇÕES GERAIS  CAPÍTULO II DA REPRESENTAÇÃO  CAPÍTULO III DA CONDIÇÃO, DO TERMO E DO ENCARGO  CAPÍTULO IV DOS DEFEITOS DO NEGÓCIO JURÍDICO  Seção I Do Erro ou Ignorância  Seção II Do Dolo  Seção III Da Coação  Seção IV Do Estado de Perigo  Seção V Da Lesão  Seção VI Da Fraude Contra Credores  CAPÍTULO V DA INVALIDADE DO NEGÓCIO JURÍDICO  TÍTULO II DOS ATOS JURÍDICOS LÍCITOS  TÍTULO III DOS ATOS ILÍCITOS  TÍTULO IV DA PRESCRIÇÃO E DA DECADÊNCIA  CAPÍTULO I DA PRESCRIÇÃO  Seção I Disposições Gerais  Seção II Das Causas que Impedem ou Suspendem a Prescrição  Seção III Das Causas que Interrompem a Prescrição  Seção IV Dos Prazos da Prescrição  CAPÍTULO II DA DECADÊNCIA  TÍTULO V DA PROVA  P A R T E    E S P E C I A L  LIVRO I DO DIREITO DAS OBRIGAÇÕES  TÍTULO I DAS MODALIDADES DAS OBRIGAÇÕES  CAPÍTULO I DAS OBRIGAÇÕES DE DAR  Seção I Das Obrigações de Dar Coisa Certa  Seção II Das Obrigações de Dar Coisa Incerta  CAPÍTULO II DAS OBRIGAÇÕES DE FAZER  CAPÍTULO III DAS OBRIGAÇÕES DE NÃO FAZER  CAPÍTULO IV DAS OBRIGAÇÕES ALTERNATIVAS  CAPÍTULO V DAS OBRIGAÇÕES DIVISÍVEIS E INDIVISÍVEIS  CAPÍTULO VI DAS OBRIGAÇÕES SOLIDÁRIAS  Seção I Disposições Gerais  Seção II Da Solidariedade Ativa  Seção III Da Solidariedade Passiva  TÍTULO II DA TRANSMISSÃO DAS OBRIGAÇÕES  CAPÍTULO I DA CESSÃO DE CRÉDITO  CAPÍTULO II DA ASSUNÇÃO DE DÍVIDA  TÍTULO III DO ADIMPLEMENTO E EXTINÇÃO DAS OBRIGAÇÕES  CAPÍTULO I DO PAGAMENTO  Seção I De Quem Deve Pagar  Seção II Daqueles a Quem se Deve Pagar  Seção III Do Objeto do Pagamento e Sua Prova  Seção IV Do Lugar do Pagamento  Seção V Do Tempo do Pagamento  CAPÍTULO II DO PAGAMENTO EM CONSIGNAÇÃO  CAPÍTULO III DO PAGAMENTO COM SUB-ROGAÇÃO  CAPÍTULO IV DA IMPUTAÇÃO DO PAGAMENTO  CAPÍTULO V DA DAÇÃO EM PAGAMENTO  CAPÍTULO VI DA NOVAÇÃO  CAPÍTULO VII DA COMPENSAÇÃO  CAPÍTULO VIII DA CONFUSÃO  CAPÍTULO IX DA REMISSÃO DAS DÍVIDAS  TÍTULO IV DO INADIMPLEMENTO DAS OBRIGAÇÕES  CAPÍTULO I DISPOSIÇÕES GERAIS  CAPÍTULO II DA MORA  CAPÍTULO III DAS PERDAS E DANOS  CAPÍTULO IV DOS JUROS LEGAIS  CAPÍTULO V DA CLÁUSULA PENAL  CAPÍTULO VI DAS ARRAS OU SINAL  TÍTULO V DOS CONTRATOS EM GERAL  CAPÍTULO I DISPOSIÇÕES GERAIS  Seção I Preliminares  Seção II Da Formação dos Contratos  Seção III Da Estipulação em Favor de Terceiro  Seção IV Da Promessa de Fato de Terceiro  Seção V Dos Vícios Redibitórios  Seção VI Da Evicção  Seção VII Dos Contratos Aleatórios  Seção VIII Do Contrato Preliminar  Seção IX Do Contrato com Pessoa a Declarar  CAPÍTULO II DA EXTINÇÃO DO CONTRATO  Seção I Do Distrato  Seção II Da Cláusula Resolutiva  Seção III Da Exceção de Contrato não Cumprido  Seção IV Da Resolução por Onerosidade Excessiva  TÍTULO VI DAS VÁRIAS ESPÉCIES DE CONTRATO  CAPÍTULO I DA COMPRA E VENDA  Seção I Disposições Gerais  Seção II Das Cláusulas Especiais à Compra e Venda  Subseção I Da Retrovenda  Subseção II Da Venda a Contento e da Sujeita a Prova  Subseção III Da Preempção ou Preferência  Subseção IV Da Venda com Reserva de Domínio  Subseção V Da Venda Sobre Documentos  CAPÍTULO II DA TROCA OU PERMUTA  CAPÍTULO III DO CONTRATO ESTIMATÓRIO  CAPÍTULO IV DA DOAÇÃO  Seção I Disposições Gerais  Seção II Da Revogação da Doação  CAPÍTULO V DA LOCAÇÃO DE COISAS  CAPÍTULO VI DO EMPRÉSTIMO  Seção I Do Comodato  Seção II Do Mútuo  CAPÍTULO VII DA PRESTAÇÃO DE SERVIÇO  CAPÍTULO VIII DA EMPREITADA  CAPÍTULO IX DO DEPÓSITO  Seção I Do Depósito Voluntário  Seção II Do Depósito Necessário  CAPÍTULO X DO MANDATO  Seção I Disposições Gerais  Seção II Das Obrigações do Mandatário  Seção III Das Obrigações do Mandante  Seção IV Da Extinção do Mandato  Seção V Do Mandato Judicial  CAPÍTULO XI DA COMISSÃO  CAPÍTULO XII DA AGÊNCIA E DISTRIBUIÇÃO  CAPÍTULO XIII DA CORRETAGEM  CAPÍTULO XIV DO TRANSPORTE  Seção I Disposições Gerais  Seção II Do Transporte de Pessoas  Seção III Do Transporte de Coisas  CAPÍTULO XV DO SEGURO  Seção I Disposições Gerais  Seção II Do Seguro de Dano  Seção III Do Seguro de Pessoa  CAPÍTULO XVI DA CONSTITUIÇÃO DE RENDA  CAPÍTULO XVII DO JOGO E DA APOSTA  CAPÍTULO XVIII DA FIANÇA  Seção I Disposições Gerais  Seção II Dos Efeitos da Fiança  Seção III Da Extinção da Fiança  CAPÍTULO XIX DA TRANSAÇÃO  CAPÍTULO XX DO COMPROMISSO  TÍTULO VII DOS ATOS UNILATERAIS  CAPÍTULO I DA PROMESSA DE RECOMPENSA  CAPÍTULO II DA GESTÃO DE NEGÓCIOS  CAPÍTULO III DO PAGAMENTO INDEVIDO  CAPÍTULO IV DO ENRIQUECIMENTO SEM CAUSA  TÍTULO VIII DOS TÍTULOS DE CRÉDITO  CAPÍTULO I DISPOSIÇÕES GERAIS  CAPÍTULO II DO TÍTULO AO PORTADOR  CAPÍTULO III DO TÍTULO À ORDEM  CAPÍTULO IV DO TÍTULO NOMINATIVO  TÍTULO IX DA RESPONSABILIDADE CIVIL  CAPÍTULO I DA OBRIGAÇÃO DE INDENIZAR  CAPÍTULO II DA INDENIZAÇÃO  TÍTULO X DAS PREFERÊNCIAS E PRIVILÉGIOS CREDITÓRIOS  LIVRO II DO DIREITO DE EMPRESA  TÍTULO I DO EMPRESÁRIO  CAPÍTULO I DA CARACTERIZAÇÃO E DA INSCRIÇÃO  CAPÍTULO II DA CAPACIDADE  TÍTULO II DA SOCIEDADE  CAPÍTULO ÚNICO DISPOSIÇÕES GERAIS  SUBTÍTULO I DA SOCIEDADE NÃO PERSONIFICADA  CAPÍTULO I DA SOCIEDADE EM COMUM  CAPÍTULO II DA SOCIEDADE EM CONTA DE PARTICIPAÇÃO  SUBTÍTULO II DA SOCIEDADE PERSONIFICADA  CAPÍTULO I DA SOCIEDADE SIMPLES  Seção I Do Contrato Social  Seção II Dos Direitos e Obrigações dos Sócios  Seção III Da Administração  Seção IV Das Relações com Terceiros  Seção V Da Resolução da Sociedade em Relação a um Sócio  Seção VI Da Dissolução  CAPÍTULO II DA SOCIEDADE EM NOME COLETIVO  CAPÍTULO III DA SOCIEDADE EM COMANDITA SIMPLES  CAPÍTULO IV DA SOCIEDADE LIMITADA  Seção I Disposições Preliminares  Seção II Das Quotas  Seção III Da Administração  Seção IV Do Conselho Fiscal  Seção V Das Deliberações dos Sócios  Seção VI Do Aumento e da Redução do Capital  Seção VII Da Resolução da Sociedade em Relação a Sócios Minoritários  Seção VIII Da Dissolução  CAPÍTULO V DA SOCIEDADE ANÔNIMA  Seção Única Da Caracterização  CAPÍTULO VI DA SOCIEDADE EM COMANDITA POR AÇÕES  CAPÍTULO VII DA SOCIEDADE COOPERATIVA  CAPÍTULO VIII DAS SOCIEDADES COLIGADAS  CAPÍTULO IX DA LIQUIDAÇÃO DA SOCIEDADE  CAPÍTULO X DA TRANSFORMAÇÃO, DA INCORPORAÇÃO, DA FUSÃO E DA CISÃO DAS SOCIEDADES  CAPÍTULO XI DA SOCIEDADE DEPENDENTE DE AUTORIZAÇÃO  Seção I Disposições Gerais  Seção II Da Sociedade Nacional  Seção III Da Sociedade Estrangeira  TÍTULO III DO ESTABELECIMENTO  CAPÍTULO ÚNICO DISPOSIÇÕES GERAIS  TÍTULO IV DOS INSTITUTOS COMPLEMENTARES  CAPÍTULO I DO REGISTRO  CAPÍTULO II DO NOME EMPRESARIAL  CAPÍTULO III DOS PREPOSTOS  Seção I Disposições Gerais  Seção II Do Gerente  Seção III Do Contabilista e outros Auxiliares  CAPÍTULO IV DA ESCRITURAÇÃO  LIVRO III DO DIREITO DAS COISAS  TÍTULO I DA POSSE  CAPÍTULO I DA POSSE E SUA CLASSIFICAÇÃO  CAPÍTULO II DA AQUISIÇÃO DA POSSE  CAPÍTULO III DOS EFEITOS DA POSSE  CAPÍTULO IV DA PERDA DA POSSE  TÍTULO II DOS DIREITOS REAIS  CAPÍTULO ÚNICO DISPOSIÇÕES GERAIS  TÍTULO III DA PROPRIEDADE  CAPÍTULO I DA PROPRIEDADE EM GERAL  Seção I Disposições Preliminares  Seção II Da Descoberta  CAPÍTULO II DA AQUISIÇÃO DA PROPRIEDADE IMÓVEL  Seção I Da Usucapião  Seção II Da Aquisição pelo Registro do Título  Seção III Da Aquisição por Acessão  Subseção I Das Ilhas  Subseção II Da Aluvião  Subseção III Da Avulsão  Subseção IV Do Álveo Abandonado  Subseção V Das Construções e Plantações  CAPÍTULO III DA AQUISIÇÃO DA PROPRIEDADE MÓVEL  Seção I Da Usucapião  Seção II Da Ocupação  >Seção III Do Achado do Tesouro  Seção IV Da Tradição  Seção V Da Especificação  Seção VI Da Confusão, da Comissão e da Adjunção  CAPÍTULO IV DA PERDA DA PROPRIEDADE  CAPÍTULO V DOS DIREITOS DE VIZINHANÇA  Seção I Do Uso Anormal da Propriedade  Seção II Das Árvores Limítrofes  Seção III Da Passagem Forçada  Seção IV Da Passagem de Cabos e Tubulações  Seção V Das Águas  Seção VI Dos Limites entre Prédios e do Direito de Tapagem  Seção VII Do Direito de Construir  CAPÍTULO VI DO CONDOMÍNIO GERAL  Seção I Do Condomínio Voluntário  Subseção I Dos Direitos e Deveres dos Condôminos  Subseção II Da Administração do Condomínio  Seção II Do Condomínio Necessário  CAPÍTULO VII DO CONDOMÍNIO EDILÍCIO  Seção I Disposições Gerais  Seção II Da Administração do Condomínio  Seção III Da Extinção do Condomínio  CAPÍTULO VIII DA PROPRIEDADE RESOLÚVEL  CAPÍTULO IX DA PROPRIEDADE FIDUCIÁRIA  TÍTULO IV DA SUPERFÍCIE  TÍTULO V DAS SERVIDÕES  CAPÍTULO I DA CONSTITUIÇÃO DAS SERVIDÕES  CAPÍTULO II DO EXERCÍCIO DAS SERVIDÕES  CAPÍTULO III DA EXTINÇÃO DAS SERVIDÕES  TÍTULO VI DO USUFRUTO  CAPÍTULO I DISPOSIÇÕES GERAIS  CAPÍTULO II DOS DIREITOS DO USUFRUTUÁRIO  CAPÍTULO III DOS DEVERES DO USUFRUTUÁRIO  CAPÍTULO IV DA EXTINÇÃO DO USUFRUTO  TÍTULO VII DO USO  TÍTULO VIII DA HABITAÇÃO  TÍTULO IX DO DIREITO DO PROMITENTE COMPRADOR  TÍTULO X DO PENHOR, DA HIPOTECA E DA ANTICRESE  CAPÍTULO I DISPOSIÇÕES GERAIS  CAPÍTULO II DO PENHOR  Seção I Da Constituição do Penhor  Seção II Dos Direitos do Credor Pignoratício  Seção III Das Obrigações do Credor Pignoratício  Seção IV Da Extinção do Penhor  Seção V Do Penhor Rural  Subseção I Disposições Gerais  Subseção II Do Penhor Agrícola  Subseção III Do Penhor Pecuário  Seção VI Do Penhor Industrial e Mercantil  Seção VII Do Penhor de Direitos e Títulos de Crédito  Seção VIII Do Penhor de Veículos  Seção IX Do Penhor Legal  CAPÍTULO III DA HIPOTECA  Seção I Disposições Gerais  Seção II Da Hipoteca Legal  Seção III Do Registro da Hipoteca  Seção IV Da Extinção da Hipoteca  Seção V Da Hipoteca de Vias Férreas  CAPÍTULO IV DA ANTICRESE  LIVRO IV DO DIREITO DE FAMÍLIA  TÍTULO I DO DIREITO PESSOAL  SUBTÍTULO I DO CASAMENTO  CAPÍTULO I DISPOSIÇÕES GERAIS  CAPÍTULO II DA CAPACIDADE PARA O CASAMENTO  CAPÍTULO III DOS IMPEDIMENTOS  CAPÍTULO IV DAS CAUSAS SUSPENSIVAS  CAPÍTULO V DO PROCESSO DE HABILITAÇÃO PARA O CASAMENTO  CAPÍTULO VI DA CELEBRAÇÃO DO CASAMENTO  CAPÍTULO VII DAS PROVAS DO CASAMENTO  CAPÍTULO VIII DA INVALIDADE DO CASAMENTO  CAPÍTULO IX DA EFICÁCIA DO CASAMENTO  CAPÍTULO X DA DISSOLUÇÃO DA SOCIEDADE E DO VÍNCULO CONJUGAL  CAPÍTULO XI DA PROTEÇÃO DA PESSOA DOS FILHOS  SUBTÍTULO II DAS RELAÇÕES DE PARENTESCO  CAPÍTULO I DISPOSIÇÕES GERAIS  CAPÍTULO II DA FILIAÇÃO  CAPÍTULO III DO RECONHECIMENTO DOS FILHOS  CAPÍTULO IV DA ADOÇÃO  CAPÍTULO V DO PODER FAMILIAR  Seção I Disposições Gerais  Seção II Do Exercício do Poder Familiar  Seção III Da Suspensão e Extinção do Poder Familiar  TÍTULO II DO DIREITO PATRIMONIAL  SUBTÍTULO I DO REGIME DE BENS ENTRE OS CÔNJUGES  CAPÍTULO I DISPOSIÇÕES GERAIS  CAPÍTULO II DO PACTO ANTENUPCIAL  CAPÍTULO III DO REGIME DE COMUNHÃO PARCIAL  CAPÍTULO IV DO REGIME DE COMUNHÃO UNIVERSAL  CAPÍTULO V DO REGIME DE PARTICIPAÇÃO FINAL NOS AQÜESTOS  CAPÍTULO VI DO REGIME DE SEPARAÇÃO DE BENS  SUBTÍTULO II DO USUFRUTO E DA ADMINISTRAÇÃO DOS BENS DE FILHOS MENORES  SUBTÍTULO III DOS ALIMENTOS  SUBTÍTULO IV DO BEM DE FAMÍLIA  TÍTULO III DA UNIÃO ESTÁVEL  TÍTULO IV DA TUTELA E DA CURATELA  CAPÍTULO I DA TUTELA  Seção I Dos Tutores  Seção II Dos Incapazes de Exercer a Tutela  Seção III Da Escusa dos Tutores  Seção IV Do Exercício da Tutela  Seção V Dos Bens do Tutelado  Seção VI Da Prestação de Contas  Seção VII Da Cessação da Tutela  CAPÍTULO II DA CURATELA  Seção I Dos Interditos  Seção II Da Curatela do Nascituro e do Enfermo ou Portador de Deficiência Física  Seção III Do Exercício da Curatela  LIVRO V DO DIREITO DAS SUCESSÕES  TÍTULO I DA SUCESSÃO EM GERAL  CAPÍTULO I DISPOSIÇÕES GERAIS  CAPÍTULO II DA HERANÇA E DE SUA ADMINISTRAÇÃO  CAPÍTULO III DA VOCAÇÃO HEREDITÁRIA  CAPÍTULO IV DA ACEITAÇÃO E RENÚNCIA DA HERANÇA  CAPÍTULO V DOS EXCLUÍDOS DA SUCESSÃO  CAPÍTULO VI DA HERANÇA JACENTE  CAPÍTULO VII DA PETIÇÃO DE HERANÇA  TÍTULO II DA SUCESSÃO LEGÍTIMA  CAPÍTULO I DA ORDEM DA VOCAÇÃO HEREDITÁRIA  CAPÍTULO II DOS HERDEIROS NECESSÁRIOS  CAPÍTULO III DO DIREITO DE REPRESENTAÇÃO  TITULO III DA SUCESSÃO TESTAMENTÁRIA  CAPITULO I DO TESTAMENTO EM GERAL  CAPÍTULO II DA CAPACIDADE DE TESTAR  CAPÍTULO III DAS FORMAS ORDINÁRIAS DO TESTAMENTO  Seção I Disposições Gerais  Seção II Do Testamento Público  Seção III Do Testamento Cerrado  Seção IV Do Testamento Particular  CAPÍTULO IV DOS CODICILOS  CAPÍTULO V DOS TESTAMENTOS ESPECIAIS  Seção I Disposições Gerais  Seção II Do Testamento Marítimo e do Testamento Aeronáutico  Seção III Do Testamento Militar  CAPÍTULO VI DAS DISPOSIÇÕES TESTAMENTÁRIAS  CAPÍTULO VII DOS LEGADOS  Seção I Disposições Gerais  Seção II Dos Efeitos do Legado e do seu Pagamento  Seção III Da Caducidade dos Legados  CAPÍTULO VIII DO DIREITO DE ACRESCER ENTRE HERDEIROS E LEGATÁRIOS  CAPÍTULO IX DAS SUBSTITUIÇÕES  Seção I Da Substituição Vulgar e da Recíproca  Seção II Da Substituição Fideicomissária  CAPÍTULO X DA DESERDAÇÃO  CAPÍTULO XI DA REDUÇÃO DAS DISPOSIÇÕES TESTAMENTÁRIAS  CAPÍTULO XII DA REVOGAÇÃO DO TESTAMENTO  CAPÍTULO XIII DO ROMPIMENTO DO TESTAMENTO  CAPÍTULO XIV DO TESTAMENTEIRO  TÍTULO IV DO INVENTÁRIO E DA PARTILHA  CAPÍTULO I DO INVENTÁRIO  CAPÍTULO II DOS SONEGADOS  CAPÍTULO III DO PAGAMENTO DAS DÍVIDAS  CAPÍTULO IV DA COLAÇÃO  CAPÍTULO V DA PARTILHA  CAPÍTULO VI DA GARANTIA DOS QUINHÕES HEREDITÁRIOS  CAPÍTULO VII DA ANULAÇÃO DA PARTILHA  LIVRO COMPLEMENTAR DAS DISPOSIÇÕES FINAIS E TRANSITÓRIAS    * ""`, '');
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
    resultado = resultado.replace(/(LEI Nº 10.406, DE 10 DE JANEIRO DE 2002)/g, '<h6 class="leiClass">$1</h6></br>');
    resultado = resultado.replace(/(TÍTULO I  DAS PESSOAS NATURAIS    )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Da Personalidade e da Capacidade)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Dos Direitos da Personalidade)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Da Ausência)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Da Curadoria dos Bens do Ausente)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Da Sucessão Provisória)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Da Sucessão Definitiva)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO II  DAS PESSOAS JURÍDICAS)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  DAS ASSOCIAÇÕES)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  DAS FUNDAÇÕES)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO III  Do Domicílio)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(LIVRO II  DOS BENS    TÍTULO ÚNICO  Das Diferentes Classes de Bens)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Dos Bens Considerados em Si Mesmos)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Dos Bens Imóveis)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Dos Bens Móveis)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Dos Bens Fungíveis e Consumíveis)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Dos Bens Divisíveis)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V  Dos Bens Singulares e Coletivos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Dos Bens Reciprocamente Considerados)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Dos Bens Públicos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(LIVRO III  Dos Fatos Jurídicos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO I  Do Negócio Jurídico)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Representação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Da Condição, do Termo e do Encargo)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Dos Defeitos do Negócio Jurídico)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Do Erro ou Ignorância)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Do Dolo)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Da Coação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Do Estado de Perigo)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V  Da Lesão)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VI  Da Fraude Contra Credores)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Da Invalidade do Negócio Jurídico)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO II  Dos Atos Jurídicos Lícitos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO III  Dos Atos Ilícitos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IV  Da Prescrição e da Decadência)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Da Prescrição)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Das Causas que Impedem ou Suspendem a Prescrição)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Das Causas que Interrompem a Prescrição)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Dos Prazos da Prescrição)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Decadência)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO V  Da Prova)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(P A R T E      E S P E C I A L)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(LIVRO I  DO DIREITO DAS OBRIGAÇÕES)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO I  DAS MODALIDADES DAS OBRIGAÇÕES)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  DAS OBRIGAÇÕES DE DAR)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Das Obrigações de Dar Coisa Certa)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Das Obrigações de Dar Coisa Incerta)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Das Obrigações de Fazer)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Das Obrigações de Não Fazer)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Das Obrigações Alternativas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Das Obrigações Divisíveis e Indivisíveis)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  Das Obrigações Solidárias)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Da Solidariedade Ativa)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Da Solidariedade Passiva)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO II  Da Transmissão das Obrigações)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Da Cessão de Crédito)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Assunção de Dívida)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO III  Do Adimplemento e Extinção das Obrigações)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Do Pagamento)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  De Quem Deve Pagar)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Daqueles a Quem se Deve Pagar)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Do Objeto do Pagamento e Sua Prova)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Do Lugar do Pagamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V  Do Tempo do Pagamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Do Pagamento em Consignação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Do Pagamento com Sub-Rogação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Da Imputação do Pagamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Da Dação em Pagamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  DA NOVAÇÃO)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII  Da Compensação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VIII  Da Confusão)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IX  Da Remissão das Dívidas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IV  Do Inadimplemento das Obrigações)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Mora)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Das Perdas e Danos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Dos Juros Legais)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Da Cláusula Penal)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  Das Arras ou Sinal)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO V  Dos Contratos em Geral)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Preliminares)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Da Formação dos Contratos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Da Estipulação em Favor de Terceiro)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Da Promessa de Fato de Terceiro)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V  Dos Vícios Redibitórios)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VI  Da Evicção)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VII  Dos Contratos Aleatórios)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VIII  Do Contrato Preliminar)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IX  Do Contrato com Pessoa a Declarar)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Extinção do Contrato)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Do Distrato)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Da Cláusula Resolutiva)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Da Exceção de Contrato não Cumprido)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Da Resolução por Onerosidade Excessiva)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VI  Das Várias Espécies de Contrato)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Da Compra e Venda)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Das Cláusulas Especiais à Compra e Venda)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção I  Da Retrovenda)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção II  Da Venda a Contento e da Sujeita a Prova)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção III  Da Preempção ou Preferência)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção IV  Da Venda com Reserva de Domínio)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção V  Da Venda Sobre Documentos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Troca ou Permuta)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Do Contrato Estimatório)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Da Doação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Da Revogação da Doação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Da Locação de Coisas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  Do Empréstimo)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Do Comodato)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Do Mútuo)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII  Da Prestação de Serviço)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VIII  Da Empreitada)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IX  Do Depósito)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Do Depósito Voluntário)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Do Depósito Necessário)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Das Obrigações do Mandatário)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Das Obrigações do Mandante)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Da Extinção do Mandato)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V  Do Mandato Judicial)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO X  Do Mandato)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XI  Da Comissão)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XII  Da Agência e Distribuição)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XIII  Da Corretagem)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XIV  Do Transporte)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Do Transporte de Pessoas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Do Transporte de Coisas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XV  DO SEGURO)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Do Seguro de Dano)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Do Seguro de Pessoa)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XVI  Da Constituição de Renda)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XVII  Do Jogo e da Aposta)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XVIII  DA FIANÇA)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Dos Efeitos da Fiança)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Da Extinção da Fiança)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XIX  Da Transação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XX  Do Compromisso)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XXI    )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(DO CONTRATO DE ADMINISTRAÇÃO FIDUCIÁRIA DE GARANTIAS)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VII  Dos Atos Unilaterais)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Da Promessa de Recompensa)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Gestão de Negócios)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Do Pagamento Indevido)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Do Enriquecimento Sem Causa)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VIII  Dos Títulos de Crédito)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Do Título ao Portador)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Do Título À Ordem)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Do Título Nominativo)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IX  Da Responsabilidade Civil)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Da Obrigação de Indenizar)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Indenização)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO X  Das Preferências e Privilégios Creditórios)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(LIVRO II  Do Direito de Empresa)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO I  Do Empresário)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Da Caracterização e da Inscrição)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Capacidade)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO I-A  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO II  Da Sociedade)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO ÚNICO  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SUBTÍTULO I  Da Sociedade Não Personificada)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Da Sociedade em Comum)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Sociedade em Conta de Participação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SUBTÍTULO II Da Sociedade Personificada)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Da Sociedade Simples)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Do Contrato Social)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Dos Direitos e Obrigações dos Sócios)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Da Administração)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Das Relações com Terceiros)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V  Da Resolução da Sociedade em Relação a um Sócio)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VI  Da Dissolução)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Sociedade em Nome Coletivo)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Da Sociedade em Comandita Simples)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Da Sociedade Limitada)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Disposições Preliminares)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Das Quotas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Da Administração)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Do Conselho Fiscal)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V  Das Deliberações dos Sócios)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VI  Do Aumento e da Redução do Capital)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VIII  Da Dissolução)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  Da Sociedade em Comandita por Ações)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Da Sociedade Anônima    Seção Única  Da Caracterização)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII  Da Sociedade Cooperativa)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VIII  Das Sociedades CoLigadas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IX  Da Liquidação da Sociedade)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO X  Da Transformação, da Incorporação, da Fusão e da Cisão das Sociedades)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XI  Da Sociedade Dependente de Autorização)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Da Sociedade Nacional)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Da Sociedade Estrangeira)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO III  Do Estabelecimento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO ÚNICO  DISPOSIÇÕES GERAIS)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IV  Dos Institutos Complementares)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Do Registro)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  DO NOME EMPRESARIAL)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Dos Prepostos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Do Gerente)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Do Contabilista e outros Auxiliares)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Da Escrituração)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(LIVRO III  Do Direito das Coisas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO I  Da posse)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Da Posse e sua Classificação)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Aquisição da Posse)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Dos Efeitos da Posse)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Da Perda da Posse)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO II  Dos Direitos Reais)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO III  Da Propriedade)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Da Propriedade em Geral)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Da Descoberta)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Aquisição da Propriedade Imóvel)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Da Usucapião)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Da Aquisição pelo Registro do Título)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Da Aquisição por Acessão)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção I  Das Ilhas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção II  Da Aluvião)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção III  Da Avulsão)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção IV  Do Álveo Abandonado)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção V  Das Construções e Plantações)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Da Aquisição da Propriedade Móvel)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Da Ocupação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Do Achado do Tesouro)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Da Tradição)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V  Da Especificação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VI  Da Confusão, da Comissão e da Adjunção)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Da Perda da Propriedade)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Dos Direitos de Vizinhança)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Do Uso Anormal da Propriedade)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Das Árvores Limítrofes)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Da Passagem Forçada)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Da Passagem de Cabos e Tubulações)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V  Das Águas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VI  Dos Limites entre Prédios e do Direito de Tapagem)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VII  Do Direito de Construir)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  Do Condomínio Geral)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção I  Do Condomínio Voluntário)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção I  Dos Direitos e Deveres dos Condôminos)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção II  Da Administração do Condomínio)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Do Condomínio Necessário)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII  Do Condomínio Edilício)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Da Administração do Condomínio)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Da Extinção do Condomínio)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Do Condomínio de Lotes)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII-A  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    Seção I  )/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    Seção II  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    Seção III  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    Seção IV  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    Seção V  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(    Seção VI  )/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VIII  Da Propriedade Resolúvel)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IX  Da Propriedade Fiduciária)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO X    DO FUNDO DE INVESTIMENTO)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IV  Da Superfície)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO V  Das Servidões)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Da Constituição das Servidões)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Do Exercício das Servidões)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Da Extinção das Servidões)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VI  Do Usufruto)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Dos Direitos do Usufrutuário)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Dos Deveres do Usufrutuário)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Da Extinção do Usufruto)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VII  Do Uso)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VIII  Da Habitação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IX  Do Direito do Promitente Comprador)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO X  Do Penhor, da Hipoteca e da Anticrese)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Do Penhor)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Da Constituição do Penhor)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Dos Direitos do Credor Pignoratício)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Das Obrigações do Credor Pignoratício)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Da Extinção do Penhor)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V  Do Penhor Rural)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção II  Do Penhor Agrícola)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção III  Do Penhor Pecuário)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VI  Do Penhor Industrial e Mercantil)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Subseção II  Do Penhor Agrícola)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VIII  Do Penhor de Veículos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IX  Do Penhor Legal)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Da Hipoteca)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VII  Do Penhor de Direitos e Títulos de Crédito)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Da Hipoteca Legal)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Do Registro da Hipoteca)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Da Extinção da Hipoteca)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V  Da Hipoteca de Vias Férreas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Da Anticrese)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO XI    DA LAJE)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(LIVRO IV  Do Direito de Família)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO I  Do Direito Pessoal)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SUBTÍTULO I  Do Casamento)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Capacidade PARA O CASAMENTO)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Dos Impedimentos)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Das causas suspensivas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Do Processo de Habilitação PARA O CASAMENTO)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  Da Celebração do Casamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII  Das Provas do Casamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VIII  Da Invalidade do Casamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IX  Da Eficácia do Casamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO X  Da Dissolução da Sociedade e do vínculo Conjugal)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XI  Da Proteção da Pessoa dos Filhos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SUBTÍTULO II  Das Relações de Parentesco)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Filiação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Do Reconhecimento dos Filhos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Da Adoção)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Do Poder FAMILIAR)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Do Exercício do Poder Familiar)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO II  Do Direito Patrimonial)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SUBTÍTULO I  Do Regime de Bens entre os Cônjuges)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Do Pacto Antenupcial)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Do Regime de Comunhão Parcial)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Do Regime de Comunhão Universal)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Do Regime de Participação Final nos Aqüestos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  Do Regime de Separação de Bens)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SUBTÍTULO II  Do Usufruto e da Administração dos Bens de Filhos Menores)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SUBTÍTULO III  Dos Alimentos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SUBTÍTULO IV  Do Bem de Família)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO III  DA UNIÃO ESTÁVEL)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IV    Da Tutela, da Curatela e da Tomada de Decisão Apoiada)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Da Escusa dos Tutores)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Do Exercício da Tutela)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção V  Dos Bens do Tutelado)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VI  Da Prestação de Contas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção VII  Da Cessação da Tutela)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Da Curatela do Nascituro e do Enfermo ou Portador de Deficiência Física)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III    Da Tomada de Decisão Apoiada)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(LIVRO V  Do Direito das Sucessões)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO I  Da Sucessão em Geral)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Herança e de sua Administração)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Da Vocação Hereditária)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Da Aceitação e Renúncia da Herança)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Dos Excluídos da Sucessão)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  Da Herança Jacente)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII  Da petição de herança)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO II  Da Sucessão Legítima)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Da Ordem da Vocação Hereditária)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Dos Herdeiros Necessários)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Do Direito de Representação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TITULO III  DA SUCESSÃO TESTAMENTÁRIA)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPITULO I  DO TESTAMENTO EM GERAL)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Das formas ordinárias do testamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Do Testamento Público)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Do Testamento Cerrado)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção IV  Do Testamento Particular)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Dos Codicilos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Dos Testamentos Especiais)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Do Testamento Marítimo e do Testamento Aeronáutico)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Do Testamento Militar)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  Das Disposições Testamentárias)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII  Dos Legados)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Dos Efeitos do Legado e do seu Pagamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção III  Da Caducidade dos Legados)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VIII  Do Direito de Acrescer entre Herdeiros e Legatários)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IX  Das Substituições)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Da Substituição Vulgar e da Recíproca)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(Seção II  Da Substituição Fideicomissária)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO X  Da Deserdação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XI  Da Redução das Disposições Testamentárias)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XII  Da Revogação do Testamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XIII  Do Rompimento do Testamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO XIV  Do Testamenteiro)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO IV  Do Inventário e da Partilha)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Do Inventário)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Dos Sonegados)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Do Pagamento das Dívidas)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Da Colação)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Da Partilha)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  Da Garantia dos Quinhões Hereditários)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII  Da Anulação da Partilha)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(LIVRO COMPLEMENTAR  DAS Disposições Finais e Transitórias)/g, '</br><h6 class="leiClass">$1</h6>');
    return resultado;
  }
}
