import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AnalyticsService } from 'src/app/service/analytics.service';
import { ConstituicaoService } from 'src/app/service/constituicao.service';

@Component({
  selector: 'app-constitucional-estado-sp',
  templateUrl: './constitucional-estado-sp.component.html',
  styleUrls: ['./constitucional-estado-sp.component.scss']
})
export class ConstitucionalEstadoSpComponent implements OnInit {

  paragrafos: string[] = [];
  termoPesquisa: string = '';
  ocorrencias: number[] = [];
  ocorrenciaAtual: number = -1;
  isSearchVisible = false;
  loading = false;
  private termoPesquisaSubject = new Subject<string>();
  private termoPesquisaDebounced = new Subject<string>();



  constructor(private apiService: ConstituicaoService,
    private elementRef: ElementRef,
    private analyticsService: AnalyticsService) { }

  onTermoPesquisaChange(termo: string) {
    this.termoPesquisaSubject.next(termo); // Envie o termo de pesquisa para o subject
  }

  ngOnInit(): void {
    this.analyticsService.trackEvent('Constitucional-Estado-SP','Constitucional-Estado-SP into view');
    this.loading = true;
    this.apiService.getConstituicaoEstadoSP().subscribe((data: any) => {
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
            paragrafo = paragrafo.replace("Ficha informativa  Texto com alterações  ", '');
            paragrafo = paragrafo.replace("(Última atualização: Emenda Constitucional n° 53, de 19/12/2023)", '<h6 class="leiClass">Última atualização: Emenda Constitucional n° 53, de 19/12/2023</h6>');
            paragrafo = paragrafo.replace("SEÇÃO II  Da Competência do Tribunal de Justiça (NR)", 'SEÇÃO II  Da Competência do Tribunal de Justiça - NR');
            //console.log(paragrafo)

            if (paragrafo.startsWith('Art')) {
              // Remover o ponto (.) antes de adicionar "Artigo"
              let formattedParagrafo = this.formatarParagrafo(paragrafo.replace(/^Artigo\s*/, '')).replace('.', '');
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
    const regex = /([.;:]|\§\d+)/g;
    let numeroParagrafo = '';
    let novoParagrafo = true;

    paragrafo.split(regex).forEach((frase, index, array) => {
      frase = frase.trim().replace(/\(NR\)\s*-\s*/, ''); // Remove "(NR) -"
      if (/^§\d+$/.test(frase)) { // Se for um parágrafo iniciado com "§" mantém a numeração original
        numeroParagrafo = frase;
        novoParagrafo = true;
      } else if (/[.;:]$/.test(frase)) { // Verifica se é o final de uma frase
        resultado += frase + `<br>`;
      } else if (frase.length > 0) { // Adiciona o texto se não estiver vazio
        if (novoParagrafo) {
          resultado += `<br>${numeroParagrafo} ${frase}`;
          novoParagrafo = false;
        } else if (!/Artigo/i.test(frase)) { // Verifica se não é a palavra "artigo"
          resultado += `<br>${frase}`;
        } else { // Se for a palavra "artigo", adiciona sem <br><br>
          resultado += ` ${frase}`;
        }
        numeroParagrafo = ''; // Limpa o número do parágrafo depois de usá-lo
      }
    });
    resultado = resultado.replace(/(Assembleia Legislativa do Estado de São Paulo)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CONSTITUIÇÃO ESTADUAL, DE 05 DE OUTUBRO DE 1989)/g, '</br><h6 class="leiClass">$1</h6></br>');
    resultado = resultado.replace(/(PREÂMBULO    O Povo Paulista, invocando a proteção de Deus, e inspirado nos princípios constitucionais da República e no ideal de a todos assegurar justiça e bem-estar, decreta e promulga, por seus representantes, a CONSTITUIÇÃO DO ESTADO DE SÃO PAULO.)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO I  Dos Fundamentos do Estado)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO II  Da Organização dos Poderes)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Do Poder Legislativo)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  Da Organização do Poder Legislativo)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  Dos Deputados)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO III  Das Atribuições do Poder Legislativo)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO IV  Do Processo Legislativo)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO V  Da Procuradoria da Assembleia Legislativa)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO VI  Do Tribunal de Contas)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO VII  Da Fiscalização Contábil, Financeira e Orçamentária)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Do Poder Executivo)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  Do Governador e Vice-Governador do Estado)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  Das Atribuições do Governador)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO III  Da Responsabilidade do Governador)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO IV  Dos Secretários de Estado)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Do Poder Judiciário)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  Da Competência do Tribunal de Justiça - NR)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO III  Do Tribunal de Justiça)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO IV  Revogada)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO V  Da Justiça Militar do Estado)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO VI  Dos Tribunais do Júri)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO VII  Das Turmas de Recursos)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO VIII  Dos Juízes de Direito)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO IX  Dos Juizados Especiais e dos Juizados de Pequenas Causas)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO X  Da Justiça de Paz)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO XI  Da Declaração de Inconstitucionalidade e da Ação Direta de Inconstitucionalidade)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Das Funções Essenciais à Justiça)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  Do Ministério Público)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  Da Procuradoria Geral do Estado)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO III  Da Defensoria Pública)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO IV  Da Advocacia)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO V  Do Conselho Estadual de Defesa dos Direitos da Pessoa Humana)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO III  Da Organização do Estado)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Da Administração Pública)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  Das Obras, Serviços Públicos, Compras e Alienações)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Dos Servidores Públicos do Estado)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  Dos Servidores Públicos Civis)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  Dos Servidores Públicos Militares)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Da Segurança Pública)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  Da Polícia Civil)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO III  Da Polícia Militar)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO IV  Da Política Penitenciária e da Polícia Penal)/g, '</br></br><h6 class="leiClass">$1</h6>');    
    resultado = resultado.replace(/(TÍTULO IV  Dos Municípios e Regiões)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Dos Municípios)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  Disposições Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  Da Intervenção)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO III  Da Fiscalização Contábil, Financeira, Orçamentária, Operacional e Patrimonial)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Organização Regional)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  Dos Objetivos, Diretrizes e Prioridades)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  Das Entidades Regionais)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO V  Da Tributação, das Finanças e dos Orçamentos)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Do Sistema Tributário Estadual)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  Dos Princípios Gerais)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  Das Limitações do Poder de Tributar)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO III  Dos Impostos do Estado)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO IV  Da Repartição das Receitas Tributárias)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Das Finanças)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Dos Orçamentos)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VI  Da Ordem Econômica)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Dos Princípios Gerais da Atividade Econômica)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Do Desenvolvimento Urbano)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Da Política Agrícola, Agrária e Fundiária)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Do Meio Ambiente, dos Recursos Naturais e do Saneamento)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  Do Meio Ambiente)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  Dos Recursos Hídricos)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO III  Dos Recursos Minerais)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO IV  Do Saneamento)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VII  Da Ordem Social)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO I  Disposição Geral)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO II  Da Seguridade Social)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  Disposição Geral)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  Da Saúde)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO III  Da Promoção Social)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO III  Da Educação, da Cultura e dos Esportes e Lazer)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  Da Educação)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  Da Cultura)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO III  Dos Esportes e Lazer)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO IV  Da Ciência e Tecnologia)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO V  Da Comunicação Social)/g, '</br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VI  Da Defesa do Consumidor)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(CAPÍTULO VII  Da Proteção Especial)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO I  Da Família, da Criança, do Adolescente, do Jovem, do Idoso e dos Portadores de Deficiências)/g, '<h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(SEÇÃO II  Dos Índios)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(TÍTULO VIII  Disposições Constitucionais Gerais)/g, '</br></br><h6 class="leiClass">$1</h6>');
    resultado = resultado.replace(/(ATO DAS DISPOSIÇÕES CONSTITUCIONAIS TRANSITÓRIAS)/g, '</br></br><h6 class="leiClass">$1</h6>');
    return resultado;
  }

}
