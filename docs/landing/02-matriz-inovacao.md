# Diferenciais do produto

Regra aplicada: só entra linha com funcionalidade real (ver `01-inventario-produto.md`). O que não existe hoje foi **descartado**, não "prometido". (O Planalto serviu só de referência de contexto na conversa — a página não faz comparação nominal com ele.)

| Diferencial | O que o Compilado de Leis faz | Onde no produto |
|---|---|---|
| Busca própria | Busca por texto ou número de artigo, com debounce, dentro de cada lei | `app-legal-content`, todas as 19 páginas |
| Leitura sem ruído | Cada artigo é um card isolado com a redação vigente, sem mistura visual com histórico | Cards de artigo |
| Recorte sob medida | Modal "Por Artigos": seleciona vários números, aplica filtro | Toolbar de cada lei |
| Hierarquia clara | Estrutura em Título/Capítulo/Seção/Subseção extraída automaticamente, com cabeçalhos e cards | Todas as leis |
| Navegação por área | Sidebar por área jurídica (Constitucional, Civil, Administrativo, Tributário, Penal), 19 leis organizadas | Shell do sistema |
| Resiliente a falha | Erro de carregamento tratado com retry explícito | `app-legal-content` |
| Cobertura ampla | 19 leis/códigos em 6 áreas com a mesma experiência de uso | Todo o sistema |

## Fora do escopo hoje (não vão para a copy)

- Anotação/grifo pessoal — existe só como rodapé decorativo zerado, não é funcional.
- Referências cruzadas clicáveis entre artigos.
- Alertas de mudança legislativa.
- Citação em formato pronto.
- Apoio de estudo (resumos, súmulas, jurisprudência).

Se alguma dessas entrar no roadmap confirmado pelo usuário, a lista é atualizada — por ora ficam fora para não gerar promessa que o produto não cumpre no primeiro acesso.

## Ângulo de venda

Vender **tempo, organização e segurança de não se perder** no texto: achar o artigo certo rápido, ler sem ruído visual, navegar 19 leis com uma experiência única e consistente.
