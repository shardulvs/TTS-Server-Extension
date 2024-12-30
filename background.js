// Create context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToTTSServer",
    title: "Send to TTS Server",
    contexts: ["selection"],
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sendToTTSServer" && info.selectionText) {
    text_to_speech(info.selectionText);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "speak") {
    text_to_speech(message.text);
  }
});

function text_to_speech(text) {
  // Get the saved URL
  chrome.storage.sync.get("serverUrl", (data) => {
    const serverUrl = data.serverUrl;
    if (!serverUrl) {
      console.log(
        "TTS Server URL is not set. Please set it in the extension popup.",
      );
      return;
    }

    // Send the selected text to the server
    fetch(serverUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: text,
    })
      .then((response) => {
        if (response.ok) {
          console.log("Text sent successfully!");
        } else {
          console.log("Failed to send text. Check the server.");
        }
      })
      .catch((error) => {
        console.log(`Error: ${error.message}`);
        console.log(`Tried to fetch from: ${serverUrl}`);
      });
  });
}
