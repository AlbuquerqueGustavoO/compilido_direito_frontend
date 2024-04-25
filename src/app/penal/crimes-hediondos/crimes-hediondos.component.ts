import { Component, ElementRef, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { PenalService } from 'src/app/service/penal.service';

@Component({
  selector: 'app-crimes-hediondos',
  templateUrl: './crimes-hediondos.component.html',
  styleUrls: ['./crimes-hediondos.component.scss']
})
export class CrimesHediondosComponent implements OnInit {

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
      this.apiService.getCrimesHediondosPenal().subscribe((data: any) => {
        console.log('Dados recebidos da API:', data); // Verifica o objeto retornado pela API
        if (data !== undefined && typeof data === 'object') {
          if (data.hasOwnProperty('text') && typeof data.text === 'string') {
            let paragrafosComArt: string[] = data.text.split(/(?=Art)/);
  
            // Remover os 3 primeiros caracteres do primeiro parágrafo
            if (paragrafosComArt.length > 0) {
              paragrafosComArt[0] = paragrafosComArt[0].substring(3);
            }
  
            let paragrafos = paragrafosComArt.map(paragrafo => {
              // Remover texto dentro de parênteses
              paragrafo = paragrafo.replace(/\([^)]+\)/g, ''); // Remover texto dentro de parênteses
  
              // Aplicar outras transformações apenas se o ponto não estiver dentro de parênteses
              if (!paragrafo.includes('(') || !paragrafo.includes(')')) {
                paragrafo = paragrafo.replace(/\\n/g, ''); // Substituir \n por espaço
              }
              paragrafo = paragrafo.replace(/ +/g, ' '); // Remover espaços duplicados
              paragrafo = paragrafo.replace(/\\+/g, ' '); // Remover espaços duplicados
  
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
      return paragrafo.split(/([.;:])/).map(frase => {
        return frase.trim() + (frase.trim() && /[.;:]$/.test(frase.trim()) ? '<br>' : '');
      }).join('');
    }


}
