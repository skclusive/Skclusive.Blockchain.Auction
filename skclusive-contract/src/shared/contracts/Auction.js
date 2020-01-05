// @ts-check

import abi from "ethereumjs-abi";

// @ts-ignore
import auction from "../artifacts/Auction.json";

import Contract from "./Contract";

import mapper from "../utils/mapper";

export default class Auction extends Contract {
  constructor(binary, web3, options = {}) {
    super(binary, web3, options);
  }

  static create(web3 = undefined, options = undefined) {
    return new Auction(auction, web3, options);
  }

  static at(address, web3 = undefined, options = undefined) {
    return new Auction({ ...auction, address }, web3, options);
  }

  onBidAdded(callback, options = {}) {
    return this._event("BidAdded", callback, options);
  }

  onAuctionEnded(callback, options = {}) {
    return this._event(
      "AuctionEnded",
      auction =>
        callback({
          ...auction,
          hasEnded: true
        }),
      options
    );
  }

  onHighestBidding(callback, options = {}) {
    return this._event("HighestBidding", callback, options);
  }

  async doBid(value, fake, secret, deposit, options) {
    const blindedBid = this.web3.utils.keccak256(
      abi.solidityPack(["uint", "bool", "bytes32"], [value, fake, secret])
    );
    return this.bid(blindedBid, { ...options, value: deposit });
  }

  async bid(blindedBid, options = {}) {
    return this._func("bid", blindedBid, options);
  }

  async reveal(values, fakes, secrets, options = {}) {
    return this._func("reveal", values, fakes, secrets, options);
  }

  async withdraw(options = {}) {
    return this._func("withdraw", options);
  }

  async auctionEnd(options = {}) {
    return this._func("auctionEnd", options);
  }

  async getState(options = {}) {
    const state = await this._func("getState", options);
    const { addrezz: address, ...others } = state;
    return { ...others, address };
  }

  async getStateWithBids(options = {}) {
    const state = await this._func("getStateWithBids", options);
    const { bidders, blindedBids, times, addrezz: address, ...others } = state;
    const bids = this.toBids(bidders, blindedBids, times);
    return { ...others, address, bids };
  }

  async getAllBids(options = {}) {
    const bids = await this._func("getAllBids", options);
    const { bidders, blindedBids, times } = bids;
    return this.toBids(bidders, blindedBids, times);
  }

  async getAllBidders(options = {}) {
    return await this._func("getAllBidders", options);
  }

  toBids(bidders, blindedBids, times) {
    return mapper(
      { bidders, blindedBids, times },
      {
        bidders: "bidder",
        blindedBids: "blindedBid",
        times: "time"
      }
    );
  }
}
