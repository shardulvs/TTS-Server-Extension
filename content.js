const speakButtonHTML = `[<a id="tts_btn">speak</a>]`;
const btns = document.querySelectorAll(".bz_comment_number");
btns.forEach((btn) => {
  btn.innerHTML += speakButtonHTML;
});
document.querySelectorAll("#tts_btn").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const textElement =
      event.target.parentElement.parentElement.parentElement.querySelector(
        ".bz_comment_text",
      );
    const selectedText = textElement.innerText;
    highlight(textElement);
    chrome.runtime.sendMessage({ action: "speak", text: selectedText });
  });
});
function highlight(element) {
  element.style.backgroundColor = "yellow";
  setTimeout(() => {
    element.style.backgroundColor = "";
  }, 300);
}
