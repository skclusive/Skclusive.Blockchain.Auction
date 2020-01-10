// @ts-check

// @ts-ignore
import registration from "../artifacts/Registration.json";

import Contract from "./Contract";

export default class Registration extends Contract {
  constructor(binary, web3, options = {}) {
    super(binary, web3, options);
  }

  static create(web3 = undefined, options = undefined) {
    return new Registration(registration, web3, options);
  }

  static at(address, web3 = undefined, options = undefined) {
    return new Registration({ ...registration, address }, web3, options);
  }

  async getUserById(uuid, options = {}) {
    return this._func("getUserById", uuid, options);
  }

  async getUserByPhone(phone, options = {}) {
    return this._func("getUserByPhone", phone, options);
  }

  async checkInitialCredit(uuid, options = {}) {
    return this._func("checkInitialCredit", uuid, options);
  }

  async registerUser(phone, publicKey, uuid, name, email, college, options = {}) {
    return this._func("registerUser", phone, publicKey, uuid, name, email, college, options);
  }

  async getManager(options = {}) {
    return this._func("manager", options);
  }

  async creditEther(uuid, options = {}) {
    return this._func("creditEther", uuid, options);
  }

  async checkUserByPhone(phone, options = {}) {
    return this._func("checkUserByPhone", phone, {});
  }

  async getScoresCount(options = {}) {
    return this._func("getScoresCount", options);
  }


  async scores(index, options = {}) {
    return this._func("scores", index, options);
  }

  async resetScores(options = {}) {
    return this._func("resetScores", options);
  }

  async winners(day, options = {}) {
    return this._func("winners", day, options);
  }

  async day(options = {}) {
    return this._func("day", options);
  }

  async getUserPoints(publicKey, options = {}) {
    return this._func("getUserPoints", publicKey, options);
  }

  async getTokens(addrezzes, options = {}) {
    return this._func("getTokens", addrezzes, options);
  }

  onUserRegistered(callback, options = {}) {
    return this._event("UserRegistred", callback, options);
  }
}
