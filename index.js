const electron      = require( "electron" );
const translate     = require( "./src/translate-manager" );
const fs            = require( "fs" );
const languages     = require( "./src/languages" );

const { app, BrowserWindow, ipcMain } = electron;

const LANGUAGE      = languages.Hungarian;
let mainWindow      = null;

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

        const result = await translate.translate( strings, LANGUAGE );

        const translatedJSON = translate.replaceWithTranslatedValues( result, sourceJSON );

        mainWindow.webContents.send( "translate:success", translatedJSON );
    } catch (err) {
        mainWindow.webContents.send( "translate:error", err.message );
        console.log( err.message );
    }
});