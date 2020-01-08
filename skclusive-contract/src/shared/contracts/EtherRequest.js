// @ts-check

// @ts-ignore
import etherRequest from "../artifacts/EtherRequest.json";

import Contract from "./Contract";

import mapper from "../utils/mapper";

export default class EtherRequest extends Contract {
  constructor(binary, web3, options = {}) {
    super(binary, web3, options);
  }

  static create(web3 = undefined, options = undefined) {
    return new EtherRequest(etherRequest, web3, options);
  }

  static at(address, web3 = undefined, options = undefined) {
    return new EtherRequest({ ...etherRequest, address }, web3, options);
  }

  async requestEther(uuid, options = {}) {
    return this._func("requestEther", uuid, options);
  }

  async acceptRequest(addrezz, uuid, options = {}) {
    return this._func("acceptRequest", addrezz, uuid, options);
  }

  async getUsers(options = {}) {
    const users = await this._func("getUsers", options);
    return mapper(users, {
      addrezzes: "addrezz",
      names: "name",
      uuids: "uuid",
      phones: "phone"
    });
  }

  async checkRequestPending(address, options = {}) {
    return this._func("checkRequestPending", address, options);
  }
}
