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
}

export interface UnitCardBase {
  id: CardBaseId;
  title: string;
  value: number;
}

export interface CardSuit {
  id: CardSuitId;
  title: string;
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

export const ActionsCardBases: ActionCardBase[] = [
  {
    id: CardBaseId.TWO,
    title: '2',
  },
  {
    id: CardBaseId.THREE,
    title: '3',
  },
  {
    id: CardBaseId.FOUR,
    title: '4',
  },
  {
    id: CardBaseId.FIVE,
    title: '5',
  },
  {
    id: CardBaseId.SIX,
    title: '6',
  },
  {
    id: CardBaseId.SEVEN,
    title: '7',
  },
];

export const unitCardBases: UnitCardBase[] = [
  {
    id: CardBaseId.EIGHT,
    title: '8',
    value: 1,
  },
  {
    id: CardBaseId.NINE,
    title: '9',
    value: 1,
  },
  {
    id: CardBaseId.TEN,
    title: '10',
    value: 1,
  },
  {
    id: CardBaseId.JACK,
    title: 'J',
    value: 2,
  },
  {
    id: CardBaseId.QUEEN,
    title: 'Q',
    value: 2,
  },
  {
    id: CardBaseId.KING,
    title: 'K',
    value: 2,
  },
  {
    id: CardBaseId.ACE,
    title: 'A',
    value: 3,
  },
];

export const ActionCardSuits: CardSuit[] = [
  {
    id: CardSuitId.HEART,
    title: '♥️',
  },
  {
    id: CardSuitId.DIAMOND,
    title: '♦️',
  },
  {
    id: CardSuitId.SPADE,
    title: '♠️',
  },
  {
    id: CardSuitId.CLUB,
    title: '♣️',
  },
];

export const unitCardSuits: CardSuit[] = [
  {
    id: CardSuitId.HEART,
    title: '♥️',
  },
  {
    id: CardSuitId.DIAMOND,
    title: '♦️',
  },
  {
    id: CardSuitId.SPADE,
    title: '♠️',
  },
  {
    id: CardSuitId.CLUB,
    title: '♣️',
  },
];

const buildCards = (
  type: CardTypeId,
  lieux: (UnitCardBase | ActionCardBase)[],
  suits: CardSuit[],
) =>
  lieux.reduce<Card[]>((prev, cardBase) => {
    const newCards = suits.map((cardSuit) => ({
      id: `${cardBase.id}_OF_${cardSuit.id}S`,
      type,
      base: cardBase,
      suit: cardSuit,
    }));
    return [...prev, ...newCards];
  }, []);

export const cards: Card[] = [
  ...buildCards(CardTypeId.ACTION, ActionsCardBases, ActionCardSuits),
  ...buildCards(CardTypeId.UNIT, unitCardBases, unitCardSuits),
];
