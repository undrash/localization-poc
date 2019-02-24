

const invalidFileContainer  = document.getElementById( "error-invalid-file-container" );
const errorTryAgainBtn      = document.getElementById( "error-try-again-btn" );
const invalidFileBackBtn    = document.getElementById( "invalid-file-back-btn" );

errorTryAgainBtn.addEventListener( "click", () => {
    invalidFileContainer.style.display  = "none";
    uploadFileContainer.style.display   = "block";
});

invalidFileBackBtn.addEventListener( "click", () => {
    invalidFileContainer.style.display  = "none";
    uploadFileContainer.style.display   = "block";
});