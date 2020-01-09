// @ts-check

export default class BidStorage {
  static key = "auction-bid-storage";

  static get stored() {
    // @ts-ignore
    const json = localStorage.getItem(BidStorage.key) || "{}";
    return JSON.parse(json);
  }

  static set stored(value) {
    // @ts-ignore
    localStorage.setItem(BidStorage.key, JSON.stringify(value));
  }

  static getBids(auction) {
    return [...(BidStorage.stored[auction] || [])];
  }

  static addBid(auction, bid) {
    const bids = BidStorage.getBids(auction);
    const stored = BidStorage.stored;
    stored[auction] = [...bids, bid];
    BidStorage.stored = stored;
  }
}
