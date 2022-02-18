//TODO: Allow user to toggle master filter on/off.
//TODO: Power on sound.

//Sample filepaths
const kickPath = 'audio/BoomBapKick.wav';
const snarePath = 'audio/BoomBapSnare.wav';
const hihatPath = 'audio/BoomBapHiHat.wav';
const percPath = 'audio/BoomBapPerc.wav';

//References to pad button DOM elements
const padButtonA = document.getElementById('padButtonA');
const padButtonB = document.getElementById('padButtonB');
const padButtonC = document.getElementById('padButtonC');
const padButtonD = document.getElementById('padButtonD');
//References to sample speed / pitch controllers
const aRateControl = document.getElementById('padPitchInputA');
const bRateControl = document.getElementById('padPitchInputB');
const cRateControl = document.getElementById('padPitchInputC');
const dRateControl = document.getElementById('padPitchInputD');
//References to individual gain controllers
const aGainControl = document.getElementById('padVolumeInputA');
const bGainControl = document.getElementById('padVolumeInputB');
const cGainControl = document.getElementById('padVolumeInputC');
const dGainControl = document.getElementById('padVolumeInputD');
//Gain parameters
var masterGainValue = 1;
var aGainValue = 1;
var bGainValue = 1;
var cGainValue = 1;
var dGainValue = 1;

//Master filter control
const mFilterController = document.getElementById('mFilterBand');
var mFilterFrequency = 1100;
mFilterController.addEventListener('input', function() {
    mFilterFrequency = Number(this.value);
}, false);

//Disable sliders until powered on
//Prevents input for functionality that hasn't been intitialized yet.
mFilterController.disabled = true;
aRateControl.disabled = true;
bRateControl.disabled = true;
cRateControl.disabled = true;
dRateControl.disabled = true;

//Power Button
//User gesture to enable audio in browser
const powerButton = document.getElementById('powerButton');
var hasPower = false;
var isInit = false;

//Settings Button
const settingsButton = document.getElementById('settingsButton');

//Panel references
const frontPanel = document.getElementById('frontPanel');
const backPanel = document.getElementById('backPanel');

settingsButton.addEventListener('click', function() {
    frontPanel.setAttribute("style", "visibility: hidden");
    backPanel.setAttribute("style", "visibility: visible");
}, false);

//Return Button
const returnButton = document.getElementById('returnButton');
returnButton.addEventListener('click', function() {
    frontPanel.setAttribute("style", "visibility: visible");
    backPanel.setAttribute("style", "visibility: hidden");
}, false);

powerButton.addEventListener('click', function() {
    if(!isInit){
        initializeProgram();
        isInit = true;
    }
    if(hasPower){
        powerButton.setAttribute("style", "background-image: url('image/ui/front/powerbutton-off.png')");
        hasPower = false;
        masterGainValue = 0;
    } else {
        powerButton.setAttribute("style", "background-image: url('image/ui/front/powerbutton.png')");
        hasPower = true;
        masterGainValue = 1;
    }
}, false);


