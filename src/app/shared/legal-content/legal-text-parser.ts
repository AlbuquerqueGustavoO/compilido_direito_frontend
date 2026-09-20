export type TipoLinhaArtigo = 'caput' | 'paragrafo' | 'inciso' | 'alinea' | 'outro';

export interface LinhaArtigo {
    tipo: TipoLinhaArtigo;
    /** Parte da linha a destacar em negrito (ex.: "Art. 1º", "Parágrafo único."). Vazio quando não há destaque. */
    prefixo: string;
    /** Restante da linha, já posicionado para ser concatenado logo após o prefixo sem espaço extra. */
    resto: string;
}

export interface Artigo {
    numero: string;
    linhas: LinhaArtigo[];
}

export interface Cabecalho {
    nivel: 'titulo' | 'capitulo' | 'secao' | 'subsecao';
    rotulo: string;
    titulo: string;
}

export type EntradaLei =
    | { tipo: 'cabecalho'; cabecalho: Cabecalho }
    | { tipo: 'artigo'; artigo: Artigo }
    | { tipo: 'texto'; texto: string };

const HEADER_RE = /^(T[IÍ]TULO|CAP[IÍ]TULO|SUBSE[ÇC][AÃ]O|SE[ÇC][AÃ]O)\b/i;
// A maioria das leis abrevia "Art.", mas a Constituição Estadual de SP escreve
// "Artigo" por extenso — aceitar as duas formas.
const ART_RE = /^Art(igo)?\.?\s*\d/i;
// O número pode usar ponto como separador de milhar em códigos extensos
// (ex.: Código Civil vai até o "Art. 2.046") — sem isso o número seria cortado
// em "Art. 2" e o resto ("046. Todas as remissões...") viraria texto solto.
const ART_NUMERO_RE = /^Art(igo)?\.?\s*\d{1,3}(\.\d{3})*[ºo°]?/i;
const PARAGRAFO_RE = /^(Par[aá]grafo [uú]nico\.?|§\s*\d+[ºo°]?)/i;
// Incisos costumam ser numerados em algarismos romanos, mas a Constituição
// Estadual de SP usa algarismos arábicos ("1 -", "2 -") em alguns pontos.
const INCISO_RE = /^([IVXLCDM]+|\d+)\s*[-–]/;
const ALINEA_RE = /^[a-z]\s*\)/i;
export const PREAMBULO_RE = /^PRE[ÂA]MBULO$/i;
// Praticamente todo texto compilado do Planalto termina com a data/local de
// promulgação ("Brasília, ...") seguida da lista de quem assinou — isso não é
// conteúdo normativo e é descartado.
// Leis mais antigas (anteriores à mudança da capital, em 1960) foram
// promulgadas e assinadas no Rio de Janeiro, não em Brasília. A vírgula e o
// "em" antes da data também variam de um texto compilado para outro.
export const ASSINATURAS_RE = /^(Bras[ií]lia|Rio de Janeiro),?\s*(em\s+)?\d/i;
// Único caso de um cabeçalho de seção que não é "TÍTULO/CAPÍTULO/SEÇÃO" e não
// vem acompanhado de uma linha de subtítulo própria: o Ato das Disposições
// Constitucionais Transitórias, na Constituição Federal. Inofensivo para as
// demais leis, já que esse texto nunca aparece nelas.
export const ADCT_RE = /^ATO DAS DISPOSI[ÇC][ÕO]ES CONSTITUCIONAIS TRANSIT[ÓO]RIAS$/i;

function classificarNivel(rotulo: string): Cabecalho['nivel'] {
    if (/^T[IÍ]TULO/i.test(rotulo)) return 'titulo';
    if (/^CAP[IÍ]TULO/i.test(rotulo)) return 'capitulo';
    if (/^SUBSE[ÇC][AÃ]O/i.test(rotulo)) return 'subsecao';
    return 'secao';
}

