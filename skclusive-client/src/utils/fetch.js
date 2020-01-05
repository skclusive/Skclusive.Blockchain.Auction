// @ts-check

import Fetcher from "./Fetcher";

const {
  location: { protocol, hostname, port }
  // @ts-ignore
} = window.document;

const base = `${protocol}//${hostname}:${port}`;

const fetch = new Fetcher(base);

export default fetch;
