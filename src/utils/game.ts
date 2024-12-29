import { ActionCard, Card, UnitCard } from '../types/Card';
import { GameState, Place, Player, Step } from '../types/GameState';
import { promiseSequence } from './promiseSequence';
import { shuffle } from './shuffle';

const initialGameState = {
  discardPile: [],
  drawPile: [],
  places: [],
  players: [],
  step: Step.GAME_INIT,
  turnCounter: 1,
  turnOfPlayer: null,
  scoreForVictory: 15,
};

export const updateGameState = async (
  updater?: (gameState: GameState) => GameState,
): Promise<GameState> => {
  return initialGameState;
};

const triggercardsComponents = async (
  gameState: GameState,
  suitTrigger: (gs: GameState) => Promise<GameState> | undefined,
  baseTrigger: (gs: GameState) => Promise<GameState> | undefined,
) => {
  const gameStateAfterSuit = await suitTrigger(gameState);
  const gameStateAfterBase = await baseTrigger(gameStateAfterSuit || gameState);
  return gameStateAfterBase || gameStateAfterSuit || gameState;
};

const updateUnit = async (
  unitId: string,
  updater: (unit: UnitCard) => UnitCard,
) =>
  updateGameState((prev) => ({
    ...prev,
    places: prev.places.map((place) => ({
      ...place,
      units: place.units.map((unit) =>
        unit.id === unitId ? updater(unit) : unit,
      ),
    })),
  }));

export const playUnitCard = async (unit: UnitCard, placeId: string) => {
  const gameState = await updateGameState((prev) => ({
    ...prev,
    players: prev.players.map((player) =>
      player.id === unit.ownerId
        ? {
            ...player,
            unitsLeftToPlay: player.unitsLeftToPlay - 1,
            hand: player.hand.filter(({ id }) => id !== unit.id),
          }
        : player,
    ),
  }));

  triggercardsComponents(
    gameState,
    (gs) => unit.suit.onPlayed?.({ gameState: gs, card: unit, placeId }),
    (gs) => unit.base.onPlayed?.({ gameState: gs, card: unit, placeId }),
  );

  return updateGameState((prev) => ({
    ...prev,
    places: prev.places.map((place) =>
      place.id === placeId
        ? { ...place, units: [...place.units, unit] }
        : place,
    ),
  }));
};

export const playActionCard = async (actionCard: ActionCard) => {
  const gameState = await updateGameState((prev) => ({
    ...prev,
    players: prev.players.map((player) =>
      player.id === actionCard.ownerId
        ? {
            ...player,
            actionsAlreadyPlayed: player.actionsAlreadyPlayed + 1,
            actionsLeftToPlay: player.actionsLeftToPlay - 1,
            hand: player.hand.filter(({ id }) => id !== actionCard.id),
          }
        : player,
    ),
  }));

  triggercardsComponents(
    gameState,
    (gs) => actionCard.suit.onPlayed?.({ gameState: gs, card: actionCard }),
    (gs) => actionCard.base.onPlayed?.({ gameState: gs, card: actionCard }),
  );

  return discardCard(actionCard);
};

export const discardCard = async (card: Card) => {
  const gameState = await updateGameState((prev) => ({
    ...prev,
    places: prev.places.map((place) => ({
      ...place,
      units: place.units.filter(({ id }) => id !== card.id),
    })),
    players: prev.players.map((player) => ({
      ...player,
      hand: player.hand.filter(({ id }) => id !== card.id),
    })),
  }));

  triggercardsComponents(
    gameState,
    (gs) => card.suit.onDiscarted?.({ gameState: gs, card }),
    (gs) => card.base.onDiscarted?.({ gameState: gs, card }),
  );

  // Add card to discard pile
  return updateGameState((prev) => ({
    ...prev,
    discardPile: [...prev.discardPile, { ...card, ownerId: undefined }],
  }));
};

