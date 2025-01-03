import {
  ActionCard,
  ActionCardBase,
  ActionCardSuit,
  Card,
  CardBaseId,
  CardSuitId,
  CardType,
  CardTypeId,
  UnitCard,
  UnitCardBase,
  UnitCardSuit,
} from '../types/Card';
import {
  destroyUnit,
  discardRandomCardFromHand,
  drawOneCard,
  moveUnit,
  updateGameState,
} from './game';
import {
  makeUserChoosePlace,
  makeUserChoosePlayer,
  makeUserChooseUnit,
} from './userInputs';

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
    onPlayed: async ({ card }) =>
      updateGameState((prev) => ({
        ...prev,
        players: prev.players.map((player) =>
          player.id === card.ownerId
            ? { ...player, unitsLeftToPlay: player.unitsLeftToPlay + 1 }
            : player,
        ),
      })),
  },
  {
    id: CardBaseId.THREE,
    title: '3',
    onPlayed: async ({ gameState, card }) => {
      if (!card.ownerId) return gameState;

      const targetId = await makeUserChooseUnit(card.ownerId, {
        maximumUnitValue: card.improved ? undefined : 2,
      });

      const target = gameState.places
        .map(({ units }) => units)
        .flat()
        .find(({ id }) => id === targetId);

      if (!target) return gameState;

      return destroyUnit(target);
    },
  },
  {
    id: CardBaseId.FOUR,
    title: '4',
    onPlayed: async ({ gameState, card }) => {
      const moveOneUnit = async () => {
        if (!card.ownerId) return gameState;

        const targetId = await makeUserChooseUnit(card.ownerId, {
          maximumUnitValue: card.improved ? undefined : 2,
        });

        const originPlace = gameState.places.find(({ units }) =>
          units.find((unit) => unit.id === targetId),
        );

        const target = originPlace?.units.find((unit) => unit.id === targetId);

        if (!originPlace || !target) return gameState;

        const destinationId = await makeUserChoosePlace(card.ownerId, {
          excludePlaceId: originPlace.id,
        });

        if (!destinationId) return gameState;

        return moveUnit(target, destinationId);
      };

      const updatedGameState = await moveOneUnit();

      if (card.improved) {
        return moveOneUnit();
      }

      return updatedGameState;
    },
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

export const actionCardSuits: ActionCardSuit[] = [
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
    onPlayed: async ({ card }) =>
      updateGameState((prev) => ({
        ...prev,
        players: prev.players.map((player) =>
          player.id === card.ownerId
            ? {
                ...player,
                actionsLeftToPlay:
                  player.actionsAlreadyPlayed + player.actionsLeftToPlay < 2
                    ? player.actionsLeftToPlay + 1
                    : player.actionsLeftToPlay,
              }
            : player,
        ),
      })),
  },
  {
    id: CardSuitId.CLUB,
    title: '♣️',
    onPlayed: async ({ gameState, card }) => {
      if (!card.ownerId) return gameState;
      const targetId = await makeUserChoosePlayer(card.ownerId);
      const target = gameState.players.find(({ id }) => id === targetId);
      if (!target) return gameState;
      if (target.hand.length > 5) {
        return discardRandomCardFromHand(gameState, target);
      }
      return drawOneCard(gameState, target.id);
    },
  },
];

export const unitCardSuits: UnitCardSuit[] = [
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

const buildActionCards = (bases: ActionCardBase[], suits: ActionCardSuit[]) =>
  bases.reduce<ActionCard[]>((prev, cardBase) => {
    const newCards = suits.map((cardSuit) => ({
      id: `${cardBase.id}_OF_${cardSuit.id}S`,
      type: CardTypeId.ACTION as const,
      base: cardBase,
      suit: cardSuit,
      improved: cardSuit.id === CardSuitId.HEART,
      canBePlayedDuringConquest: cardSuit.id === CardSuitId.DIAMOND,
    }));
    return [...prev, ...newCards];
  }, []);

const buildUnitCards = (bases: UnitCardBase[], suits: UnitCardSuit[]) =>
  bases.reduce<UnitCard[]>((prev, cardBase) => {
    const newCards = suits.map((cardSuit) => ({
      id: `${cardBase.id}_OF_${cardSuit.id}S`,
      type: CardTypeId.UNIT as const,
      base: cardBase,
      suit: cardSuit,
      hidden: false,
      taunt: false,
      powerActivated: false,
      valueModifiers: [],
    }));
    return [...prev, ...newCards];
  }, []);

export const cards: Card[] = [
  ...buildActionCards(actionsCardBases, actionCardSuits),
  ...buildUnitCards(unitCardBases, unitCardSuits),
];
