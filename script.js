//Sample filepaths
const kickPath = 'audio/2infamouz-bassdrum.wav';
const kickPath2 = 'audio/2infamouz-bassdrum2.wav';
//User gesture to enable audio in browser
const allowAudioButton = document.getElementById('audioInit');

audioInit.addEventListener('click', function() {
    initializeProgram();
}, false);

//References to pad button DOM elements
const padButtonA = document.getElementById('padButtonA');
const padButtonB = document.getElementById('padButtonB');

function initializeProgram(){
    //cross browser audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    async function getFile(audioContext, filepath) {
        const response = await fetch(filepath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }
    
    async function setupSample() {
        var sampleArray = new Array();
        sampleArray[0] = await getFile(audioContext, kickPath);
        console.log("kick sample loaded successfully");
        sampleArray[1]= await getFile(audioContext, kickPath2);
        console.log("kick2 sample loaded successfully");
        return sampleArray;
    }

    setupSample()
    .then((sampleArray) => {

        function playSample(audioContext, audioBuffer) {
            const sampleSource = audioContext.createBufferSource();
            sampleSource.buffer = audioBuffer;
            sampleSource.connect(audioContext.destination)
            sampleSource.start();
            return sampleSource;
        }

        padButtonA.addEventListener('click', function() {
            playSample(audioContext, sampleArray[0]);
        }, false);
        padButtonB.addEventListener('click', function() {
            playSample(audioContext, sampleArray[1]);
        }, false);
    });

}