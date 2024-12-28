import { Card, UnitCard } from './Card';

export enum Step {
  GAME_INIT = 'GAME_INIT',
  PLAYING_CARDS = 'PLAYING_CARDS',
  MAY_PLAY_AN_ADDITIONAL_UNIT = 'MAY_PLAY_AN_ADDITIONAL_UNIT',
  BEFORE_CONQUEST = 'BEFORE_CONQUEST',
  AFTER_CONQUEST = 'AFTER_CONQUEST',
  END_OF_GAME = 'END_OF_GAME',
}

export interface Player {
  id: string;
  name: string;
  score: number;
  hand: Card[];
  actionsAlreadyPlayed: number;
  actionsLeftToPlay: number;
  unitsLeftToPlay: number;
  actionsBeforeConquestLeft: number;
  actionsAfterConquestLeft: number;
}

export interface Place {
  id: string;
  units: UnitCard[];
  isBeeingConquered: boolean;
}

export interface GameState {
  players: Player[];
  places: Place[];
  drawPile: Card[];
  discardPile: Card[];
  turnCounter: number;
  turnOfPlayer: string | null;
  step: Step;
  scoreForVictory: number;
}
