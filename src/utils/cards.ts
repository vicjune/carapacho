export enum CardBaseId {
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
  SIX = 'SIX',
  SEVEN = 'SEVEN',
  EIGHT = 'EIGHT',
  NINE = 'NINE',
  TEN = 'TEN',
  JACK = 'JACK',
  QUEEN = 'QUEEN',
  KING = 'KING',
  ACE = 'ACE',
}

export enum CardSuitId {
  HEART = 'HEART',
  DIAMOND = 'DIAMOND',
  SPADE = 'SPADE',
  CLUB = 'CLUB',
}

export enum CardTypeId {
  ACTION = 'ACTION',
  UNIT = 'UNIT',
}

export interface CardType {
  id: CardTypeId;
  title: string;
}

export interface ActionCardBase {
  id: CardBaseId;
  title: string;
  text: string;
  improvedText?: string;
}

export interface UnitCardBase {
  id: CardBaseId;
  title: string;
  text?: string;
  value: number;
}

export interface CardSuit {
  id: CardSuitId;
  title: string;
  text: string;
}

export interface Card {
  id: string;
  type: CardTypeId;
  base: ActionCardBase | UnitCardBase;
  suit: CardSuit;
}

export const cardTypes: CardType[] = [
  {
    id: CardTypeId.ACTION,
    title: 'Action',
  },
  {
    id: CardTypeId.UNIT,
    title: 'Unité',
  },
];

export const actionsCardBases: ActionCardBase[] = [
  {
    id: CardBaseId.TWO,
    title: '2',
    text: 'Jouer une unité supplémentaire.',
    improvedText:
      'Jouer deux unités supplémentaires sur deux bases différentes.',
  },
  {
    id: CardBaseId.THREE,
    title: '3',
    text: 'Détruire une unité de valeur 2 ou moins.',
    improvedText: 'Détruire une unité.',
  },
  {
    id: CardBaseId.FOUR,
    title: '4',
    text: 'Déplacer une unité.',
    improvedText: "Déplacer jusqu'à deux unités.",
  },
  {
    id: CardBaseId.FIVE,
    title: '5',
    text: "Changer le propriétaire d'une unité de valeur 1 ou moins.",
    improvedText: "Changer le propriétaire d'une unité de valeur 2 ou moins.",
  },
  {
    id: CardBaseId.SIX,
    title: '6',
    text: "+2 OU -2 à une unité jusqu'à la fin du tour.",
    improvedText:
      "+1 à toutes vos unités sur une base jusqu'à la fin du tour OU -1 à toutes les unités adverses sur une base jusqu’au début de votre prochain tour.",
  },
  {
    id: CardBaseId.SEVEN,
    title: '7',
    text: 'Renvoyer une unité dans la main de son propriétaire.',
    improvedText:
      'Renvoyer une unité dans la main d’un joueur de votre choix <i>(ou vous-même)</i>. Son propriétaire peut immédiatement jouer une unité supplémentaire sur la même base.',
  },
];

export const unitCardBases: UnitCardBase[] = [
  {
    id: CardBaseId.EIGHT,
    title: '8',
    text: '<b>Permanent:</b> Si cette carte se trouve sur une base au moment de sa conquête, son propriétaire peut jouer 1 action avant-conquête ou après-conquête supplémentaire.',
    value: 1,
  },
  {
    id: CardBaseId.NINE,
    title: '9',
    text: '<b>Effet quand détruite:</b> Son propriétaire peut récupérer dans sa main une carte de la défausse.',
    value: 1,
  },
  {
    id: CardBaseId.TEN,
    title: '10',
    text: '<b>Effet quand jouée:</b> Jusqu’au début de votre prochain tour, les autres joueurs ne peuvent pas jouer d’unités sur d’autres bases que celle où se trouve cette carte.',
    value: 1,
  },
  {
    id: CardBaseId.JACK,
    title: 'J',
    text: "<b>Effet quand jouée:</b> -1 à toutes les autres unités sur la base jusqu'à la fin du tour.",
    value: 2,
  },
  {
    id: CardBaseId.QUEEN,
    title: 'Q',
    text: "<b>Effet quand jouée:</b> Révélez la première carte de la pioche jusqu'à tomber sur une action que vous pouvez jouer immédiatement comme action supplémentaire sans prendre en compte son symbole.",
    value: 2,
  },
  {
    id: CardBaseId.KING,
    title: 'K',
    text: '<b>Effet quand jouée:</b> Vous pouvez jouer un 8, 9 ou 10 comme unité supplémentaire sur la même base.',
    value: 2,
  },
  {
    id: CardBaseId.ACE,
    title: 'A',
    value: 3,
  },
];

export const actionCardSuits: CardSuit[] = [
  {
    id: CardSuitId.HEART,
    title: '♥️',
    text: "<b>Action améliorée, l'effet devient: </b>",
  },
  {
    id: CardSuitId.DIAMOND,
    title: '♦️',
    text: 'Vous pouvez jouer cette action avant ou après la conquête <i>(maximum 1 avant et 1 après par conquête)</i>.',
  },
  {
    id: CardSuitId.SPADE,
    title: '♠️',
    text: '<b>Effet quand jouée <i>(maximum 1 par tour)</i>:</b> Vous pouvez jouer une action supplémentaire.',
  },
  {
    id: CardSuitId.CLUB,
    title: '♣️',
    text: '<b>Effet quand jouée:</b> Choisissez un joueur <i>(ou vous-même)</i> s’il a 5 cartes ou moins en main, il pioche une carte, sinon il en défausse une de son choix.',
  },
];

export const unitCardSuits: CardSuit[] = [
  {
    id: CardSuitId.HEART,
    title: '♥️',
    text: '<b>Une fois par tour pour cette unité:</b> Vous pouvez défausser une carte de votre main pour déplacer cette unité AVEC une unité de valeur inférieure ou égale de cette base vers une autre base.',
  },
  {
    id: CardSuitId.DIAMOND,
    title: '♦️',
    text: '<b>Permanent:</b> Cachée.',
  },
  {
    id: CardSuitId.SPADE,
    title: '♠️',
    text: '<b>Permanent:</b> Lorsqu’une unité adverse de valeur inférieure est déplacée sur la base de cette unité, elle est détruite.',
  },
  {
    id: CardSuitId.CLUB,
    title: '♣️',
    text: '<b>Permanent:</b> Tant que vous avez 3 cartes ou moins en main, a +1 en valeur et est immunisée aux effets adverses.',
  },
];

const buildCards = (
  type: CardTypeId,
  bases: (UnitCardBase | ActionCardBase)[],
  suits: CardSuit[],
) =>
  bases.reduce<Card[]>((prev, cardBase) => {
    const newCards = suits.map((cardSuit) => ({
      id: `${cardBase.id}_OF_${cardSuit.id}S`,
      type,
      base: cardBase,
      suit: cardSuit,
    }));
    return [...prev, ...newCards];
  }, []);

export const cards: Card[] = [
  ...buildCards(CardTypeId.ACTION, actionsCardBases, actionCardSuits),
  ...buildCards(CardTypeId.UNIT, unitCardBases, unitCardSuits),
];
