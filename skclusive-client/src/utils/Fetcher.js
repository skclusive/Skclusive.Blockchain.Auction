// @ts-check

import fetch from "cross-fetch";

export default class Fetcher {
  constructor(base = "") {
    this.base = base;
  }

  async fetch(path, init) {
    const response = await fetch(`${this.base}${path}`, init);
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  }

  async getJson(path) {
    return this.fetch(path, {
      headers: {
        Accept: "application/json"
      },
      method: "GET"
    });
  }

  async postJson(path, data) {
    return this.fetch(path, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(data)
    });
  }
}
