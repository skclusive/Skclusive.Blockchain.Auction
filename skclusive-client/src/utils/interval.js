// @ts-check

export default function interval(callback, time) {
  const id = setInterval(callback, time);
  return () => {
    clearInterval(id);
  };
}
