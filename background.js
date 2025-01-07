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
    text_to_speech(info.selectionText, tab.id);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "speak") {
    text_to_speech(message.text, sender.tab.id);
  }
});

function text_to_speech(text, tabId) {
  // Get the saved URL
  chrome.storage.sync.get("serverUrl", async (data) => {
    const serverUrl = data.serverUrl;
    if (!serverUrl) {
      console.log(
        "TTS Server URL is not set. Please set it in the extension popup.",
      );
      return;
    }
    try {
      // Send the selected text to the server
      const response = await fetch(serverUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: text,
      });

      if (!response.ok) {
        console.log("Failed to send text. Check the server.");
        throw new Error("Server error");
      }

      const audioBlob = await response.blob();
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = function () {
        const base64Audio = reader.result;
        chrome.tabs.sendMessage(tabId, {
          action: "playAudio",
          audioData: base64Audio,
        });
        console.log("Audio data sent to content script!");
      };
    } catch (error) {
      console.log(`Error: ${error.message}`);
      console.log(`Tried to fetch from: ${serverUrl}`);
    }
  });
}
