

const automation    = require( "./translate" );
const fs            = require( "fs" );
const languages     = require( "./languages" );


const LANGUAGE      = languages.Hungarian;



/**
 * Prepares the string that will be translated
 * @return {string[]}
 */
function getStringToTranslate() {

    let result = [];

    const stringsObj = JSON.parse( fs.readFileSync( "source.json", "utf8" ) );

    let strings = [];

    const stringLimit = 100; // Maximum allowed translations per batch
    let stringCount = 0;

    for ( let key in stringsObj ) {
        if ( stringsObj.hasOwnProperty( key ) ) {
            strings.push( '"' + stringsObj[ key ] + '"' );

            stringCount++;

            if ( stringCount >= stringLimit ) {
                result.push( strings.join( "; " ) );
                strings = [];
                stringCount = 0;
            }
        }
    }

    if ( stringCount > 0 ) result.push( strings.join( "; " ) );


    return result;

}



const translate = async (strings) => {

    let result = "";

    for ( let string of strings ) {

        result += await automation.translate( string, LANGUAGE );
    }

    writeResult( result );
};



function writeResult(res) {

    const stringsObj = JSON.parse( fs.readFileSync( "source.json", "utf8" ) );

    const translatedStrings = res.toString().replace( /['"]+/g, '' ).split( '; ' );

    for ( let key in stringsObj ) {
        if ( stringsObj.hasOwnProperty( key ) ) {
            stringsObj[ key ] = translatedStrings[ Object.keys( stringsObj ).indexOf( key ) ];
        }
    }

    fs.writeFileSync( 'translated.json', JSON.stringify( stringsObj, null, 4 ) );

    console.log( stringsObj );
}



/** Get the string */
const strings = getStringToTranslate();

/** Get the translations - ASYNC */
translate( strings )
    .then( () => console.info( "Translation finished!" ) )
    .catch( err => console.error( err ) );





// /**
//  * Perform the translation
//  */
// automation.translate( string, LANGUAGE ).then( res => {
//
//     const stringsObj = JSON.parse( fs.readFileSync( "source.json", "utf8" ) );
//
//     const translatedStrings = res.replace( /['"]+/g, '' ).split( '; ' );
//
//     for ( let key in stringsObj ) {
//         if ( stringsObj.hasOwnProperty( key ) ) {
//             stringsObj[ key ] = translatedStrings[ Object.keys( stringsObj ).indexOf( key ) ];
//         }
//     }
//
//     fs.writeFileSync( 'translated.json', JSON.stringify( stringsObj, null, 4 ) );
//
//     console.log( stringsObj );
//
// });




