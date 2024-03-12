/*
note: maybe we should use this instead:
https://developer.chrome.com/docs/extensions/develop/concepts/messaging?hl=fr

var port = chrome.runtime.connect({name: "knockknock"});
port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(function(msg) {
  if (msg.question === "Who's there?")
    port.postMessage({answer: "Madame"});
  else if (msg.question === "Madame who?")
    port.postMessage({answer: "Madame... Bovary"});
});
*/

export async function sendMessage<T, U>(data: T): Promise<U> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
      const tab = tabs[0]
  
      if (tab.id) {
        const result = await chrome.tabs.sendMessage<T, U>(
          tab.id,
          data
        )
        console.log("sendMessage: got a result!", result)
        resolve(result)
      }
    })
  })
}