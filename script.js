//TODO: Suspend audio while power is off.
//TODO: Allow user to toggle master filter on/off.
//TODO: Settings for pads (backpanel ui).
//TODO: Keyboard input to trigger pads.
//TODO: Power on sound.
//TODO: Trigger pad down image on click, release on mouseUp
//TODO: ADSR Envelopes
//TODO: Mobile support & Browser compatibility

//Sample filepaths
const kickPath = 'audio/BoomBapKick.wav';
const snarePath = 'audio/BoomBapSnare.wav';
const hihatPath = 'audio/BoomBapHiHat.wav';
const percPath = 'audio/BoomBapPerc.wav';

//Master filter
const mFilterController = document.getElementById('mFilterBand');
var mFilterFrequency = 725;
mFilterController.addEventListener('input', function() {
    mFilterFrequency = Number(this.value);
}, false);

//Power Button
//User gesture to enable audio in browser
const powerButton = document.getElementById('powerButton');
var hasPower = false;
var isInit = false;

powerButton.addEventListener('click', function() {
    if(!isInit){
        initializeProgram();
        isInit = true;
    }
    if(hasPower){
        powerButton.setAttribute("style", "background-image: url('image/ui/front/powerbutton-off.png')");
        hasPower = false;
    } else {
        powerButton.setAttribute("style", "background-image: url('image/ui/front/powerbutton.png')");
        hasPower = true;
    }
}, false);

//References to pad button DOM elements
const padButtonA = document.getElementById('padButtonA');
const padButtonB = document.getElementById('padButtonB');
const padButtonC = document.getElementById('padButtonC');
const padButtonD = document.getElementById('padButtonD');

function initializeProgram(){
    //cross browser audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    //Create bandpass for master filter
    var bandpass = audioContext.createBiquadFilter();
    bandpass.type = 'bandpass';

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
        sampleArray[1]= await getFile(audioContext, snarePath);
        console.log("snare sample loaded successfully");
        sampleArray[2]= await getFile(audioContext, hihatPath);
        console.log("hihat sample loaded successfully");
        sampleArray[3]= await getFile(audioContext, percPath);
        console.log("perc sample loaded successfully");
        return sampleArray;
    }




    setupSample()
    .then((sampleArray) => {

        function playSample(audioContext, audioBuffer) {
            const sampleSource = audioContext.createBufferSource();
            sampleSource.buffer = audioBuffer;
            bandpass.frequency.value = mFilterFrequency;
            sampleSource.connect(bandpass).connect(audioContext.destination)
            sampleSource.start();
            return sampleSource;
        }

        padButtonA.addEventListener('click', function() {
            playSample(audioContext, sampleArray[0]);
        }, false);
        padButtonB.addEventListener('click', function() {
            playSample(audioContext, sampleArray[1]);
        }, false);
        padButtonC.addEventListener('click', function() {
            playSample(audioContext, sampleArray[2]);
        }, false);
        padButtonD.addEventListener('click', function() {
            playSample(audioContext, sampleArray[3]);
        }, false);
    });

}