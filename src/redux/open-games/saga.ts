import { fork, take, select, cancel, call, apply } from 'redux-saga/effects';

export const getGameState = (storeObj:any) => storeObj.game.gameState;
export const getWalletAddress = (storeObj:any) => storeObj.wallet.address;

import { default as firebase, reduxSagaFirebase } from '../../gateways/firebase';

import * as actions from './actions';

import BN from 'bn.js';
import { StateName, GameState } from '../game/state';
import { OpenGame } from './state';

export default function* openGameSaga() {
  // could be more efficient by only watching actions that could change the state
  // this is more robust though, so stick to watching all actions for the time being
  let openGameSyncerProcess = null;
  const myGameIsOnFirebase = false;

  while (true) {
    yield take('*');

    const gameState: GameState = yield select(getGameState);

    if (gameState.name === StateName.Lobby) {
      // if we're in the lobby we need to sync openGames
      if (!openGameSyncerProcess) {
        openGameSyncerProcess = yield fork(openGameSyncer);
      }
    } else {
      // if we're not in the lobby, we shouldn't be syncing openGames
      if (openGameSyncerProcess) {
        yield cancel(openGameSyncerProcess);
      }
    }

    if (gameState.name === StateName.WaitingRoom) {
      // tslint:disable:no-console
      console.log('[OPEN GAME SAGA] in waiting room');
      // need to make sure our open game is on firebase when we're in the waiting room

      const address: string = yield select(getWalletAddress);

      // tslint:disable:no-console
      console.log('[OPEN GAME SAGA] wallet address', address);

      // if we don't have a wallet address, something's gone very wrong
      if (address) {
        const myOpenGameKey = `/challenges/${address}`;

        if (!myGameIsOnFirebase) {
          // my game isn't on firebase (as far as the app knows)
          // attempt to put the game on firebase - will be a no-op if already there

          const myOpenGame: OpenGame = {
            address,
            name: gameState.myName,
            stake: gameState.roundBuyIn,
            createdAt: new Date().getTime(),
            isPublic: true,
          };

          const disconnect = firebase.database().ref(myOpenGameKey).onDisconnect();
          yield apply(disconnect, disconnect.remove);
          // use update to allow us to pick our own key
          yield call(reduxSagaFirebase.database.update, myOpenGameKey, myOpenGame);
        } else {
          if (myGameIsOnFirebase) {
            // my game is on firebase (as far as the app remember)
            // attempt to delete the game - will be a no-op if not there

            yield call(reduxSagaFirebase.database.delete, myOpenGameKey);
          }
        }

      }
    }
  }
}

// maps { '0xabc': openGame1Data, ... } to [openGame1Data, ....]
const openGameTransformer = (dict) => {
  if (!dict.value) {
    return [];
  }
  return Object.keys(dict.value).map(key => {
    // Convert the stake from a string to a BN
    dict.value[key].stake = new BN(dict.value[key].stake);
    return dict.value[key];
  });
};

function* openGameSyncer() {
  yield fork(
    reduxSagaFirebase.database.sync,
    'challenges',
    {
      successActionCreator: actions.syncOpenGames,
      transform: openGameTransformer,
    },
    'value',
  );
}

