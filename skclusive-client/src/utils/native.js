export default function native(type, data) {
  try {
    window.webkit.messageHandlers.viewHandler.postMessage({ type, data });
  } catch (e) {
    console.error(`calling native failed for data`, data);
  }
  try{
    window.android.messageHandler(type, JSON.stringify(data));
  } catch (e){
    console.error(`calling android failed`);
  }
}
