function injectTheScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        
        chrome.tabs.executeScript(tabs[0].id, { file: "content.js" });
    });
}

document.getElementById('clickactivity').addEventListener('click', injectTheScript);
//on clicking the button we will inject the content.js file as script.