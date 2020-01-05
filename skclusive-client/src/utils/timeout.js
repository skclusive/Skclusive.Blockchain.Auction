// @ts-check

export default function timeout(callback, time) {
  const id = setTimeout(callback, time);
  return () => {
    clearTimeout(id);
  };
}