export const drawOneCard = async (gameState: GameState, playerId: string) => {
  let state = gameState;
  let [cardToDraw] = gameState.drawPile;

  if (!cardToDraw) {
    state = await shuffleDiscardIntoDrawPile();
    [cardToDraw] = state.drawPile;
  }

  if (!cardToDraw) return state;

  triggercardsComponents(
    state,
    (gs) =>
      cardToDraw.suit.onDrawed?.({ gameState: gs, card: cardToDraw, playerId }),
    (gs) =>
      cardToDraw.base.onDrawed?.({ gameState: gs, card: cardToDraw, playerId }),
  );

  // Add card to playerHand
  return updateGameState((prev) => ({
    ...prev,
    players: prev.players.map((player) =>
      player.id === cardToDraw.ownerId
        ? {
            ...player,
            hand: [...player.hand, { ...cardToDraw, ownerId: playerId }],
          }
        : player,
    ),
  }));
};

export const returnCardToHand = async (card: Card, playerId: string) => {
  return updateGameState((prev) => ({
    ...prev,
    discardPile: prev.discardPile.filter(({ id }) => id !== card.id),
    places: prev.places.map((place) => ({
      ...place,
      units: place.units.filter(({ id }) => id !== card.id),
    })),
    players: prev.players.map((player) =>
      player.id === playerId
        ? {
            ...player,
            hand: [...player.hand, { ...card, ownerId: playerId }],
          }
        : player,
    ),
  }));
};

const shuffleDiscardIntoDrawPile = async () => {
  return updateGameState((prev) => ({
    ...prev,
    discardPile: [],
    drawPile: [...prev.drawPile, ...shuffle(prev.discardPile)],
  }));
};

export const destroyUnit = async (unit: UnitCard) => {
  const gameState = await updateGameState((prev) => ({
    ...prev,
    places: prev.places.map((place) => ({
      ...place,
      units: place.units.filter(({ id }) => id !== unit.id),
    })),
  }));

  triggercardsComponents(
    gameState,
    (gs) => unit.suit.onDestroyed?.({ gameState: gs, card: unit }),
    (gs) => unit.base.onDestroyed?.({ gameState: gs, card: unit }),
  );

  return discardCard(unit);
};

export const moveUnit = async (
  unitBeeingMoved: UnitCard,
  newPlaceId: string,
) => {
  const gameState = await updateGameState((prev) => ({
    ...prev,
    places: prev.places.map((place) =>
      place.id === newPlaceId
        ? { ...place, units: [...place.units, unitBeeingMoved] }
        : {
            ...place,
            units: place.units.filter(({ id }) => id !== unitBeeingMoved.id),
          },
    ),
  }));

  const updatedGameState = await triggercardsComponents(
    gameState,
    (gs) =>
      unitBeeingMoved.suit.onMoved?.({
        gameState: gs,
        card: unitBeeingMoved,
        newPlaceId,
      }),
    (gs) =>
      unitBeeingMoved.base.onMoved?.({
        gameState: gs,
        card: unitBeeingMoved,
        newPlaceId,
      }),
  );

  const arrivalPlace = updatedGameState.places.find(
    ({ id }) => id === newPlaceId,
  );

  if (!arrivalPlace) {
    return updatedGameState;
  }

  return promiseSequence(
    updatedGameState,
    arrivalPlace.units
      .filter(({ id }) => id !== unitBeeingMoved.id)
      .map(
        (placeUnit) => async (gameStateInSequence) =>
          triggercardsComponents(
            gameStateInSequence,
            (gs) =>
              placeUnit.suit.onOtherUnitMovedToHere?.({
                gameState: gs,
                card: placeUnit,
                otherUnit: unitBeeingMoved,
              }),
            (gs) =>
              placeUnit.base.onOtherUnitMovedToHere?.({
                gameState: gs,
                card: placeUnit,
                otherUnit: unitBeeingMoved,
              }),
          ),
      ),
  );
};

