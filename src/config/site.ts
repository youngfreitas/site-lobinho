/**
 * ============================================================================
 *  CONFIGURAÇÃO CENTRAL — Lobinho Passeios de Lancha
 * ============================================================================
 *  Todos os dados comerciais e textos editáveis da homepage ficam aqui.
 *  Os componentes NÃO devem conter preços, telefone, nomes de praias ou caminhos de mídia.
 *
 *  Itens marcados com `review: true` foram informados pelo proprietário, mas precisam ser
 *  confirmados antes da publicação definitiva (ver MATERIAIS-PENDENTES.md). Em modo de
 *  desenvolvimento (`npm run dev`) eles aparecem com um selo "Revisar antes de publicar".
 * ============================================================================
 */
import type { MediaKey } from './media';
import { formatPrice } from '../lib/format';

/* -------------------------------------------------------------------------- */
/* Empresa                                                                     */
/* -------------------------------------------------------------------------- */
export const BUSINESS = {
  name: 'Lobinho Passeios de Lancha',
  shortName: 'Lobinho',
  tagline: 'Passeios de Lancha',
  city: 'Ubatuba',
  state: 'SP',
  country: 'BR',
  /**
   * Domínio definitivo (pendente). Defina VITE_SITE_URL no arquivo .env, por exemplo
   * VITE_SITE_URL=https://www.exemplo.com.br — usado em canonical, Open Graph e JSON-LD.
   */
  siteUrl: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ?? '',
} as const;

