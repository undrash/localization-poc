const electron      = require( "electron" );
const translate     = require( "./src/translate/translate-manager" );
const fs            = require( "fs" );
const languages     = require( "./src/translate/languages" );

const { app, BrowserWindow, ipcMain } = electron;

const LANGUAGE      = languages.Hungarian;
let mainWindow      = null;


let batchLength         = 0;
let processedBatches    = 0;

let FILE_SUBMITTED      = null;

app.on( "ready", () => {

    mainWindow = new BrowserWindow({});

    mainWindow.loadURL( `file://${__dirname}/index.html` );
    // mainWindow.openDevTools();
});


ipcMain.on( "json:submit", async (event, path) => {
    try {
        console.log( path );

        const fileContent = fs.readFileSync( path, "utf8" );

        let sourceJSON = null;

        try {
            sourceJSON = JSON.parse( fileContent );
        } catch (err) {
            console.error( "Invalid JSON provided. Bro." );
        }

        if ( ! sourceJSON ){
            console.error( "Oops. No source JSON." );
            return;
        }

        const strings = translate.getStringToTranslate( sourceJSON );

        console.log( strings );

        batchLength = strings.length;

        const result = await translate.translate( strings, LANGUAGE, statusUpdate );

        const translatedJSON = translate.replaceWithTranslatedValues( result, sourceJSON );

        mainWindow.webContents.send( "translate:success", translatedJSON );
    } catch (err) {
        mainWindow.webContents.send( "translate:error", err.message );
        console.log( err.message );
    }
});




ipcMain.on( "file:submit", (event, path) => {

    let sourceJSON = null;

    const fileContent = fs.readFileSync( path, "utf8" );

    try {
        sourceJSON = JSON.parse( fileContent );
    } catch (err) {
        mainWindow.webContents.send( "file:validate", false );
    }

    if ( ! sourceJSON ){
        mainWindow.webContents.send( "file:validate", false );
    } else {

        FILE_SUBMITTED = sourceJSON;

        mainWindow.webContents.send( "file:validate", true );
    }
});



ipcMain.on( "file:translate", async (event, language) => {
    try {

        const strings = translate.getStringToTranslate( FILE_SUBMITTED );

        console.log( strings );

        batchLength = strings.length;

        const result = await translate.translate( strings, language, statusUpdate );

        const translatedJSON = translate.replaceWithTranslatedValues( result, FILE_SUBMITTED );

        mainWindow.webContents.send( "translate:success", translatedJSON );
    } catch (err) {
        mainWindow.webContents.send( "translate:error", err.message );
        console.log( err.message );
    }
});



// function statusUpdate() {
//     mainWindow.webContents.send( "loading:status", { total: batchLength, processed: ++processedBatches } );
// }


function statusUpdate() {
    mainWindow.webContents.send( "loading:progress", { total: batchLength, processed: ++processedBatches } );
}