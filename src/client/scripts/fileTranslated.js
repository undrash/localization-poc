

const fileTranslatedContainer   = document.getElementById( "file-translated-container" );
const saveFileBtn               = document.getElementById( "save-file-btn" );
const fileTranslatedBackBtn     = document.getElementById( "file-translate-back-btn" );

function download(data, filename, type) {
    let file                = new Blob([data], {type: type});

    saveFileBtn.href        = URL.createObjectURL(file);
    saveFileBtn.download    = filename;
}


/** Event listeners */

fileTranslatedBackBtn.addEventListener( "click", () => {
    fileTranslatedContainer.style.display   = "none";
    uploadFileContainer.style.display       = "block";
    resetLoading();
});


/** Electron listeners */

ipcRenderer.on( "translate:success", (event, result) => {
    loadingContainer.style.display          = "none";
    fileTranslatedContainer.style.display   = "block";

    download( JSON.stringify( result, null, 4 ), "translated.json", "application/json")
});



ipcRenderer.on( "translate:error", (event, message) => {
    loadingContainer.style.display          = "none";
    fileTranslatedContainer.style.display   = "block";

    fileTranslatedContainer.innerHTML       = "";
    fileTranslatedContainer.innerText       = message;
});


