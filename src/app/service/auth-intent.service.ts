import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthIntentService {

  private balanceToSave: any = null;
  private callback: (() => void) | null = null;

  constructor() { }

  setBalanceIntent(balance: any, callback: () => void) {
    this.balanceToSave = balance;
    this.callback = callback;
  }

  getBalanceToSave() {
    return this.balanceToSave;
  }

  clearIntent() {
    this.balanceToSave = null;
    this.callback = null;
  }

  runCallback() {
    if (this.callback) {
      this.callback();
      this.clearIntent();
    }
  }
}