function classificarLinha(linha: string): LinhaArtigo {
    const paragrafoMatch = linha.match(PARAGRAFO_RE);
    if (paragrafoMatch) {
        return { tipo: 'paragrafo', prefixo: paragrafoMatch[0], resto: linha.slice(paragrafoMatch[0].length) };
    }
    if (INCISO_RE.test(linha)) {
        return { tipo: 'inciso', prefixo: '', resto: linha };
    }
    if (ALINEA_RE.test(linha)) {
        return { tipo: 'alinea', prefixo: '', resto: linha };
    }
    return { tipo: 'outro', prefixo: '', resto: linha };
}

/** Quebra o texto corrido devolvido pelo backend em linhas, sem as vazias. */
export function linhasNaoVazias(texto: string): string[] {
    if (!texto) {
        return [];
    }
    return texto
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((linha) => linha.trim())
        .filter((linha) => linha.length > 0);
}

/**
 * Converte uma lista de linhas (já limpas de boilerplate pelo chamador, se
 * necessário) numa lista estruturada de cabeçalhos de seção, artigos e
 * trechos de texto solto (preâmbulos, avisos etc.).
 */
export function parseLinhasLei(linhas: string[]): EntradaLei[] {
    const entradas: EntradaLei[] = [];
    let artigoAtual: Artigo | null = null;

    const fecharArtigo = () => {
        if (artigoAtual) {
            entradas.push({ tipo: 'artigo', artigo: artigoAtual });
        }
        artigoAtual = null;
    };

    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];

        if (ADCT_RE.test(linha)) {
            fecharArtigo();
            entradas.push({ tipo: 'cabecalho', cabecalho: { nivel: 'titulo', rotulo: linha, titulo: '' } });
            continue;
        }

        if (HEADER_RE.test(linha)) {
            fecharArtigo();
            const proxima = linhas[i + 1] ?? '';
            // Normalmente a linha seguinte é só o subtítulo descritivo do
            // cabeçalho (ex.: "TÍTULO I" / "DOS PRINCÍPIOS FUNDAMENTAIS"),
            // mas às vezes um cabeçalho não tem subtítulo próprio e já é
            // seguido por OUTRO cabeçalho (ex.: "Título I" / "Capítulo
            // Único") — nesse caso não dá pra engolir essa linha como se
            // fosse texto solto, senão o cabeçalho seguinte se perde.
            const proximaEhCabecalho = HEADER_RE.test(proxima);
            entradas.push({
                tipo: 'cabecalho',
                cabecalho: { nivel: classificarNivel(linha), rotulo: linha, titulo: proximaEhCabecalho ? '' : proxima },
            });
            if (!proximaEhCabecalho) {
                i++;
            }
            continue;
        }

        if (ART_RE.test(linha)) {
            fecharArtigo();
            const numeroMatch = linha.match(ART_NUMERO_RE);
            const numero = numeroMatch ? numeroMatch[0] : 'Art.';
            artigoAtual = {
                numero,
                linhas: [{ tipo: 'caput', prefixo: numero, resto: linha.slice(numero.length) }],
            };
            continue;
        }

        if (!artigoAtual) {
            entradas.push({ tipo: 'texto', texto: linha });
            continue;
        }

        artigoAtual.linhas.push(classificarLinha(linha));
    }
    fecharArtigo();

    return entradas;
}

/**
 * Ponto de entrada padrão para leis "simples" (sem as particularidades da
 * Constituição Federal, que tem seu próprio parser em cima destas funções):
 * descarta o cabeçalho/rodapé burocrático do texto compilado do Planalto
 * (Presidência da República, referências "Vide ...", assinatura de
 * promulgação) e estrutura o restante.
 */
export function parseTextoLei(texto: string): EntradaLei[] {
    const todasLinhas = linhasNaoVazias(texto);

    const inicioIdx = todasLinhas.findIndex(
        (linha) => HEADER_RE.test(linha) || ART_RE.test(linha) || PREAMBULO_RE.test(linha),
    );

    let fimIdx = -1;
    for (let i = todasLinhas.length - 1; i >= 0; i--) {
        if (ASSINATURAS_RE.test(todasLinhas[i])) {
            fimIdx = i;
            break;
        }
    }

    const linhas = todasLinhas.slice(
        inicioIdx >= 0 ? inicioIdx : 0,
        fimIdx >= 0 ? fimIdx : todasLinhas.length,
    );

    return parseLinhasLei(linhas);
}
