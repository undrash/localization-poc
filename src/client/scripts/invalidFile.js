

const invalidFileContainer  = document.getElementById( "error-invalid-file-container" );
const errorTryAgainBtn      = document.getElementById( "error-try-again-btn" );


errorTryAgainBtn.addEventListener( "click", () => {
    invalidFileContainer.style.display  = "none";
    uploadFileContainer.style.display   = "block";
});
