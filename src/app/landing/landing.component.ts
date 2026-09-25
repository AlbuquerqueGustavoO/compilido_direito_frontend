import { Component } from '@angular/core';

interface Area {
  nome: string;
  icone: string;
  descricao: string;
}

interface Persona {
  nome: string;
  headline: string;
  descricao: string;
}

interface Pergunta {
  pergunta: string;
  resposta: string;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  anoAtual = new Date().getFullYear();

  areas: Area[] = [
    {
      nome: 'Constitucional',
      icone: 'fa-solid fa-landmark',
      descricao: 'Constituição Federal e Constituição do Estado de SP, organizadas por título e capítulo.',
    },
    {
      nome: 'Civil',
      icone: 'fa-solid fa-scale-balanced',
      descricao: 'Código Civil, Código de Processo Civil e LINDB, artigo por artigo, sem ruído.',
    },
    {
      nome: 'Administrativo',
      icone: 'fa-solid fa-stamp',
      descricao: 'Licitações, improbidade, servidores e processo administrativo numa experiência só.',
    },
    {
      nome: 'Tributário',
      icone: 'fa-solid fa-file-invoice-dollar',
      descricao: 'Código Tributário Nacional, com busca direta por artigo.',
    },
    {
      nome: 'Penal',
      icone: 'fa-solid fa-gavel',
      descricao: 'Código Penal, Processo Penal e as principais leis penais especiais.',
    },
  ];

  personas: Persona[] = [
    {
      nome: 'Concurseiro(a)',
      headline: 'Ache o artigo que cai na prova em segundos.',
      descricao: 'Filtre só os artigos que importam pro seu edital e revise sem se perder em texto solto.',
    },
    {
      nome: 'Estudante de Direito',
      headline: 'A lei organizada do jeito que devia estar desde sempre.',
      descricao: 'Título, capítulo e seção continuam visíveis o tempo todo — dá pra entender onde cada artigo se encaixa.',
    },
    {
      nome: 'Advogado(a)',
      headline: 'O artigo certo, achado rápido.',
      descricao: 'Busque por número ou por texto e vá direto ao ponto, sem abrir cinco abas.',
    },
  ];

  perguntas: Pergunta[] = [
    {
      pergunta: 'Se a lei é de graça, por que eu preciso disso?',
      resposta: 'Porque ler direto no site do governo é cansativo: o texto vem bagunçado, com partes antigas misturadas com as atuais. Aqui você acha o artigo que precisa em segundos e lê sem se confundir.',
    },
    {
      pergunta: 'Meus dados ficam seguros?',
      resposta: 'Sim. Sua senha é protegida assim que você cria a conta — ninguém, nem a nossa equipe, consegue vê-la.',
    },
    {
      pergunta: 'Preciso baixar algum aplicativo?',
      resposta: 'Não precisa instalar nada. É só abrir pelo navegador, no computador ou no celular, do jeito que você já acessa qualquer site.',
    },
    {
      pergunta: 'O texto da lei é o mesmo do governo, ou é diferente?',
      resposta: 'É exatamente o mesmo texto oficial. A gente não muda nada da lei — só organiza e separa por artigo pra ficar mais fácil de encontrar.',
    },
    {
      pergunta: 'Preciso entender de tecnologia pra usar?',
      resposta: 'Não. Se você sabe pesquisar alguma coisa no Google, já sabe usar o Compilado de Leis.',
    },
  ];

  artigosExemplo = ['5º', '6º', '7º', '37', '121', '155', '157', '312', '482', '927'];

  trackByNome(_index: number, item: Area | Persona): string {
    return item.nome;
  }

  trackByPergunta(_index: number, item: Pergunta): string {
    return item.pergunta;
  }

  trackByArtigo(_index: number, numero: string): string {
    return numero;
  }
}
