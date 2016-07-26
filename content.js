document.addEventListener("mouseup", () => {
    var selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        chrome.runtime.sendMessage({selectedText: selectedText}, (response) => {
            if (response) {
                console.log(response);
            } else {
                // console.error(chrome.runtime.lastError);
            }
        });

    }
}, false);
