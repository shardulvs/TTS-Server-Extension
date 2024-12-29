document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.getElementById("urlInput");
  const saveButton = document.getElementById("saveButton");
  const statusMessage = document.getElementById("statusMessage");

  // Load the last saved URL
  chrome.storage.sync.get("serverUrl", (data) => {
    if (data.serverUrl) {
      urlInput.value = data.serverUrl;
    }
  });

  // Save the URL to Chrome storage
  saveButton.addEventListener("click", () => {
    const serverUrl = urlInput.value.trim();
    if (serverUrl) {
      chrome.storage.sync.set({ serverUrl }, () => {
        statusMessage.textContent = "URL saved successfully!";
        setTimeout(() => {
          statusMessage.textContent = "";
        }, 2000);
      });
    }
  });
});
