# Direção visual — Fase 1

## Conceito

**Vade mecum digital.** Quem estuda ou atua em Direito no Brasil conhece o objeto físico: o livro grosso de leis compiladas, com abas coloridas na lateral separando cada área (Constitucional, Civil, Penal...), papel-bíblia, marcador de fita. É um objeto de trabalho sério, não um app qualquer — e o produto já tem, de fato, a mesma divisão por área jurídica na sidebar (5 áreas reais). Em vez de inventar uma metáfora decorativa, uso essa taxonomia real como dispositivo visual: cada área ganha uma cor de identificação, como as abas do livro físico. É estrutura que carrega informação, não enfeite.

A landing não parece um SaaS genérico nem um site institucional de escritório de advocacia — parece a versão digital, organizada e viva desse objeto que o público-alvo já reconhece e respeita.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `--land-ink` | `#12203A` | Capa/hero, texto de alto contraste — tom "capa de livro de lei", não um preto genérico |
| `--land-paper` | `#F5F3EE` | Fundo do corpo — papel, não cinza de dashboard |
| `--land-primary` | `#14B8A6` | Reaproveita `--system-color-primary` do produto real — continuidade de marca do marketing pro app logado |
| `--land-primary-dark` | `#0D9488` | Hover/ênfase, mesmo token do app |
| Abas por área (reais, da sidebar) | Constitucional `#2563EB` · Civil `#0D9488` · Administrativo `#7C3AED` · Tributário `#B45309` · Penal `#B91C1C` | Só aparecem onde a área é citada (seção de cobertura, ícones de persona) — nunca como paleta decorativa solta |

Evito deliberadamente cream+terracota (#F4F1EA/#D97757) e preto-quase-puro com verde-ácido — os dois clichês mais óbvios de design gerado por IA.

## Tipografia

- **Título/hero**: `Source Serif 4` (Google Fonts) — peso 600/700. Serifa dá o peso editorial de um texto legal sem cair no clássico Playfair genérico.
- **Corpo/UI**: `Roboto` — já é a fonte de todo o produto (confirmado em `styles.scss`); reaproveitar aqui é o que dá continuidade real de marca entre marketing e app.
- Sem all-caps em rótulo, sem "eyebrow" descolado do conteúdo, sem itálico/negrito isolado numa palavra do título — os três estão na lista de tiques a evitar.

## Layout

```
+-----------------------------------------------+
| hero: capa (--land-ink), título serifado,      |
| CTA, print real do produto em moldura de       |
| "página aberta" (canto de página, não browser  |
| chrome)                                        |
+-----------------------------------------------+
| corpo (--land-paper): seções separadas por      |
| regra fina (como numeração de artigo — "Art."), |
| não por cards uniformes com sombra repetida     |
+-----------------------------------------------+
| rail lateral fino (desktop) com as 5 cores de   |
| área, só na seção de cobertura — eco visual das |
| abas do livro físico, funcional (linka pra cada |
| área), não decorativo                            |
+-----------------------------------------------+
```

Alinhamento: hero centralizado (é o único momento "cartaz" da página); corpo alinhado à esquerda, coluna de texto <80 caracteres, no espírito de leitura de texto legal contínuo.

## Princípios

1. **A cor é taxonomia, não decoração** — as 5 cores de área só existem onde a área real é referenciada.
2. **Restrição editorial** — regra fina no lugar de card+sombra repetido em toda seção; sombra reservada pro hero e pro CTA final.
3. **Um único momento de animação orquestrado**: o print do produto no hero "abre" uma vez ao carregar (como abrir o livro); nada de fade-slide-up repetido em cada seção nem hover-transition em todo elemento.
4. **Continuidade de marca real**: teal e Roboto do produto logado aparecem na landing — quem se cadastra não sente uma marca diferente ao entrar no app.

## Autocrítica (contra os clichês do briefing)

- Não é cream+terracota, não é preto+neon, não é broadsheet de hairlines genérico, não é kit de card SaaS uniforme, não tem chrome de template (sem eyebrow all-caps, sem "A · B · C", sem "→" em botão, sem monoespaçada decorativa).
- O único risco de genérico seria o rail de cores lateral virar "decoração arco-íris solta" — por isso ele só aparece amarrado à seção de cobertura, nunca espalhado pela página inteira.

## Imagens

Sem banco de fotos de "advogado sorridente com terno" nem ilustração 3D genérica de balança da justiça. Vou usar: prints reais do produto (telas já construídas — card de artigo, modal "Por Artigos", sidebar) como protagonistas visuais, e um tratamento gráfico simples de "página"/"aba" como elemento de apoio. Nenhuma imagem stock.
