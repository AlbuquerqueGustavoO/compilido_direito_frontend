# Pendências — precisam da sua resposta antes de virar copy final

Nada nesta lista foi inventado nos outros documentos; onde aparecem, estão como `[[PENDENTE]]`. Marcadas por prioridade (o que bloqueia mais coisa primeiro).

## Bloqueiam seções inteiras da landing

1. **Preço, planos, teste grátis, garantia, forma de pagamento** — não existe sistema de cobrança no código hoje; isso é decisão de negócio, não implementação pendente. Bloqueia a seção 9 (Planos e preço).
2. **Dados legais da empresa** (razão social, CNPJ, endereço físico, contato) — exigido por Decreto 7.962/2013 e CDC arts. 31/37/49. Bloqueia o rodapé (seção 13) e, na prática, impede publicar a página de verdade.

## Afetam pontos específicos de copy

3. Domínio/URL de produção onde a landing vai morar.
4. Existe ambiente de demonstração público, ou cadastro real é a única forma de experimentar o produto?
5. Fonte do texto legal usada e processo/prazo de atualização quando sai uma EC ou lei nova (afeta a resposta à objeção "como sei que está atualizado?").
6. Há algum recurso de IA no roadmap que valha citar como "em breve", ou é 100% fora de escopo por ora?
7. Desconto para estudante — existe, e como funciona?
8. Números reais de uso (usuários cadastrados) que possam ser divulgados.
9. Depoimentos reais de usuários autorizados a serem citados (nome, e se possível cargo/foto).
10. Manual de marca fora do código (variações de logo, tom de voz) além dos design tokens já existentes em `styles.scss`.
11. Datadog RUM/Logs já instalado como dependência — está ativo em produção? Existe banner de consentimento de cookies em algum lugar do sistema hoje (exigência LGPD/ANPD)?
12. Responsividade mobile do produto atual — já foi validada como critério de aceite, ou ainda precisa ser testada antes de a landing afirmar "funciona no celular"?

## Sobre o público-alvo (importante confirmar antes da Fase 1)

Assumi em `03-mensagem.md` três personas (concurseiro/a, estudante de Direito, advogado/a) com base em um sinal indireto do produto (o exemplo "artigos com incidência em provas da defensoria pública" usado no filtro por artigo). **Se o público real definido no seu briefing original for diferente, isso muda headline, tom e até a ordem das seções — me avise antes de eu seguir para a Fase 1 (direção visual).**
