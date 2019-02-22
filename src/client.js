const electron = require( "electron" );

const { ipcRenderer } = electron;


const fileSelectContainer = document.getElementById( "file-select-container" );
const loadingContainer = document.getElementById( "loading-container" );
const downloadFileContainer = document.getElementById( "download-file-container" );
let downloadFileBtn = document.getElementById( "download-file" );

document.querySelector( "input" ).addEventListener( "change", (event) => {

    const { path } = document.querySelector( "input" ).files[0];

    ipcRenderer.send( "json:submit", path );

    fileSelectContainer.style.display = "none";
    loadingContainer.style.display = "block";

});


ipcRenderer.on( "json:translated", (event, result) => {

    loadingContainer.style.display = "none";
    downloadFileContainer.style.display = "block";

    download(JSON.stringify( result, null, 4 ), "translated.json", "application/json")
});


function download(data, filename, type) {
    let file = new Blob([data], {type: type});

    downloadFileBtn.href = URL.createObjectURL(file);
    downloadFileBtn.download = filename;
}


/** DRAG AND DROP */

const dropzone = document.getElementById( "dropzone" );

dropzone.addEventListener( "dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add( "dragover" );
});

dropzone.addEventListener( "dragleave", (e) => {
    e.preventDefault();
    dropzone.classList.remove( "dragover" );
});

dropzone.addEventListener( "drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove( "dragover" );

    const { path } = e.dataTransfer.files[0];

    ipcRenderer.send( "json:submit", path );

    fileSelectContainer.style.display = "none";
    loadingContainer.style.display = "block";
});