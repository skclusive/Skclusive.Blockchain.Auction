// @ts-check

import produce from "immer";

export default function mutator(mutor) {
  return state => produce(state, mutor);
}
