console.clear();

const allowAudioButton = document.getElementById('audioInit');

audioInit.addEventListener('click', function() {

initializeProgram();

}, false);


function initializeProgram(){
    //cross browser audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    // get the audio element
    const audioElement = document.querySelector('audio');
    audioElement.crossOrigin = "anonymous";
    // pass it into the audio context
    const track = audioContext.createMediaElementSource(audioElement);

    //connect our source to the context
    track.connect(audioContext.destination);

    // select our play button
    const playButton = document.getElementById('playpause');

    //when audio file finishes playing
    audioElement.addEventListener('ended', () => {
        playButton.dataset.playing = 'false';
    }, false);

    //play button
    playButton.addEventListener('click', function() {

    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // play or pause track depending on state
    if (this.dataset.playing === 'false') {
        audioElement.play();
        this.dataset.playing = 'true';
    } else if (this.dataset.playing === 'true') {
        audioElement.pause();
        this.dataset.playing = 'false';
    }
    }, false);
}


