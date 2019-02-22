
const uploadFileContainer   = document.getElementById( "upload-file-container" );
const uploadFileDropZone    = document.getElementById( "upload-file-drop-zone" );
const uploadFileInput       = document.getElementById( "upload-file-input" );






/** Event listeners */

uploadFileInput.addEventListener( "change", () => {

    const { path } = uploadFileInput.files[0];

    ipcRenderer.send( "file:submit", path );
});



uploadFileDropZone.addEventListener( "dragover", (e) => {
    e.preventDefault();
});



uploadFileDropZone.addEventListener( "dragleave", (e) => {
    e.preventDefault();
});



uploadFileDropZone.addEventListener( "drop", (e) => {
    e.preventDefault();

    const { path } = e.dataTransfer.files[0];

    ipcRenderer.send( "file:submit", path );
});


/** Electron listeners */

ipcRenderer.on( "file:validate", (event, isValid) => {

    uploadFileContainer.style.display           = "none";

    if ( isValid ) {
        selectLanguageContainer.style.display   = "block";
    } else {
        invalidFileContainer.style.display      = "block";
    }
});




