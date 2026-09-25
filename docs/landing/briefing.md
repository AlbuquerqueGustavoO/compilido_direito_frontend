# Briefing preenchido — Compilado de Leis (landing page)

Campos preenchidos com fato verificável no código/backend deste repositório. Tudo que não pude confirmar está marcado `[[PENDENTE: descrição]]`, conforme sua regra — nenhum dado de negócio foi inventado.

| Campo | Valor |
|---|---|
| Nome do produto | Compilado de Leis |
| Domínio/URL de produção | [[PENDENTE: domínio público confirmado]] |
| URL de cadastro | `/auth/cadastro` (rota interna do app; domínio depende do item acima) |
| URL de demonstração/teste | [[PENDENTE: existe ambiente de demo público, ou o cadastro real é a única forma de experimentar?]] |
| Plataformas | Web responsiva (Angular 17). Sem app nativo iOS/Android. |
| Cobertura de conteúdo | 19 leis/códigos em 6 áreas: Constitucional (2), Civil (3), Administrativo (6), Tributário (1), Penal (7) |
| Maturidade das funcionalidades | Busca, filtro por artigo, estrutura por título/capítulo/seção, login/cadastro: prontos e funcionais. Anotação/comentário pessoal: só leiaute, sem função. Ver `01-inventario-produto.md` |
| Fonte do texto e latência de atualização | [[PENDENTE: de onde vem o texto (Planalto, LexML, outra base), e qual o processo/prazo pra atualizar quando sai uma EC ou lei nova]] |
| Recursos de IA | Nenhum implementado hoje no código. [[PENDENTE: confirmar se há algo no roadmap que possa ser citado como "em breve", já que o briefing veda prometer o que não existe]] |
| Preço, planos, teste grátis, garantia, forma de pagamento | [[PENDENTE: não há sistema de cobrança implementado no código hoje — esta é uma decisão de negócio pendente, não um gap técnico]] |
| Desconto estudante | [[PENDENTE]] |
| Números reais de uso | [[PENDENTE: usuários cadastrados, se divulgável]] |
| Depoimentos autorizados | [[PENDENTE: nenhum coletado/disponível no repositório]] |
| Identidade de marca existente | Paleta de design tokens já definida em `styles.scss` (`--system-color-primary` etc., verde-petróleo/teal), tipografia Roboto, Font Awesome como ícone. [[PENDENTE: existe manual de marca fora do código (logo em outras variações, guideline de tom de voz) que eu deva seguir?]] |
| Analytics/consentimento de cookies | Datadog RUM/Logs já é dependência instalada (`@datadog/browser-rum`, `@datadog/browser-logs`). [[PENDENTE: está ativo em produção? Há banner de consentimento de cookies (exigência ANPD/LGPD) implementado em algum lugar do sistema hoje?]] |
| Dados legais da empresa (razão social, CNPJ, endereço, contato) | [[PENDENTE: obrigatório por Decreto 7.962/2013 e CDC arts. 31/37/49 para o rodapé/checkout — não posso publicar a landing sem isso]] |

## Impacto de cada pendência no plano

- As pendências de **preço/plano/pagamento** bloqueiam a seção 9 dos wireframes por completo — ela fica com placeholder até você decidir.
- As pendências de **dados legais da empresa** bloqueiam o rodapé de compliance (seção 13) — sem isso a página não deveria ir ao ar de verdade, mesmo em rascunho avançado.
- As demais (fonte do texto, analytics, depoimentos, números de uso) afetam pontos específicos de copy, mas não travam o restante da estrutura — posso seguir para Fase 1 (direção visual) com placeholders visíveis nesses pontos.

Lista consolidada de todas as pendências em `pendencias.md`.
