//TODO: Suspend audio while power is off.
//TODO: Allow user to toggle master filter on/off.
//TODO: Settings for pads (backpanel ui).
//TODO: Power on sound.
//TODO: ADSR Envelopes
//TODO: Mobile support & Browser compatibility

//Sample filepaths
const kickPath = 'audio/BoomBapKick.wav';
const snarePath = 'audio/BoomBapSnare.wav';
const hihatPath = 'audio/BoomBapHiHat.wav';
const percPath = 'audio/BoomBapPerc.wav';

//Master filter control
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
        //store decoded buffers in array
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
        //Mousedown events for pads
        padButtonA.addEventListener('mousedown', function() {
            padButtonA.setAttribute("style", "background-image: url('image/ui/front/drumpad-press.png')");
            playSample(audioContext, sampleArray[0]);
        }, false);
        padButtonB.addEventListener('mousedown', function() {
            padButtonB.setAttribute("style", "background-image: url('image/ui/front/drumpad-press.png')");
            playSample(audioContext, sampleArray[1]);
        }, false);
        padButtonC.addEventListener('mousedown', function() {
            padButtonC.setAttribute("style", "background-image: url('image/ui/front/drumpad-press.png')");
            playSample(audioContext, sampleArray[2]);
        }, false);
        padButtonD.addEventListener('mousedown', function() {
            padButtonD.setAttribute("style", "background-image: url('image/ui/front/drumpad-press.png')");
            playSample(audioContext, sampleArray[3]);
        }, false);

        //Mouseup events for pads
        padButtonA.addEventListener('mouseup', function() {
            padButtonA.setAttribute("style", "background-image: url('image/ui/front/drumpad.png')");
        }, false);
        padButtonB.addEventListener('mouseup', function() {
            padButtonB.setAttribute("style", "background-image: url('image/ui/front/drumpad.png')");
        }, false);
        padButtonC.addEventListener('mouseup', function() {
            padButtonC.setAttribute("style", "background-image: url('image/ui/front/drumpad.png')");
        }, false);
        padButtonD.addEventListener('mouseup', function() {
            padButtonD.setAttribute("style", "background-image: url('image/ui/front/drumpad.png')");
        }, false);

        //Keyboard events (key down)
        window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }
        switch (event.key) {
        case "ArrowDown":
        case "s":
            // code for "down arrow" key press.
            padButtonA.setAttribute("style", "background-image: url('image/ui/front/drumpad-press.png')");
            playSample(audioContext, sampleArray[0]);
            break;
        case "ArrowUp":
        case "w":
            // code for "up arrow" key press.
            padButtonB.setAttribute("style", "background-image: url('image/ui/front/drumpad-press.png')");
            playSample(audioContext, sampleArray[1]);
            break;
        case "ArrowLeft":
        case "a":
            // code for "left arrow" key press.
            padButtonC.setAttribute("style", "background-image: url('image/ui/front/drumpad-press.png')");
            playSample(audioContext, sampleArray[2]);
            break;
        case "ArrowRight":
        case "d":
            // code for "right arrow" key press.
            padButtonD.setAttribute("style", "background-image: url('image/ui/front/drumpad-press.png')");
            playSample(audioContext, sampleArray[3]);
            break;
        default:
            return; // Quit when this doesn't handle the key event.
        }
    
            // Cancel the default action to avoid it being handled twice
            event.preventDefault();
        }, true);
        // the last option dispatches the event to the listener first,
        // then dispatches event to window

        //Keyboard events (key up)
        window.addEventListener("keyup", function (event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }
        switch (event.key) {
        case "ArrowDown":
        case "s":
            // code for "down arrow" key press.
            padButtonA.setAttribute("style", "background-image: url('image/ui/front/drumpad.png')");
            break;
        case "ArrowUp":
        case "w":
            // code for "up arrow" key press.
            padButtonB.setAttribute("style", "background-image: url('image/ui/front/drumpad.png')");
            break;
        case "ArrowLeft":
        case "a":
            // code for "left arrow" key press.
            padButtonC.setAttribute("style", "background-image: url('image/ui/front/drumpad.png')");
            break;
        case "ArrowRight":
        case "d":
            // code for "right arrow" key press.
            padButtonD.setAttribute("style", "background-image: url('image/ui/front/drumpad.png')");
            break;
        default:
            return; // Quit when this doesn't handle the key event.
        }
    
            // Cancel the default action to avoid it being handled twice
            event.preventDefault();
        }, true);
        // the last option dispatches the event to the listener first,
        // then dispatches event to window

    });
}