const electron      = require( "electron" );
const translate     = require( "./src/translate/translate-manager" );
const fs            = require( "fs" );
const path          = require( "path" );
const languages     = require( "./src/translate/languages" );

const { app, BrowserWindow, ipcMain, Tray, Menu } = electron;

const LANGUAGE      = languages.Hungarian;
let mainWindow      = null;
let tray            = null;

let batchLength         = 0;
let processedBatches    = 0;

let FILE_SUBMITTED      = null;

app.on( "ready", () => {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    mainWindow.loadURL( `file://${__dirname}/index.html` );
    // mainWindow.openDevTools();


    tray = new Tray( `${__dirname}/src/client/style/img/icons/windows-icon.png` );

    tray.setToolTip( "localization app" );


    tray.on( "click", () => {

        if ( mainWindow.isVisible() ) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }

    });

    tray.on( "right-click", () => {

        const menuConfig = Menu.buildFromTemplate([
            {
                label: "Quit",
                click: () => app.quit()
            }
        ]);

        tray.popUpContextMenu( menuConfig );

    });
});

app.on( "browser-window-created", (e, window) => {
    window.setMenu(null);
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

        batchLength         = strings.length;
        processedBatches    = 0;

        const result = await translate.translate( strings, LANGUAGE, statusUpdate );

        const translatedJSON = translate.replaceWithTranslatedValues( result, sourceJSON );

        mainWindow.webContents.send( "translate:success", translatedJSON );
    } catch (err) {
        mainWindow.webContents.send( "translate:error", err.message );
        console.log( err.message );
    }
});




ipcMain.on( "file:submit", (event, filePath) => {

    let sourceJSON = null;

    const fileContent = fs.readFileSync( filePath, "utf8" );
    const fileName = path.parse( filePath ).base;

    try {
        sourceJSON = JSON.parse( fileContent );
    } catch (err) {
        mainWindow.webContents.send( "file:validate", false );
    }

    if ( ! sourceJSON ){
        mainWindow.webContents.send( "file:validate", false );
    } else {

        FILE_SUBMITTED = sourceJSON;

        mainWindow.webContents.send( "file:title", fileName );
        mainWindow.webContents.send( "file:validate", true );
    }
});



ipcMain.on( "file:translate", async (event, language) => {
    try {

        const strings = translate.getStringToTranslate( FILE_SUBMITTED );

        console.log( strings );

        batchLength         = strings.length;
        processedBatches    = 0;

        // /** TESTING */
        // const interval = setInterval( () => {
        //
        //     if ( processedBatches < batchLength ) {
        //         statusUpdate();
        //     } else {
        //         // mainWindow.webContents.send( "translate:success", { "translation": "success" } );
        //         clearInterval( interval );
        //     }
        //
        // }, 2500 );



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