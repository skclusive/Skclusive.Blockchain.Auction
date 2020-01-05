// @ts-check

export default function mapper(mapvalues, props) {
  const keys = Object.keys(props).filter(key => key in mapvalues);
  const ids = mapvalues[keys[0]];
  return ids.map((_, index) => {
    return keys.reduce((map, key) => {
      const value = mapvalues[key][index];
      map[props[key]] = value;
      return map;
    }, {});
  });
}
