import {
    ASSINATURAS_RE,
    ADCT_RE,
    EntradaLei,
    linhasNaoVazias,
    parseLinhasLei,
    PREAMBULO_RE,
} from '../../shared/legal-content/legal-text-parser';

export type { Artigo, Cabecalho, EntradaLei, LinhaArtigo, TipoLinhaArtigo } from '../../shared/legal-content/legal-text-parser';

/**
 * Converte o texto corrido da Constituição (como devolvido pelo backend) numa
 * lista estruturada de cabeçalhos de seção, artigos e trechos de texto solto,
 * usando o parser genérico de `legal-text-parser`. Só a Constituição precisa
 * deste tratamento extra: ela e o ADCT foram promulgados e assinados na mesma
 * data, então "Brasília, 5 de outubro de 1988." aparece duas vezes no texto
 * (uma antes do ADCT, outra no fim de tudo) — usar direto o corte genérico
 * (que para na primeira ocorrência) cortaria o ADCT inteiro.
 */
export function parseConstituicaoText(texto: string): EntradaLei[] {
    const todasLinhas = linhasNaoVazias(texto);
    const inicioIdx = todasLinhas.findIndex((linha) => PREAMBULO_RE.test(linha));

    const primeiraAssinaturaIdx = todasLinhas.findIndex((linha) => ASSINATURAS_RE.test(linha));
    // O sumário no início do documento também menciona o ADCT (em texto
    // normal, não em caixa alta); procurar só depois da primeira assinatura
    // garante que achamos o cabeçalho real da seção, não essa menção solta.
    const adctIdx = todasLinhas.findIndex((linha, idx) => idx > primeiraAssinaturaIdx && ADCT_RE.test(linha));

    let fimIdx = -1;
    for (let i = todasLinhas.length - 1; i >= 0; i--) {
        if (ASSINATURAS_RE.test(todasLinhas[i])) {
            fimIdx = i;
            break;
        }
    }

    const corpoPermanente = todasLinhas.slice(
        inicioIdx >= 0 ? inicioIdx : 0,
        primeiraAssinaturaIdx >= 0 ? primeiraAssinaturaIdx : (fimIdx >= 0 ? fimIdx : todasLinhas.length),
    );
    const adct = adctIdx >= 0
        ? todasLinhas.slice(adctIdx, fimIdx >= 0 ? fimIdx : todasLinhas.length)
        : [];
    const linhas = [...corpoPermanente, ...adct];

    return parseLinhasLei(linhas);
}