/* -------------------------------------------------------------------------- */
/* WhatsApp                                                                    */
/* -------------------------------------------------------------------------- */
export const WHATSAPP = {
  /**
   * Número oficial em formato internacional, só dígitos: 55 + DDD + número.
   * Se ficar vazio ou inválido, nenhum link de WhatsApp é gerado (os botões mostram um aviso).
   */
  phone: '5512996999817',
  /** Como o número aparece escrito na página. */
  display: '(12) 99699-9817',
  /** Mensagens iniciais por contexto. O visitante pode editá-las antes de enviar. */
  messages: {
    hero: 'Olá! Vim pelo site da Lobinho e gostaria de consultar a disponibilidade do passeio das 7 praias.',
    header: 'Olá! Vim pelo site da Lobinho e gostaria de consultar a disponibilidade de um passeio.',
    roteiro: 'Olá! Vi o roteiro das 7 praias no site e gostaria de consultar a disponibilidade.',
    experiencia: 'Olá! Gostaria de saber mais sobre o passeio das 7 praias e consultar a disponibilidade.',
    privativo: 'Olá! Gostaria de saber sobre a possibilidade de um passeio privativo na lancha Lobinho.',
    precos: 'Olá! Gostaria de consultar a disponibilidade e os valores do passeio das 7 praias.',
    duvidas: 'Olá! Tenho uma dúvida sobre o passeio das 7 praias.',
    rodape: 'Olá! Vim pelo site da Lobinho e gostaria de mais informações.',
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Preços e condições (valores em centavos)                                    */
/* -------------------------------------------------------------------------- */
export const PRICING = {
  currency: 'BRL',
  tourName: 'Passeio das 7 praias',
  regular: { label: 'Passeio panorâmico das 7 praias', cents: 9990 },
  holiday: { label: 'Feriados prolongados', cents: 14990 },
  children: {
    label: 'Crianças de até 5 anos',
    rule: 'Pagam meia',
    maxAge: 5,
    review: true, // política informada, a confirmar antes da publicação
  },
  deposit: { cents: 3000, method: 'Pix' },
  durationLabel: 'Aproximadamente 4 horas',
  departureLabel: 'Consultar',
  balancePaymentMethods: ['crédito (com a taxa da máquina)', 'débito', 'dinheiro', 'Pix'],
  policies: {
    weather:
      'Se a empresa cancelar o passeio por causa do mau tempo, você pode reagendar em até 30 dias ou receber o estorno do sinal.',
    customerCancellation: 'Em cancelamentos feitos pelo cliente, o sinal não é devolvido.',
    refunds: 'O estorno do sinal acontece somente quando o cancelamento é por motivo climático.',
    review: true,
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Passeio                                                                     */
/* -------------------------------------------------------------------------- */
export const TOUR = {
  totalDuration: 'Aproximadamente 4 horas',
  sailing: '45 minutos a 1 hora de navegação',
  snorkel: 'Aproximadamente 15 minutos',
  landing: 'Aproximadamente 3 horas na Praia do Flamengo',
  departure: 'Consultar',
} as const;

/* -------------------------------------------------------------------------- */
/* As sete praias do roteiro                                                   */
/* -------------------------------------------------------------------------- */
export interface Beach {
  id: string;
  name: string;
  /** Foto real fornecida pelo proprietário (chave do manifesto de mídia) ou null se ainda faltar. */
  image: MediaKey | null;
  alt: string;
  /** Descrição curta. Textos escritos a partir das fotos; revisar com o proprietário. */
  description: string;
  /** Há desembarque nesta praia? (Informado: apenas na Praia do Flamengo.) */
  landing?: boolean;
  /**
   * Posição no MAPA ILUSTRATIVO (unidades do viewBox do SVG). Não são coordenadas geográficas.
   * `label` indica de que lado do marcador o nome aparece.
   */
  map: { x: number; y: number; label: 'top' | 'bottom' | 'left' | 'right' };
}

export const BEACHES: Beach[] = [
  {
    id: 'santa-rita',
    name: 'Praia da Santa Rita',
    image: 'praia-santa-rita',
    alt: 'Vista aérea da Praia da Santa Rita, com a faixa de areia entre a mata e o mar',
    description: 'Uma faixa de areia extensa entre a mata e o mar: a primeira paisagem do roteiro.',
    map: { x: 168, y: 196, label: 'bottom' },
  },
  {
    id: 'pereque-mirim',
    name: 'Perequê-Mirim',
    image: 'praia-pereque-mirim',
    alt: 'Vista aérea da enseada do Perequê-Mirim, com barcos ancorados e a serra ao fundo',
    description: 'Uma enseada ampla, com barcos ancorados e a serra ao fundo.',
    map: { x: 262, y: 120, label: 'bottom' },
  },
  {
    id: 'lamberto',
    name: 'Praia do Lamberto',
    image: 'praia-lamberto',
    alt: 'Vista aérea da Praia do Lamberto, com pedras grandes e água transparente',
    description: 'Areia clara, pedras grandes e água transparente junto ao costão.',
    map: { x: 380, y: 186, label: 'bottom' },
  },
  {
    id: 'ribeira',
    name: 'Praia da Ribeira',
    image: null, // FOTO PENDENTE — ver MATERIAIS-PENDENTES.md
    alt: 'Fotografia da Praia da Ribeira em breve',
    description: 'Mais uma paisagem do litoral de Ubatuba, apreciada a bordo durante a navegação.',
    map: { x: 478, y: 128, label: 'bottom' },
  },
  {
    id: 'dionisia',
    name: 'Dionísia',
    image: 'praia-dionisia',
    alt: 'Vista aérea da Praia da Dionísia, pequena enseada entre pedras e mata',
    description: 'Uma pequena praia entre pedras e mata, de água verde e transparente.',
    map: { x: 602, y: 196, label: 'right' },
  },
  {
    id: 'flamengo',
    name: 'Flamengo',
    image: 'praia-flamengo',
    alt: 'Praia do Flamengo, com água rasa e transparente sobre a areia',
    description: 'Água rasa e transparente sobre a areia. É aqui o desembarque, por aproximadamente 3 horas.',
    landing: true,
    map: { x: 622, y: 312, label: 'left' },
  },
  {
    id: 'flamenguinho',
    name: 'Flamenguinho',
    image: 'praia-flamenguinho',
    alt: 'Vista aérea da Praia do Flamenguinho, pequena enseada de água verde cercada de mata',
    description: 'Uma pequena enseada de água verde, cercada pela mata.',
    map: { x: 616, y: 436, label: 'left' },
  },
];

/* -------------------------------------------------------------------------- */
/* Experiência do passeio                                                      */
/* -------------------------------------------------------------------------- */
export interface ExperienceStep {
  title: string;
  meta: string;
  text: string;
  image: MediaKey;
  alt: string;
}

export const EXPERIENCE: ExperienceStep[] = [
  {
    title: 'Navegação panorâmica',
    meta: '45 min a 1 h de navegação',
    text: 'A lancha percorre o litoral passando pelas sete praias do roteiro, com tempo para apreciar cada paisagem do mar.',
    image: 'bordo-6',
    alt: 'Vista da proa da lancha Lobinho navegando, com o mar e os morros ao fundo',
  },
  {
    title: 'Tartarugas, quando possível',
    meta: 'Depende da natureza',
    text: 'Em alguns passeios dá para avistar tartarugas pelo caminho. Como são animais livres, o avistamento não é garantido.',
    image: 'video-4-capa',
    alt: 'Tartaruga marinha nadando próxima à superfície, vista da lancha',
  },
  {
    title: 'Parada para mergulho',
    meta: 'Aproximadamente 15 min',
    text: 'Uma parada rápida para entrar na água e aproveitar o mar de perto.',
    image: 'video-5-capa',
    alt: 'Pessoa nadando em água verde e transparente, perto do costão com mata',
  },
  {
    title: 'Desembarque na Praia do Flamengo',
    meta: 'Aproximadamente 3 h',
    text: 'O desembarque acontece na Praia do Flamengo. As demais praias do roteiro são apreciadas a bordo.',
    image: 'praia-flamengo',
    alt: 'Praia do Flamengo, com água rasa e transparente',
  },
];

/* -------------------------------------------------------------------------- */
/* Vídeos do passeio                                                           */
/* -------------------------------------------------------------------------- */
export interface TourVideo {
  id: string;
  /** Chave do vídeo no manifesto de mídia. */
  video: 'passeio-1' | 'passeio-2' | 'passeio-3' | 'passeio-4' | 'passeio-5';
  poster: MediaKey;
  title: string;
  description: string;
}

export const VIDEOS: TourVideo[] = [
  { id: 'v1', video: 'passeio-1', poster: 'video-1-capa', title: 'Um dia a bordo', description: 'Navegação, sol e o roteiro das 7 praias.' },
  { id: 'v2', video: 'passeio-2', poster: 'video-2-capa', title: 'Junto ao costão', description: 'A lancha perto das pedras e da mata.' },
  { id: 'v3', video: 'passeio-3', poster: 'video-3-capa', title: 'Água verde e peixes', description: 'Cardume visto da borda da lancha.' },
  { id: 'v4', video: 'passeio-4', poster: 'video-4-capa', title: 'Tartaruga no caminho', description: 'Um avistamento registrado durante um passeio.' },
  { id: 'v5', video: 'passeio-5', poster: 'video-5-capa', title: 'Hora do mergulho', description: 'Água transparente e parada para entrar no mar.' },
];

/* -------------------------------------------------------------------------- */
/* A lancha                                                                    */
/* -------------------------------------------------------------------------- */
export const BOAT = {
  name: 'Lobinho',
  model: 'DIAMAR',
  lengthFeet: 19,
  capacity: 8,
  photos: [
    { image: 'lancha-praia', alt: 'Lancha Lobinho ancorada em água rasa diante de uma praia com mata' },
    { image: 'bordo-1', alt: 'Passageiro sorrindo a bordo da Lobinho, com coletes salva-vidas e o morro ao fundo' },
    { image: 'lancha-popa', alt: 'Popa da lancha Lobinho com o motor de popa e a escada de acesso ao mar' },
    { image: 'bordo-3', alt: 'Vista da popa da lancha, com o mar verde e uma praia ao fundo sob o sol' },
    { image: 'bordo-2', alt: 'Proa da lancha com estofados claros, de frente para a mata e a praia' },
    { image: 'bordo-4', alt: 'Família sentada na proa da lancha durante o passeio' },
    { image: 'bordo-5', alt: 'Grupo de amigos sorrindo a bordo, com boias coloridas presas ao toldo' },
    { image: 'bordo-6', alt: 'Proa da lancha navegando em mar aberto' },
  ] satisfies { image: MediaKey; alt: string }[],
} as const;

/* -------------------------------------------------------------------------- */
/* Perguntas frequentes (somente informações fornecidas pelo proprietário)     */
/* -------------------------------------------------------------------------- */
const price = (cents: number) => formatPrice(cents);

export const FAQ: { q: string; a: string; review?: boolean }[] = [
  {
    q: 'Quanto tempo dura o passeio?',
    a: `A duração total é de aproximadamente 4 horas: de 45 minutos a 1 hora de navegação, uma parada para mergulho de cerca de 15 minutos e aproximadamente 3 horas na Praia do Flamengo.`,
  },
  {
    q: 'Quais praias fazem parte do roteiro?',
    a: 'Praia da Santa Rita, Perequê-Mirim, Praia do Lamberto, Praia da Ribeira, Dionísia, Flamengo e Flamenguinho.',
  },
  {
    q: 'Vamos desembarcar em todas as praias?',
    a: 'Não. O desembarque acontece na Praia do Flamengo, por aproximadamente 3 horas. As outras praias são apreciadas a bordo, durante a navegação panorâmica.',
  },
  {
    q: 'De onde sai o passeio e em qual horário?',
    a: 'O local e o horário de saída são informados na consulta pelo WhatsApp, de acordo com a data escolhida.',
  },
  {
    q: 'Quanto custa?',
    a: `O passeio das 7 praias custa ${price(PRICING.regular.cents)} por pessoa. Em feriados prolongados, ${price(PRICING.holiday.cents)} por pessoa. Crianças de até 5 anos pagam meia.`,
    review: true,
  },
  {
    q: 'Como funciona o sinal da reserva?',
    a: `Para reservar, é pago um sinal de ${price(PRICING.deposit.cents)} por pessoa, via Pix. O restante é pago no dia do passeio, antes do embarque.`,
  },
  {
    q: 'Quais são as formas de pagamento no dia?',
    a: 'O restante pode ser pago no crédito (com a taxa da máquina), no débito, em dinheiro ou via Pix.',
  },
  {
    q: 'E se o tempo estiver ruim?',
    a: `${PRICING.policies.weather} ${PRICING.policies.customerCancellation} ${PRICING.policies.refunds}`,
    review: true,
  },
  {
    q: 'É possível fazer um passeio privativo?',
    a: 'Consulte pelo WhatsApp a possibilidade de um passeio privativo na Lobinho, com a data e o número de pessoas.',
  },
];

/* -------------------------------------------------------------------------- */
/* Navegação                                                                   */
/* -------------------------------------------------------------------------- */
export const NAV_LINKS = [
  { href: '#roteiro', label: 'Roteiro' },
  { href: '#experiencia', label: 'O passeio' },
  { href: '#videos', label: 'Vídeos' },
  { href: '#lancha', label: 'A lancha' },
  { href: '#valores', label: 'Valores' },
  { href: '#duvidas', label: 'Dúvidas' },
] as const;

/* -------------------------------------------------------------------------- */
/* SEO                                                                         */
/* -------------------------------------------------------------------------- */
export const SEO = {
  title: 'Lobinho Passeios de Lancha · Roteiro das 7 praias em Ubatuba, SP',
  description:
    'Passeio de lancha pelo roteiro das 7 praias em Ubatuba, SP, a bordo da Lobinho. Cerca de 4 horas, desembarque na Praia do Flamengo e parada para mergulho. R$ 99,90 por pessoa. Consulte a disponibilidade pelo WhatsApp.',
  ogImage: '/og-image.jpg',
} as const;
