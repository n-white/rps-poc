import { Wallet } from '..';
import * as State from './wallet-states/PlayerA';

export default class WalletEngineA {
  static setupWalletEngine(wallet: Wallet): WalletEngineA {
    const transaction = 'bla';
    const walletState = new State.ReadyToDeploy({ transaction });
    return new WalletEngineA(wallet, walletState);
  }

  wallet: Wallet;
  state: any;

  constructor(wallet, state) {
    this.wallet = wallet;
    this.state = state;
  }

  transitionTo(state): State.PlayerAState {
    this.state = state;
    return state;
  }

  transactionSent() {
    if (this.state.constructor === State.ReadyToDeploy) {
        return this.transitionTo(new State.WaitForBlockchainDeploy());
      }else{
          return this.state;
      }
  }

  receiveEvent(event): State.PlayerAState {
    switch (this.state.constructor) {
      case State.WaitForBlockchainDeploy:
        return this.transitionTo(new State.WaitForBToDeposit());
      case State.WaitForBToDeposit:
      const {adjudicator} = event;
        return this.transitionTo(new State.Funded({adjudicator}));
      default:
        return this.state;
    }
  }
}
