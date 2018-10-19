import { Reducer } from 'redux';
import * as applicationActions from './actions';
import * as lobbyActions from '../lobby/actions';

import { State as GameState } from '../../game-engine/application-states';
import BN from 'bn.js';

export enum Room {
  lobby = 'ROOM.LOBBY',
  waitingRoom = 'ROOM.WAITING_ROOM',
  game = 'ROOM.GAME',
  error = 'ROOM.ERROR',
}

export interface Challenge {
  address: string;
  name: string;
  stake: BN;
  isPublic: boolean;
  createdAt: number;
}

export interface ApplicationState {
  currentRoom: Room;
  challenges?: Challenge[];
  myChallenge?: Challenge;
  error?: string;
}

const initialState = {
  currentRoom: Room.lobby,
  challenges: [],
};

type StateAction =
  | applicationActions.LobbySuccess
  | applicationActions.WaitingRoomSuccess
  | applicationActions.GameSuccess
  | applicationActions.InitializationFailure
  | lobbyActions.SyncChallenge;

export const applicationReducer: Reducer<ApplicationState> = (state = initialState, action: StateAction) => {
  switch (action.type) {
    case applicationActions.LOBBY_SUCCESS:
      return initialState;
    case applicationActions.WAITING_ROOM_SUCCESS:
      return {
        currentRoom: Room.waitingRoom,
        myChallenge: action.challenge,
      };
    case applicationActions.GAME_SUCCESS:
      return {
        currentRoom: Room.game,
      };
    case applicationActions.INITIALIZATION_FAILURE:
      return {
        ...state,
        currentRoom: Room.error,
        error: action.error,
      };
    case lobbyActions.SYNC_CHALLENGES:
      return {
        ...state,
        challenges: action.challenges,
      };
    default:
      return state;
  }
};
