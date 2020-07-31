//  This code loads the IFrame Player API code asynchronously.

const PLAYER_WIDTH = "720";
const PLAYER_HEIGHT = "400";
const playerControlsContainer = document.querySelector(
  "#player-controls-container"
);
const progressBar = $(".progressbar");
const progressBarWidth = document.querySelector(".progressbar").clientWidth;
const progressBox = $(".progress-box");
const play = $("#play");
const pause = $("#pause");
const prev = $("#prev");
const next = $("#next");
const backward = $("#backward");
const forward = $("#forward");

let player, videoState, destination;
let done = false;

const tag = document.createElement("script");
playerControlsContainer.style.width = PLAYER_WIDTH + "px";
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {
  player = new YT.Player("ytplayer", {
    height: PLAYER_HEIGHT,
    width: PLAYER_WIDTH,
    videoId: "M7lc1UVf-VE", //'7ghhRHRP6t4',
    playerVars: {
      autoplay: 1,
      controls: 0,
      showInfo: 0,
      disablekb: 1,
      modestbranding: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  });
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
  if (player.getPlaylist() > 0 || player.getPlaylist() === null) {
    prev.css("display", "none");
    next.css("display", "none");
  }
  event.target.playVideo();
  setInterval(() => {
    videoState = Number(
      (player.getCurrentTime() / player.getDuration()) * 100
    ).toFixed(2);
    destination = (videoState / 100) * progressBarWidth - 10;
    progressBox.css("margin-left", destination);
  }, 200);
}

// The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    // setTimeout(stopVideo, 10000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}

function onPlayerError(event) {
  alert("something went wrong with video player");
  console.log(event);
}

progressBar.click(function (event) {
  const divOffset = $(this).offset();
  let currentPosition = event.clientX - divOffset.left;
  videoState = Number(((currentPosition / progressBarWidth) * 100).toFixed(2));
  destination = (videoState / 100) * progressBarWidth - 10;
  let currentState = Math.round((videoState / 100) * player.getDuration());
  player.seekTo(currentState, true);
  progressBox.css("margin-left", destination);
  console.log(
    divOffset,
    currentPosition,
    videoState,
    destination,
    currentState
  );
});

play.click(function () {
  if (player.playVideo()) {
    pause.css("display", "block");
    play.css("display", "none");
  }
});

pause.click(function () {
  if (player.pauseVideo()) {
    play.css("display", "block");
    pause.css("display", "none");
  }
});

prev.click(function () {
  player.previousVideo();
});

next.click(function () {
  player.nextVideo();
});

backward.click(function () {
  let currentState = Math.round((videoState / 100) * player.getDuration());
  player.seekTo(currentState - 10, true);
});

forward.click(function () {
  let currentState = Math.round((videoState / 100) * player.getDuration());
  player.seekTo(currentState + 10, true);
});

