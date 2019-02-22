const selectLanguageContainer   = document.getElementById( "select-language-container" );
const selectLanguage            = document.getElementById( "select-language" );
const translateButton           = document.getElementById( "translate-button" );



translateButton.addEventListener( "click", () => {
    const language = selectLanguage.options[ selectLanguage.selectedIndex ].value;

    if ( ! language ) return console.error( "Invalid language." );

    ipcRenderer.send( "file:translate", language );

    selectLanguageContainer.style.display   = "none";
    loadingContainer.style.display          = "block";
});