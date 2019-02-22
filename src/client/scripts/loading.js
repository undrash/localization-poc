
const loadingContainer      = document.getElementById( "loading-container" );
const progressBarContainer  = document.getElementById( "progress-bar-container" );
const progressBar           = document.getElementById( "progress-bar" );


/** Electron listeners */

ipcRenderer.on( "loading:progress", (event, progress) => {

    console.log( progress );

    const { total, processed } = progress;

    console.log( total, processed );

    const percentCompleted = parseInt( processed / total * 100 );

    console.log( percentCompleted );

    progressBar.style.width = percentCompleted + "%";
});
