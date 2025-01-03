import { Timestamp } from 'firebase-admin/firestore';

export enum Step {
  LOBBY = 'LOBBY',
  PLAYING_CARDS = 'PLAYING_CARDS',
  MAY_PLAY_AN_ADDITIONAL_UNIT = 'MAY_PLAY_AN_ADDITIONAL_UNIT',
  BEFORE_CONQUEST = 'BEFORE_CONQUEST',
  AFTER_CONQUEST = 'AFTER_CONQUEST',
  END_OF_GAME = 'END_OF_GAME',
}

export interface Game {
  createdAt: Timestamp;
  creatorId: string | null;
  lastActionAt: Timestamp;
  lastCallForActiondAt: Timestamp;
  scoreForVictory: number;
  drawPile: string[];
  discardPile: string[];
  turnCounter: number;
  turnOfPlayer: string | null;
  step: Step;
}

export interface Player {
  createdAt: Timestamp;
  name: string;
  color: number;
  score: number;
  hand: string[];
  actionsAlreadyPlayed: number;
  actionsLeftToPlay: number;
  unitsLeftToPlay: number;
}

export interface Place {
  units: string[];
  isBeeingConquered: boolean;
}

export interface Card {
  id: string;
  ownerId: string | null;
  hidden: boolean;
  taunt: boolean;
  powerActivated: boolean;
  valueModifiers: {
    modifier: number;
    expireAtEndOfCurrentTurn: boolean;
    expireAtStartOfTurnOfPlayerId: string | null;
  }[];
}