export const revealUnit = async (unit: UnitCard) => {
  const gameState = await updateUnit(unit.id, (u) => ({ ...u, hidden: false }));

  triggercardsComponents(
    gameState,
    (gs) => unit.suit.onRevealed?.({ gameState: gs, card: unit }),
    (gs) => unit.base.onRevealed?.({ gameState: gs, card: unit }),
  );

  const placeFound = gameState.places.find(({ units }) =>
    units.find(({ id }) => id === unit.id),
  );

  if (!placeFound) {
    return;
  }

  return playUnitCard(unit, placeFound.id);
};

export const activateUnitPower = async (unit: UnitCard) => {
  const gameState = await updateUnit(unit.id, (u) => ({
    ...u,
    powerActivated: true,
  }));

  triggercardsComponents(
    gameState,
    (gs) => unit.suit.onActivated?.({ gameState: gs, card: unit }),
    (gs) => unit.base.onActivated?.({ gameState: gs, card: unit }),
  );
};

export const triggerConquest = async (place: Place) => {
  const gameState = await updateGameState((prev) => ({
    ...prev,
    places: prev.places.map((p) =>
      p.id === place.id ? { ...p, isBeeingConquered: true } : p,
    ),
    players: prev.players.map((player) => ({
      ...player,
      actionsBeforeConquestLeft: 1,
    })),
  }));

  return promiseSequence(
    gameState,
    place.units.map(
      (placeUnit) => async (gameStateInSequence) =>
        triggercardsComponents(
          gameStateInSequence,
          (gs) =>
            placeUnit.suit.onPlaceBeeinConquered?.({
              gameState: gs,
              card: placeUnit,
            }),
          (gs) =>
            placeUnit.base.onPlaceBeeinConquered?.({
              gameState: gs,
              card: placeUnit,
            }),
        ),
    ),
  );
};

const isVictory = (gameState: GameState) => {
  const potentialWinners = gameState.players.filter(
    ({ score }) => score >= gameState.scoreForVictory,
  );
  const sortedWinners = [...potentialWinners].sort(
    (playerA, playerB) => playerA.score - playerB.score,
  );
  return sortedWinners[0]?.score !== sortedWinners[1]?.score;
};

export const newTurn = async (gameState: GameState) => {
  if (gameState.turnOfPlayer) {
    await drawOneCard(gameState, gameState.turnOfPlayer);
    await drawOneCard(gameState, gameState.turnOfPlayer);
  }

  return updateGameState((prev) => {
    let newFullTurn = false;
    let nextPlayer =
      prev.players[
        prev.players.findIndex((player) => player.id === prev.turnOfPlayer) + 1
      ];
    if (!nextPlayer) {
      newFullTurn = true;
      [nextPlayer] = prev.players;
    }

    if (!nextPlayer) return gameState;

    return {
      ...prev,
      places: prev.places.map((place) => ({
        ...place,
        units: place.units.map((unit) => ({
          ...unit,
          powerActivated: false,
          taunt: nextPlayer.id === unit.ownerId ? false : unit.taunt,
          valueModifiers: unit.valueModifiers.filter(
            ({ expire }) =>
              !expire.endOfTurn &&
              expire.startOfTurnOfPlayerId !== nextPlayer.id,
          ),
        })),
      })),
      turnOfPlayer: nextPlayer.id,
      turnCounter: newFullTurn ? prev.turnCounter + 1 : prev.turnCounter,
      step: isVictory(prev) ? Step.END_OF_GAME : Step.PLAYING_CARDS,
      players: prev.players.map((player) => ({
        ...player,
        actionsAlreadyPlayed: 0,
        actionsLeftToPlay: player.id === nextPlayer.id ? 1 : 0,
        unitsLeftToPlay: player.id === nextPlayer.id ? 1 : 0,
      })),
    };
  });
};

export const discardRandomCardFromHand = async (
  gameState: GameState,
  player: Player,
) => {
  const randomCardFromHand =
    player.hand[Math.floor(Math.random() * player.hand.length)];

  if (!randomCardFromHand) return gameState;

  return discardCard(randomCardFromHand);
};
