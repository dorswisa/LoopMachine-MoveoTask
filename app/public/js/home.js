/** Implementation of the presentation of the pads and buttons */
var playPauseButton = document.getElementById('play-pause');
var stopButton = document.getElementById('stop');
var repeatButton = document.getElementById('repeat');
var audioPlayerContainers = document.getElementsByClassName('audio-player-container');
var muteIconContainers = document.getElementsByClassName('mute-icon');
var seekSlider = document.getElementsByClassName('seek-slider')[0];
var audios = document.querySelectorAll('audio');
var durationContainers = document.getElementsByClassName('duration');
var currentTimeContainers = document.getElementsByClassName('current-time');


console.log(audios);

let raf = new Array(muteIconContainers.length).fill(null);
let colors = new Array(muteIconContainers.length).fill("#A8B3B8");
let playState = false;
let repeatState = true;

let muteState = new Array(muteIconContainers.length).fill("unmute");

var muteAnimation = [];

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
        seekSlider.value = 0;
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
            audioPlayerContainers[i].style.color = "#A8B3B8";
        } else {
            muteAnimation[i].playSegments([15, 25], true);
            audios[i].muted = false;
            muteState[i] = 'unmute';
            audioPlayerContainers[i].style.color = colors[i];
        }
    });
});

seekSlider.addEventListener('change', () => {
    audios.forEach(function (ele, i) {
        ele.currentTime = seekSlider.value;
        currentTimeContainers[i].textContent = calculateTime(seekSlider.value);
        requestAnimationFrame(whilePlaying);
    });
});

playPauseButton.addEventListener('click', () => {                         // listener for clicking on play/pause
    if(!playState)
    {
        playState = true;
        requestAnimationFrame(whilePlaying);
        playPauseButton.childNodes[0].className = playPauseButton.childNodes[0].className.split(" ").slice(0,3).concat(["fa-pause"]).join(" ")
        muteState.forEach(function (element, i) {
            audios[i].play();
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


const displayDuration = (i) => {
    durationContainers[i].textContent = calculateTime(audios[i].duration);
}

const setSliderMax = (i) => {
    seekSlider.max = Math.floor(audios[i].duration);
}


const whilePlaying = () => {                                //          requestAnimationFrame function for update the sliders in the pads
    seekSlider.value = Math.floor(audios[0].currentTime);
    muteState.forEach(function (element, i) {
        currentTimeContainers[i].textContent = calculateTime(seekSlider.value);
        audioPlayerContainers[i].style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
        if(muteState[i] == "mute")
        {
            audioPlayerContainers[i].style.background = "linear-gradient(to right, #A8B3B8" + " 0%, #A8B3B8" +" "+ seekSlider.value / seekSlider.max * 100+"%, #ECEFF1 " + seekSlider.value / seekSlider.max * 100+"%, #ECEFF1 100%)"
        }
        else
        {
            audioPlayerContainers[i].style.background = "linear-gradient(to right," + colors[i] + " 0%," + colors[i] +""+ seekSlider.value / seekSlider.max * 100+"%, #ECEFF1 " + seekSlider.value / seekSlider.max * 100+"%, #ECEFF1 100%)"
        }
    });
    requestAnimationFrame(whilePlaying);
}

audios.forEach(function (element, i) {
    colors[i] = audioPlayerContainers[i].style.color;
    if (element.readyState > 0) {
        displayDuration(i);
        setSliderMax(i);
    } else {
        element.addEventListener('loadedmetadata', () => {
            displayDuration(i);
            setSliderMax(i);
        });
    }
});