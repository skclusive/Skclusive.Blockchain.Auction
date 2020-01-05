// @ts-check

export default function groupby(list, keyer, valuer) {
  return list.reduce((group, item) => {
    const key = keyer(item);
    const value = valuer ? valuer(item) : item;
    group[key] = [...(group[key] || []), value];
    return group;
  }, {});
}
