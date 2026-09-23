import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Artigo, Cabecalho, EntradaLei } from './legal-text-parser';

export interface Secao {
  cabecalho: Cabecalho | null;
  textos: string[];
  artigos: Artigo[];
}

export type AbaFiltro = 'todos' | 'porArtigos';

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
  @Input() erro: string | null = null;
  @Output() tentarNovamente = new EventEmitter<void>();

  abaAtiva: AbaFiltro = 'todos';

  termoBusca = '';
  secoesFiltradas: Secao[] = [];

  // Números "curtos" (sem o "Art." na frente) de todos os artigos da lei
  // atual, na ordem em que aparecem — alimenta a grade do modal "Por
  // Artigos".
  numerosArtigos: string[] = [];

  modalAberto = false;
  // Seleção em edição dentro do modal; só vira filtro de verdade quando o
  // usuário clica em "Filtrar" (ver aplicarFiltroArtigos). Cancelar o modal
  // não deve descartar um filtro que já estava aplicado antes de reabri-lo.
  artigosSelecionadosRascunho = new Set<string>();
  private artigosSelecionadosAplicados = new Set<string>();

  private secoesTodas: Secao[] = [];
  private termoBuscaSubject = new Subject<string>();

  ngOnInit(): void {
    this.termoBuscaSubject.pipe(debounceTime(300)).subscribe(() => this.aplicarFiltro());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entradas']) {
      this.secoesTodas = this.agruparEmSecoes(this.entradas);
      this.numerosArtigos = this.extrairNumerosArtigos(this.secoesTodas);
      this.aplicarFiltro();
    }
  }

  ngOnDestroy(): void {
    this.termoBuscaSubject.complete();
  }

  selecionarAba(aba: AbaFiltro): void {
    this.abaAtiva = aba;

    if (aba === 'todos') {
      this.artigosSelecionadosAplicados.clear();
      this.modalAberto = false;
      this.aplicarFiltro();
      return;
    }

    // Abre o modal sempre com uma cópia do que já estava aplicado, pra
    // permitir ajustar a seleção sem perder o filtro atual se cancelar.
    this.artigosSelecionadosRascunho = new Set(this.artigosSelecionadosAplicados);
    this.modalAberto = true;
  }

  toggleSelecaoArtigo(numero: string): void {
    if (this.artigosSelecionadosRascunho.has(numero)) {
      this.artigosSelecionadosRascunho.delete(numero);
    } else {
      this.artigosSelecionadosRascunho.add(numero);
    }
  }

  limparSelecaoRascunho(): void {
    this.artigosSelecionadosRascunho.clear();
  }

  fecharModal(): void {
    this.modalAberto = false;
    // Fechou sem nunca ter aplicado um filtro de artigos: não faz sentido
    // deixar a aba "Por Artigos" marcada como ativa sem filtro nenhum.
    if (this.artigosSelecionadosAplicados.size === 0) {
      this.abaAtiva = 'todos';
    }
  }

  aplicarFiltroArtigos(): void {
    this.artigosSelecionadosAplicados = new Set(this.artigosSelecionadosRascunho);
    this.modalAberto = false;
    this.aplicarFiltro();
  }

  trackByNumero(_index: number, numero: string): string {
    return numero;
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

  private extrairNumerosArtigos(secoes: Secao[]): string[] {
    const vistos = new Set<string>();
    const numeros: string[] = [];
    for (const secao of secoes) {
      for (const artigo of secao.artigos) {
        const curto = this.numeroCurto(artigo.numero);
        if (!vistos.has(curto)) {
          vistos.add(curto);
          numeros.push(curto);
        }
      }
    }
    return numeros;
  }

  private numeroCurto(numero: string): string {
    return numero.replace(/^Art(igo)?\.?\s*/i, '').replace(/[ºo°]$/i, '').trim();
  }

  private aplicarFiltro(): void {
    const termo = this.termoBusca.trim().toLowerCase();
    const temSelecaoArtigos = this.artigosSelecionadosAplicados.size > 0;

    if (termo === '' && !temSelecaoArtigos) {
      this.secoesFiltradas = this.secoesTodas;
      return;
    }

    const numeroBuscado = termo ? this.extrairNumeroArtigo(termo) : null;

    this.secoesFiltradas = this.secoesTodas
      .map((secao) => ({
        cabecalho: secao.cabecalho,
        // Com uma seleção de artigos aplicada, os blocos de texto solto
        // (preâmbulo, avisos) saem de cena — o usuário pediu só artigos.
        textos: temSelecaoArtigos ? [] : secao.textos.filter((texto) => texto.toLowerCase().includes(termo)),
        artigos: secao.artigos.filter((artigo) => {
          if (temSelecaoArtigos && !this.artigosSelecionadosAplicados.has(this.numeroCurto(artigo.numero))) {
            return false;
          }
          if (termo === '') {
            return true;
          }
          return numeroBuscado
            ? artigo.numero.replace(/\D/g, '') === numeroBuscado
            : this.artigoContemTexto(artigo, termo);
        }),
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
