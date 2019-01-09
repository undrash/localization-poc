

const automation    = require( "./translate" );
const fs            = require( "fs" );
const languages     = require( "./languages" );


const LANGUAGE      = languages.Hungarian;



/**
 * Prepares the string that will be translated
 * @return {string}
 */
function getStringToTranslate() {

    const stringsObj = JSON.parse( fs.readFileSync( "source.json", "utf8" ) );
    let strings = [];


    for ( let key in stringsObj ) {
        if ( stringsObj.hasOwnProperty( key ) ) {
            strings.push( '"' + stringsObj[ key ] + '"' );
        }
    }

    return strings.join( "; " );

}



/** Get the string */
const string = getStringToTranslate();



/**
 * Perform the translation
 */
automation.translate( string, LANGUAGE ).then( res => {

    const stringsObj = JSON.parse( fs.readFileSync( "source.json", "utf8" ) );

    const translatedStrings = res.replace( /['"]+/g, '' ).split( '; ' );

    for ( let key in stringsObj ) {
        if ( stringsObj.hasOwnProperty( key ) ) {
            stringsObj[ key ] = translatedStrings[ Object.keys( stringsObj ).indexOf( key ) ];
        }
    }

    fs.writeFileSync( 'translated.json', JSON.stringify( stringsObj, null, 4 ) );

    console.log( stringsObj );

});




