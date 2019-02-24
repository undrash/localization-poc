
const ProgressBar           = require( "progressbar.js" );

const loadingContainer   = document.getElementById( "loading-container" );
const progressBarContainer      = document.getElementById( "progress-bar-container" );
const progressBarLabel          = document.getElementById( "progress-bar-label" );



const progressBar = new ProgressBar.Circle( progressBarContainer, {
    color: '#FFEA82',
    trailColor: '#0e1022',
    trailWidth: 6,
    duration: 1400,
    easing: 'linear',
    strokeWidth: 6,
    from: { color: '#00b9ff', a:0 },
    to: { color: '#0087ff', a:1 },
    // Set default step function for all animate calls
    step: function(state, circle) {
        circle.path.setAttribute( 'stroke', state.color );
    }
});


function resetLoading() {
    progressBar.set( 0 );
    progressBarLabel.innerText = "0%";
}


let interval = null;

function animateIncrement(percent, percentCompleted, pause) {
    interval = setInterval( function () {

        if ( percent < percentCompleted ) {
            percent++;

            progressBarLabel.innerText = percent.toString() + "%";


        } else {
            clearInterval( interval );
        }

    }, pause );
}



/** Electron listeners */

ipcRenderer.on( "loading:progress", (event, progress) => {

    console.log( progress );

    const { total, processed } = progress;

    console.log( total, processed );

    const percentCompleted = parseInt( processed / total * 100 );

    clearInterval( interval );

    const percent = parseInt( progressBarLabel.innerText );

    animateIncrement(percent, percentCompleted, 25);

    progressBar.animate( percentCompleted / 100 );
});


