import { Observable, Subscription } from 'rxjs';
import { EntradaLei, parseTextoLei } from './legal-text-parser';

export interface CarregarTextoLeiHandlers {
    onEntradas: (entradas: EntradaLei[]) => void;
    onLoadingChange: (loading: boolean) => void;
    onErro: (mensagem: string | null) => void;
}

/**
 * Busca o texto de uma lei, converte pra estrutura de artigos e mantém
 * `loading`/`erro` consistentes — o mesmo shape de código que se repetia em
 * cada página de conteúdo jurídico. Em caso de falha (rede, 4xx/5xx etc.),
 * desliga o loading e expõe uma mensagem, em vez de deixar o spinner girando
 * pra sempre.
 */
export function carregarTextoLei(
    fonte$: Observable<{ text?: string }>,
    handlers: CarregarTextoLeiHandlers,
    parseFn: (texto: string) => EntradaLei[] = parseTextoLei,
): Subscription {
    handlers.onLoadingChange(true);
    handlers.onErro(null);

    return fonte$.subscribe({
        next: (data) => {
            if (data?.text) {
                handlers.onEntradas(parseFn(data.text));
            }
            handlers.onLoadingChange(false);
        },
        error: () => {
            handlers.onLoadingChange(false);
            handlers.onErro('Não foi possível carregar o conteúdo. Tente novamente.');
        },
    });
}
