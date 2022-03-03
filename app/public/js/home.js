/** Implementation of the presentation of the pads and buttons */
var playPauseButton = document.getElementById('play-pause');
var stopButton = document.getElementById('stop');
var repeatButton = document.getElementById('repeat');
var audioPlayerContainers = document.getElementsByClassName('audio-player-container');
var muteIconContainers = document.getElementsByClassName('mute-icon');
var seekSliders = document.getElementsByClassName('seek-slider');
var audios = document.querySelectorAll('audio');
var durationContainers = document.getElementsByClassName('duration');
var currentTimeContainers = document.getElementsByClassName('current-time');


let raf = new Array(muteIconContainers.length).fill(null);
let colors = new Array(muteIconContainers.length).fill("#A8B3B8");
let playState = false;
let repeatState = true;

console.log(audios);

let muteState = new Array(muteIconContainers.length).fill("unmute");

var muteAnimation = [];

const showRangeProgress = (rangeInput, i) => {
    if(rangeInput === seekSliders[i]) audioPlayerContainers[i].style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
    else audioPlayerContainers[i].style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
}

const calculateTime = (secs) => {                                               // calculate the time of pad
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
}

stopButton.addEventListener('click', () => {                            // listener for clicking on stopButton
    requestAnimationFrame(whilePlaying);
    playPauseButton.childNodes[0].className = playPauseButton.childNodes[0].className.split(" ").slice(0,3).concat(["fa-play"]).join(" ")
    playState = false;
    muteState.forEach(function (element, i) {
        audios[i].pause();
        audios[i].currentTime = 0;
        seekSliders[i].value = 0;
        currentTimeContainers[i].textContent = calculateTime(0);
        audioPlayerContainers[i].style.setProperty('--seek-before-width', `${0}%`);
    })
});

repeatButton.addEventListener('click', () => {                      // listener for clicking on repeatButton
    if(repeatState) {
        repeatState = false;
        repeatButton.style.background = "transparent";
    }
    else {
        repeatState = true;
        repeatButton.style.background = "#37474f";
    }
    audios.forEach(function (element, i){
        element.loop = repeatState;
    })
});

muteIconContainers.forEach(function (element, i) {
    muteAnimation[i] = lottie.loadAnimation({
        container: element,
        path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/mute/mute.json',
        renderer: 'svg',
        loop: false,
        autoplay: false,
        outline: "none"
    });

    element.addEventListener('click', () => {               // listener for clicking on mute in pad
        if(muteState[i] === 'unmute') {
            muteAnimation[i].playSegments([0, 15], true);
            audios[i].muted = true;
            muteState[i] = 'mute';
            colors[i] = audioPlayerContainers[i].style.color;
            audioPlayerContainers[i].style.color = "#A8B3B8";
        } else {
            muteAnimation[i].playSegments([15, 25], true);
            audios[i].muted = false;
            muteState[i] = 'unmute';
            audioPlayerContainers[i].style.color = colors[i];
        }
        updateRaf(i);
    });
});

seekSliders.forEach(function (element, i) {             // updating the sliders
    element.addEventListener('input', (e) => {
        showRangeProgress(e.target, i);
    });

    element.addEventListener('input', () => {
        currentTimeContainers[i].textContent = calculateTime(element.value);
        if(!audios[i].paused) {
            cancelAnimationFrame(raf[i]);
        }
    });

    element.addEventListener('change', () => {
        audios[i].currentTime = element.value;
        if(!audios[i].paused) {
            console.log("HERE2 " + i)
            requestAnimationFrame(whilePlaying);
        }
    });
});

playPauseButton.addEventListener('click', () => {                         // listener for clicking on play/pause
    if(!playState)
    {
        playState = true;
        requestAnimationFrame(whilePlaying);
        playPauseButton.childNodes[0].className = playPauseButton.childNodes[0].className.split(" ").slice(0,3).concat(["fa-pause"]).join(" ")
        muteState.forEach(function (element, i) {
            if(element === 'unmute') {
                audios[i].play();
            } else {
                audios[i].pause();
                cancelAnimationFrame(raf[i]);
            }
        })
    }
    else
    {
        playState = false;
        playPauseButton.childNodes[0].className = playPauseButton.childNodes[0].className.split(" ").slice(0,3).concat(["fa-play"]).join(" ")
        muteState.forEach(function (element, i)
        {
            audios[i].pause();
            cancelAnimationFrame(raf[i]);
        })
    }
});

function updateRaf(i) {                             // Auxiliary function for update requestAnimationFrame when clicking mute
    if(playState)
    {
        if(muteState[i] === 'unmute') {
            audios[i].play();
            raf[i] = requestAnimationFrame(whilePlaying);
        } else {
            audios[i].pause();
            cancelAnimationFrame(raf[i]);
        }
    }
}

const displayDuration = (i) => {
    durationContainers[i].textContent = calculateTime(audios[i].duration);
}

const setSliderMax = (i) => {
    seekSliders[i].max = Math.floor(audios[i].duration);
}

const displayBufferedAmount = (i) => {
    if(audios[i].buffered > 0)
    {
        const bufferedAmount = Math.floor(audios[i].buffered.end(audios[i].buffered.length - 1));
        audioPlayerContainers[i].style.setProperty('--buffered-width', `${(bufferedAmount / seekSliders[i].max) * 100}%`);
    }
}

const whilePlaying = () => {                                //          requestAnimationFrame function for update the sliders in the pads
    muteState.forEach(function (element, i) {
        if(playState && element === 'unmute') {
            seekSliders[i].value = Math.floor(audios[i].currentTime);
            currentTimeContainers[i].textContent = calculateTime(seekSliders[i].value);
            audioPlayerContainers[i].style.setProperty('--seek-before-width', `${seekSliders[i].value / seekSliders[i].max * 100}%`);
        }
    });
    requestAnimationFrame(whilePlaying);
}

audios.forEach(function (element, i) {
    if (element.readyState > 0) {
        displayDuration(i);
        setSliderMax(i);
        displayBufferedAmount(i);
    } else {
        element.addEventListener('loadedmetadata', () => {
            displayDuration(i);
            setSliderMax(i);
            displayBufferedAmount(i);
        });
    }

    element.addEventListener('progress',() =>{
        displayBufferedAmount(i);
    });
});