const fs = require( "fs" );
const stringsObj = JSON.parse( fs.readFileSync( "strings.json", "utf8" ) );


let strings = [];


for ( let key in stringsObj ) {
    if ( stringsObj.hasOwnProperty( key ) ) {
        strings.push( '"' + stringsObj[ key ] + '"' );
    }
}

fs.writeFileSync( "strings.txt", strings );

console.log( strings );


