# Inventário do produto — Compilado de Leis

Levantado diretamente do código-fonte (`compiladodeleis_FrontEnd`, Angular 17) e do backend irmão (`CompiladoDeLeis_backend`, Node/Express). Cada item marcado com status real — nada aqui é aspiracional.

## Conteúdo jurídico disponível hoje (19 leis, 6 áreas)

| Área | Leis/códigos cobertos | Status |
|---|---|---|
| Constitucional | Constituição Federal, Constituição do Estado de SP | ✅ Pronta |
| Civil | Código Civil, Código de Processo Civil, LINDB | ✅ Pronta |
| Administrativo | Lei de Licitações e Contratos, Improbidade Administrativa, Serviços Públicos, Processo Administrativo, Servidores Públicos, Parceria Público-Privada | ✅ Pronta |
| Tributário | Código Tributário Nacional | ✅ Pronta |
| Penal | Código Penal, Código de Processo Penal, Crimes Hediondos, Lei Maria da Penha, Lei de Drogas, Lei de Organização Criminosa, Lei de Ocultação de Bens | ✅ Pronta |

Todas as 19 páginas usam o mesmo componente de apresentação (`app-legal-content`), então qualquer melhoria de UX (busca, filtro, leiaute) já é uniforme nas 19 — isto é um argumento de produto real: cobertura ampla com experiência consistente, não 19 páginas artesanais divergentes.

## Funcionalidades de leitura/organização — já implementadas

- **Estrutura navegável por Título/Capítulo/Seção/Subseção**, extraída automaticamente do texto oficial (parser próprio, não é o HTML cru do Planalto) — cada artigo vira um card autocontido, separado do vizinho.
- **Busca por texto ou por número de artigo** (`art. 121`, `121`) dentro da lei aberta, com debounce — não precisa Ctrl+F.
- **Filtro "Por Artigos"**: modal com grade de todos os números de artigo da lei aberta, seleção múltipla, aplica um recorte só com os artigos escolhidos. Único no comparativo com o Planalto — lá não existe nenhuma forma de isolar um subconjunto de artigos.
- **Tratamento de erro de carregamento** com botão "Tentar novamente" (o Planalto não trata falha nenhuma — é HTML estático).
- Sidebar com **navegação por área jurídica**, colapsável, com todas as leis organizadas por matéria — o Planalto não tem menu nenhum, é uma paginação de link cru.

## Conta e acesso — já implementado

- Cadastro e login reais (não é maquete): `POST /user/cadastrar` e `POST /user/login`, senha com hash (bcrypt) no backend, sessão com JWT.
- Token de sessão guardado em `sessionStorage` (decisão deliberada de segurança).
- Guard de rotas: todo o conteúdo jurídico exige login; só `/auth/login` e `/auth/cadastro` são públicos hoje — **isso muda com a landing**, que passa a ser a nova rota pública `/`.
- Tela "Quem somos" institucional já existe (`/quemsomos/apresentacao`).
- Contato já existe (`/admin/contato`).

## O que NÃO existe hoje (não prometer em copy)

- Anotação/grifo pessoal nos artigos — os cards já têm um rodapé com "Comentários (0)" e "Observações (0)" **de leiaute**, mas sem função real ainda (contador fixo em zero, não persiste nada). Não é uma funcionalidade pronta.
- Referências cruzadas clicáveis entre artigos.
- Alertas de alteração legislativa (quando uma EC ou lei nova muda um artigo que o usuário acompanha).
- Exportação/citação em formato pronto (ABNT ou citação jurídica padrão).
- Apoio de estudo (resumos, jurisprudência correlata, súmulas).
- Aplicativo mobile nativo — é uma aplicação web responsiva (Angular), não app de loja.
- Planos pagos, período de teste, ou qualquer mecanismo de cobrança — **não há sistema de pagamento no código hoje**. Qualquer menção a preço/plano na landing depende de decisão de negócio ainda não tomada (ver `pendencias.md`).

## Infraestrutura relevante para a landing

- Já há Datadog RUM/Logs instalado como dependência (`@datadog/browser-rum`, `@datadog/browser-logs`) — existe capacidade de analytics, mas **não confirmei se está configurado/ativo em produção nem se há banner de consentimento de cookies** (obrigatório por LGPD/ANPD se for usar analytics/tracking na landing). Ver pendências.
- Já existe script de geração de sitemap (`scripts/generate-sitemap.js`) — relevante para SEO da landing.
- Stack confirmada: Angular 17, sem framework de pagamento, sem CMS. A landing será construída como módulo Angular lazy-loaded, seguindo o padrão já usado (`auth`, `civil`, etc.), **não** em Next.js — a regra do briefing ("stack do repositório, senão Next.js") resolve para Angular porque o repositório já existe e está definido.
