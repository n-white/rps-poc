import { Play } from '../../game-engine/positions';
import { State } from '../../game-engine/application-states';

export const CHOOSE_PLAY = 'GAME.CHOOSE_PLAY';
export const PLAY_AGAIN = 'GAME.PLAY_AGAIN';
export const ABANDON_GAME = 'GAME.ABANDON_GAME';
export const STATE_CHANGED = 'GAME.STATE_CHANGED';
export const CHALLENGE_ON_CHAIN = 'GAME.CHALLENGE_ON_CHAIN';
export const CHALLENGE_RESPONSE = 'GAME.CHALLENGE_RESPONSE';
export const challengeOnChain=()=>({
  type: CHALLENGE_ON_CHAIN as typeof CHALLENGE_ON_CHAIN,
});

export const choosePlay = (play: Play) => ({
  type: CHOOSE_PLAY as typeof CHOOSE_PLAY,
  play,
});

export const playAgain = () => ({
  type: PLAY_AGAIN as typeof PLAY_AGAIN,
});

export const abandonGame = () => ({
  type: ABANDON_GAME as typeof ABANDON_GAME,
});

export const stateChanged = (state: State) => ({
  type: STATE_CHANGED as typeof STATE_CHANGED,
  state,
});

export const respondToChallenge=(play:Play)=> ({
  type: CHALLENGE_RESPONSE as typeof CHALLENGE_RESPONSE,
  play,
});
export type ChoosePlay = ReturnType<typeof choosePlay>;
export type PlayAgain = ReturnType<typeof playAgain>;
export type AbandonGame = ReturnType<typeof abandonGame>;
export type StateChanged = ReturnType<typeof stateChanged>;
export type ChallengeOnChain = ReturnType<typeof challengeOnChain>;
export type AnyAction =
  | ChoosePlay
  | PlayAgain
  | AbandonGame
  | StateChanged
  | ChallengeOnChain; 
