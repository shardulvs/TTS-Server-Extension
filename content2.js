// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "playAudio") {
    // Convert base64 back to blob
    fetch(message.audioData)
      .then((res) => res.blob())
      .then((blob) => {
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);

        audio
          .play()
          .then(() => {
            console.log("Audio playing successfully");
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
          });

        // Clean up the URL object after the audio finishes playing
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
        };
      })
      .catch((error) => {
        console.error("Error converting audio data:", error);
      });
  }
});
console.log("listener is listening");
