# Baseline Planalto — reconfirmado em 2026-09-24

Fonte: `https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm`, baixada e processada diretamente (não é impressão de tela nem confiança de memória).

| # | Limitação observada no Planalto | Confirmado ao vivo? | Nota |
|---|---|---|---|
| 1 | Sem busca própria na página (não é Ctrl+F do navegador, é busca do site) | ✅ Confirmado — 0 `<input>`/`<form>` de busca no HTML | |
| 2 | Redação revogada/antiga aparece tachada, mistura histórico com texto vigente | ✅ Confirmado — 773 ocorrências de `<strike>` | Reforça o "zoado": o texto vigente e o revogado convivem na mesma tela |
| 3 | Notas de "Redação dada pela Emenda Constitucional..." intercaladas no meio do artigo | ✅ Confirmado — presente e recorrente | |
| 4 | Página é um "compilado" cru, não um produto de leitura | ✅ Confirmado — "Texto compilado", "Emendas Constitucionais" e "ÍNDICE TEMÁTICO" aparecem como texto literal da própria página, sem nenhuma camada de UX em cima | |
| 5 | Traz referências a ADI/STF soltas no meio do texto, sem separação visual | ✅ Confirmado — presentes | |
| 6 | EC mais recente incorporada na página | ✅ Confirmado — **EC nº 139** é a mais alta mencionada no HTML, bate exatamente com a citação do briefing ("EC nº 139/2026") | |
| 7 | Art. 6º teria 4 redações históricas distintas (1988 + ECs 26/2000, 64/2010, 90/2015) | ⚠️ Diverge — extração automática encontrou **3 redações de texto distintas** para o caput do art. 6º na página atual, não 4 | Ver nota abaixo — não usar "4 vezes" em copy sem conferência manual |
| 8–13 | Ausência de: referências cruzadas clicáveis, grifos/anotações pessoais, alertas de mudança por EC, leiaute mobile-friendly, citação em formato pronto (ABNT/padrão jurídico), apoio de estudo/interpretação | Não verificado tecnicamente (são ausências de funcionalidade, não fatos extraíveis do HTML) | Estas são as linhas que sustentam a matriz de inovação — ver `02-matriz-inovacao.md`; só entram na copy as que têm par real no produto |

## Nota sobre a linha 7 (Art. 6º)

Isolei linhas que **começam** com "Art. 6º " (evitando contar citações tipo "vide art. 6º" em outros artigos) no texto extraído do HTML. Resultado: 3 blocos de texto distintos, sendo o terceiro visivelmente truncado em relação aos dois primeiros — o que pode ser um artefato da extração (o HTML do Planalto é irregular) ou pode ser que o número real hoje seja 3, não 4. Recomendo **conferir manualmente na página antes de publicar** qualquer peça de copy que cite esse número — é uma afirmação verificável e o público-alvo (profissionais do direito) é o público mais propenso a checar.

## Confirmações adicionais relevantes para a Fase 1 (direção visual)

- A página não tem absolutamente nenhum tratamento visual de hierarquia além do HTML puro — reforça a proposta de venda como "tempo, organização e segurança", não o texto em si (o texto é livre e idêntico ao daqui).
- Não há paywall nem cadastro no Planalto — a landing não deve prometer "acesso ao texto da lei" como diferencial (isso é grátis e sempre será), e sim a camada de produto em cima dele.
