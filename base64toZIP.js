let aList = [];
let blobs = []; // Array to hold the Blob objects
var blobUrl = [];

function base64ToBlob(base64, contentType) {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}

// Audio Parse should be the array of base64 files

for (let i = 0;i<AudioParse.length;i++) {
    // Convert the Base64 string back to a Blob
    var contentType = AudioParse[i].split(",")[0].split(":")[1].split(";")[0];
    var myBlob = base64ToBlob(AudioParse[i], contentType);

    // Create a Blob URL and use it
    blobUrl[i] = URL.createObjectURL(myBlob);
    console.log(blobUrl[i]);
}

for (let i = 0; i < blobUrl.length; i++) {
    fetch(blobUrl[i])
        .then(response => response.blob())
        .then(blob => {
            blobs[i] = blob; // Store the Blob in the array
            // Check if all Blobs have been fetched
            if (blobs.length === blobUrl.length && blobs.every(b => b !== undefined)) {
                createZip(blobs);
            }
        });
}

function createZip(blobs) {
    var zip = new JSZip();
    for(let i = 0; i < blobs.length; i++){
        zip.file(`recording-${i}.mp3`, blobs[i]); // Add each Blob to the ZIP file
    }
    
    // Generate the ZIP file and trigger the download
    zip.generateAsync({ type: 'blob' }).then((zipBlob) => {
        const zipUrl = URL.createObjectURL(zipBlob);
        let a = document.createElement('a');
        a.href = zipUrl;
        a.download = `recordings-${SubID}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(zipUrl); // Clean up the Blob URL
    });
}