const fs = require( "fs" );
const stringsObj = JSON.parse( fs.readFileSync( "strings.json", "utf8" ) );


let strings = [];


for ( let key in stringsObj ) {
    if ( stringsObj.hasOwnProperty( key ) ) {
        strings.push( '"' + stringsObj[ key ] + '"' );
    }
}


const translatedStringsTXT = fs.readFileSync( "translatedStrings.txt", "utf8" );


const translatedStrings = translatedStringsTXT.replace( /['"]+/g, '' ).split( ',' );


for ( let key in stringsObj ) {
    if ( stringsObj.hasOwnProperty( key ) ) {
        stringsObj[ key ] = translatedStrings[ Object.keys( stringsObj ).indexOf( key ) ];
    }
}


fs.writeFileSync( 'translatedStrings.json', JSON.stringify( stringsObj, null, 4 ) );


console.log( stringsObj );

