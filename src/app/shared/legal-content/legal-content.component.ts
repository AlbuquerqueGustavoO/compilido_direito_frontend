import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Artigo, Cabecalho, EntradaLei } from './legal-text-parser';

export interface Secao {
  cabecalho: Cabecalho | null;
  textos: string[];
  artigos: Artigo[];
}

export type AbaFiltro = 'todos' | 'incidencia' | 'novidades';

/**
 * Apresentação padrão de um texto de lei já estruturado pelo
 * `legal-text-parser`: barra de filtros/busca + cabeçalhos de
 * Título/Capítulo/Seção + cards por artigo. Usado por todas as páginas de
 * conteúdo jurídico (Constituição, Códigos, leis específicas etc.).
 */
@Component({
  selector: 'app-legal-content',
  templateUrl: './legal-content.component.html',
  styleUrls: ['./legal-content.component.scss'],
})
export class LegalContentComponent implements OnInit, OnChanges, OnDestroy {
  @Input() entradas: EntradaLei[] = [];
  @Input() loading = false;

  // Alterna só a aparência do botão selecionado: ainda não existe dado real
  // de "incidência em prova" nem de "novidades" vindo do backend, então
  // nenhuma das duas abas filtra o conteúdo por enquanto.
  abaAtiva: AbaFiltro = 'todos';

  termoBusca = '';
  secoesFiltradas: Secao[] = [];

  private secoesTodas: Secao[] = [];
  private termoBuscaSubject = new Subject<string>();

  ngOnInit(): void {
    this.termoBuscaSubject.pipe(debounceTime(300)).subscribe(() => this.aplicarFiltro());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entradas']) {
      this.secoesTodas = this.agruparEmSecoes(this.entradas);
      this.aplicarFiltro();
    }
  }

  ngOnDestroy(): void {
    this.termoBuscaSubject.complete();
  }

  selecionarAba(aba: AbaFiltro): void {
    this.abaAtiva = aba;
  }

  onBuscaChange(termo: string): void {
    this.termoBusca = termo;
    this.termoBuscaSubject.next(termo);
  }

  private agruparEmSecoes(entradas: EntradaLei[]): Secao[] {
    const secoes: Secao[] = [];
    let atual: Secao = { cabecalho: null, textos: [], artigos: [] };

    const secaoTemConteudo = (secao: Secao) => secao.textos.length > 0 || secao.artigos.length > 0;

    for (const entrada of entradas) {
      if (entrada.tipo === 'cabecalho') {
        if (atual.cabecalho || secaoTemConteudo(atual)) {
          secoes.push(atual);
        }
        atual = { cabecalho: entrada.cabecalho, textos: [], artigos: [] };
      } else if (entrada.tipo === 'texto') {
        atual.textos.push(entrada.texto);
      } else {
        atual.artigos.push(entrada.artigo);
      }
    }
    if (atual.cabecalho || secaoTemConteudo(atual)) {
      secoes.push(atual);
    }

    return secoes;
  }

  private aplicarFiltro(): void {
    const termo = this.termoBusca.trim().toLowerCase();
    if (termo === '') {
      this.secoesFiltradas = this.secoesTodas;
      return;
    }

    const numeroBuscado = this.extrairNumeroArtigo(termo);

    this.secoesFiltradas = this.secoesTodas
      .map((secao) => ({
        cabecalho: secao.cabecalho,
        textos: secao.textos.filter((texto) => texto.toLowerCase().includes(termo)),
        artigos: secao.artigos.filter((artigo) =>
          numeroBuscado
            ? artigo.numero.replace(/\D/g, '') === numeroBuscado
            : this.artigoContemTexto(artigo, termo),
        ),
      }))
      .filter((secao) => secao.textos.length > 0 || secao.artigos.length > 0);
  }

  private extrairNumeroArtigo(termo: string): string | null {
    const match = termo.match(/^art(igo)?\.?\s*(\d+)|^(\d+)$/i);
    if (!match) {
      return null;
    }
    return match[2] || match[3];
  }

  private artigoContemTexto(artigo: Artigo, termo: string): boolean {
    if (artigo.numero.toLowerCase().includes(termo)) {
      return true;
    }
    return artigo.linhas.some((linha) => (linha.prefixo + linha.resto).toLowerCase().includes(termo));
  }
}
