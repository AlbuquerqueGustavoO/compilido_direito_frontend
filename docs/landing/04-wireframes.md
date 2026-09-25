# Wireframes — landing page (ASCII, desktop e mobile)

Estrutura de 13 seções, construída a partir da matriz de inovação e da mensagem já definidas. Se a especificação original do seu briefing detalhava uma ordem/seções diferentes, me corrija antes da aprovação — reconstruí a partir do que ficou registrado nesta conversa.

## 1. Topo (header fixo, sem sidebar/topbar do sistema)

```
DESKTOP                                                    MOBILE
+----------------------------------------------+   +------------------+
| [logo]      Recursos  Cobertura  Preços  FAQ  |   | [logo]      [≡] |
|                              [Entrar] [Criar conta] |   +------------------+
+----------------------------------------------+
```

## 2. Hero

```
DESKTOP
+----------------------------------------------+
|  19 leis organizadas, buscáveis e filtráveis  |
|  por artigo — pra quem não tem tempo de       |
|  garimpar no site do governo.                 |
|                                                |
|  [Criar conta grátis]   [Ver como funciona]   |
|                                                |
|      +--------------------------------+       |
|      |  [print real do produto: busca |       |
|      |   "art. 121" + card do artigo] |       |
|      +--------------------------------+       |
+----------------------------------------------+

MOBILE (empilhado, imagem abaixo do texto)
+------------------+
| Headline curta    |
| [Criar conta]     |
| [print do produto]|
+------------------+
```
Regra de restrição de animação: um único momento orquestrado na entrada (ex.: o print do produto "monta" o card do artigo uma vez), nada de fade-slide repetido em cada seção.

## 3. O problema que resolve

```
+----------------------------------------------+
|  A lei é livre. Achar o artigo certo rápido,  |
|  sem se perder no meio do texto, não é.       |
|                                                |
|  [3 ícones/linhas: busca por artigo]          |
|  [leitura sem ruído visual]                   |
|  [recorte só do que importa]                  |
+----------------------------------------------+
```
Tom: fala do problema (achar/organizar/filtrar) sem citar nenhuma fonte externa nominalmente.

## 4. Cobertura (19 leis / 6 áreas)

```
+----------------------------------------------+
|  [Constitucional] [Civil] [Administrativo]    |
|  [Tributário] [Penal]                         |
|  19 leis e códigos, uma experiência só         |
+----------------------------------------------+
```

## 5. Como funciona (3 passos, sequência real)

```
1. Busque por texto ou número do artigo
2. Ou filtre um recorte de artigos específicos
3. Leia o artigo isolado, sem ruído de redação revogada
```
Numeração justificada aqui: é de fato um passo a passo sequencial de uso.

## 6. Recurso em destaque — filtro "Por Artigos"

```
+----------------------------------------------+
|  [print do modal de seleção de artigos]       |
|  Selecione só os artigos que importam pra     |
|  sua prova, seu caso ou seu estudo.           |
+----------------------------------------------+
```

## 7. Por persona (3 blocos)

```
Concurseiro(a)     Estudante de Direito     Advogado(a)
[headline 1]        [headline 1]             [headline 1]
```

## 8. Segurança da conta

```
Login com senha protegida (hash), sessão isolada por
dispositivo. [[PENDENTE: confirmar se há mais alguma
prática de segurança que deva ser citada publicamente]]
```

## 9. Planos e preço

```
[[PENDENTE: não há sistema de pagamento implementado no
produto hoje — esta seção não pode ser construída até o
usuário definir planos/preço/teste grátis/garantia]]
```

## 10. Prova social / depoimentos

```
[[PENDENTE: depoimentos reais autorizados]]
[[PENDENTE: números reais de uso, se houver e forem
divulgáveis]]
```

## 11. FAQ / objeções

```
- A lei é de graça, por que pagar?
- Como sei que o texto está atualizado? [[PENDENTE]]
- Funciona no celular? [[PENDENTE]]
- É seguro? [ver seção 8]
```

## 12. CTA final

```
+----------------------------------------------+
|  Pare de garimpar artigo no Planalto.         |
|  [Criar conta grátis]                         |
+----------------------------------------------+
```

## 13. Rodapé (compliance)

```
+----------------------------------------------+
| Links institucionais | [[PENDENTE: razão      |
| social, CNPJ, endereço, contato — obrigatório |
| por Decreto 7.962/2013 e CDC art. 31/37/49]]  |
| Política de Privacidade (LGPD) | Termos       |
+----------------------------------------------+
```

## Nota de acessibilidade/responsividade

Wireframes desenhados mobile-first: cada seção empilha em coluna única abaixo de ~600px, CTAs sempre com alvo de toque ≥44px, contraste WCAG 2.2 AA a validar na Fase 1 com os tokens de cor definitivos.