//Initialize program - kicks off when power button is pressed the first time.
function initializeProgram(){
    //cross browser audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    //Create bandpass for master filter
    var bandpass = audioContext.createBiquadFilter();
    bandpass.type = 'bandpass';
    //Create master gain node
    var mGainNode = audioContext.createGain();
    //Individual pad gains
    var aGainNode = audioContext.createGain();
    var bGainNode = audioContext.createGain();
    var cGainNode = audioContext.createGain();
    var dGainNode = audioContext.createGain();
    //Update gain node value and return the node
    function padGainSelect(pad){
        switch (pad) {
            case 0:
                aGainNode.gain.value = aGainValue;
                return aGainNode;
            case 1:
                bGainNode.gain.value = bGainValue;
                return bGainNode;
            case 2:
                cGainNode.gain.value = cGainValue;
                return cGainNode;
            case 3:
                dGainNode.gain.value = dGainValue;
                return dGainNode;
            default:
                console.log("invalid pad number entered");
                break;
        }
    }
    //Individual Gain Controllers
    aGainControl.addEventListener('input', function() {
        aGainValue = Number(this.value);
    }, false);

    bGainControl.addEventListener('input', function() {
        bGainValue = Number(this.value);
    }, false);

    cGainControl.addEventListener('input', function() {
        cGainValue = Number(this.value);
    }, false);

    dGainControl.addEventListener('input', function() {
        dGainValue = Number(this.value);
    }, false);

    //Sample rate for pads
    let aSampleRate = 1;
    let bSampleRate = 1;
    let cSampleRate = 1;
    let dSampleRate = 1;
    function padRateSelect(pad){
        switch (pad) {
            case 0:
                return aSampleRate;
            case 1:
                return bSampleRate;
            case 2:
                return cSampleRate;
            case 3:
                return dSampleRate;
            default:
                console.log("invalid pad number entered");
                break;
        }
    }

    aRateControl.addEventListener('input', function() {
        aSampleRate = Number(this.value);
    }, false);
    bRateControl.addEventListener('input', function() {
        bSampleRate = Number(this.value);
    }, false);
    cRateControl.addEventListener('input', function() {
        cSampleRate = Number(this.value);
    }, false);
    dRateControl.addEventListener('input', function() {
        dSampleRate = Number(this.value);
    }, false);

    //Enable slider / fader controls now that they're functional
    mFilterController.disabled = false;
    aRateControl.disabled = false;
    bRateControl.disabled = false;
    cRateControl.disabled = false;
    dRateControl.disabled = false;

    //Load samples to buffer and decode
    async function getFile(audioContext, filepath) {
        const response = await fetch(filepath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }
    
    //Store decoded buffers in array
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

    //When samples are ready then allow playback and user input
    setupSample()
    .then((sampleArray) => {

        function playSample(audioContext, audioBuffer, pad) {
            const sampleSource = audioContext.createBufferSource();
            sampleSource.buffer = audioBuffer;
            sampleSource.playbackRate.value = padRateSelect(pad);
            bandpass.frequency.value = mFilterFrequency;
            mGainNode.gain.value = masterGainValue;
            sampleSource.connect(padGainSelect(pad)).connect(bandpass).connect(mGainNode).connect(audioContext.destination)
            sampleSource.start();
            return sampleSource;
        }
        //Mousedown events for pads
        padButtonA.addEventListener('mousedown', function() {
            padButtonA.setAttribute("style", "background-image: url('image/ui/front/drumpad-press.png')");
            playSample(audioContext, sampleArray[0], 0);
        }, false);
        padButtonB.addEventListener('mousedown', function() {
            padButtonB.setAttribute("style", "background-image: url('image/ui/front/drumpad-press.png')");
            playSample(audioContext, sampleArray[1], 1);
        }, false);
        padButtonC.addEventListener('mousedown', function() {
            padButtonC.setAttribute("style", "background-image: url('image/ui/front/drumpad-press.png')");
            playSample(audioContext, sampleArray[2], 2);
        }, false);
        padButtonD.addEventListener('mousedown', function() {
            padButtonD.setAttribute("style", "background-image: url('image/ui/front/drumpad-press.png')");
            playSample(audioContext, sampleArray[3], 3);
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
            playSample(audioContext, sampleArray[0], 0);
            break;
        case "ArrowUp":
        case "w":
            // code for "up arrow" key press.
            padButtonB.setAttribute("style", "background-image: url('image/ui/front/drumpad-press.png')");
            playSample(audioContext, sampleArray[1], 1);
            break;
        case "ArrowLeft":
        case "a":
            // code for "left arrow" key press.
            padButtonC.setAttribute("style", "background-image: url('image/ui/front/drumpad-press.png')");
            playSample(audioContext, sampleArray[2], 2);
            break;
        case "ArrowRight":
        case "d":
            // code for "right arrow" key press.
            padButtonD.setAttribute("style", "background-image: url('image/ui/front/drumpad-press.png')");
            playSample(audioContext, sampleArray[3], 3);
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