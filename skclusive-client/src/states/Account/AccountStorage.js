// @ts-check

export default class AccountStorage {
  static key = "registered-account";

  static get stored() {
    // @ts-ignore
    const json = localStorage.getItem(AccountStorage.key) || "{}";
    return JSON.parse(json);
  }

  static set stored(value) {
    // @ts-ignore
    localStorage.setItem(AccountStorage.key, JSON.stringify(value));
  }

  static clear() {
    localStorage.removeItem(AccountStorage.key);
  }
}
