import { GameState } from './GameState';

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

export enum CardComponentId {
  BASE = 'BASE',
  SUIT = 'SUIT',
}

export interface CardComponent {
  title: string;
  onDrawed?: (params: {
    gameState: GameState;
    card: Card;
    playerId: string;
  }) => Promise<GameState>;
  onDiscarted?: (params: {
    gameState: GameState;
    card: Card;
  }) => Promise<GameState>;
}

export interface UnitCardComponent extends CardComponent {
  onPlayed?: (params: {
    gameState: GameState;
    card: UnitCard;
    placeId: string;
  }) => Promise<GameState>;
  onDestroyed?: (params: {
    gameState: GameState;
    card: UnitCard;
  }) => Promise<GameState>;
  onMoved?: (params: {
    gameState: GameState;
    card: UnitCard;
    newPlaceId: string;
  }) => Promise<GameState>;
  onRevealed?: (params: {
    gameState: GameState;
    card: UnitCard;
  }) => Promise<GameState>;
  onActivated?: (params: {
    gameState: GameState;
    card: UnitCard;
  }) => Promise<GameState>;
  onOtherUnitMovedToHere?: (params: {
    gameState: GameState;
    card: UnitCard;
    otherUnit: UnitCard;
  }) => Promise<GameState>;
  onPlaceBeeinConquered?: (params: {
    gameState: GameState;
    card: UnitCard;
  }) => Promise<GameState>;
}

export interface ActionCardComponent extends CardComponent {
  onPlayed?: (params: {
    gameState: GameState;
    card: ActionCard;
  }) => Promise<GameState>;
}

export interface UnitCardBase extends UnitCardComponent {
  id: CardBaseId;
  value: number;
}

export interface ActionCardBase extends ActionCardComponent {
  id: CardBaseId;
}

export interface UnitCardSuit extends UnitCardComponent {
  id: CardSuitId;
}

export interface ActionCardSuit extends ActionCardComponent {
  id: CardSuitId;
}

export interface Card {
  id: string;
  type: CardTypeId;
  base: ActionCardBase | UnitCardBase;
  suit: ActionCardSuit | UnitCardSuit;
  ownerId?: string;
}

export interface UnitCard extends Card {
  type: CardTypeId.UNIT;
  base: UnitCardBase;
  suit: UnitCardSuit;
  hidden: boolean;
  taunt: boolean;
  powerActivated: boolean;
  valueModifiers: {
    modifier: number;
    expire: { endOfTurn?: boolean; startOfTurnOfPlayerId?: string };
  }[];
}

export interface ActionCard extends Card {
  type: CardTypeId.ACTION;
  base: ActionCardBase;
  suit: ActionCardSuit;
  improved: boolean;
  canBePlayedDuringConquest: boolean;
}
