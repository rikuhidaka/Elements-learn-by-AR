navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var URL = window.URL || window.webkitURL;
var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
var RTCSessionDescription =
    window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;
var RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate;

const constraints = {
    audio: false,
    video: { width: 800, height: 600, facingMode: 'environment' },
};

function drawCircle(ctx, x, y, scale, color) {
    ctx.beginPath();
    ctx.arc(x, y, scale, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}

// webcamera → video
navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(mediaStream) {
        const video = document.querySelector('video');
        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e) {
            video.play();
        };
    })
    .catch(function(err) {
        console.log(err.name + ': ' + err.message);
    }); // always check for errors at the end.

// callback呼び出し
let processor = {
    timerCallback: function() {
        if (this.video.paused || this.video.ended) {
            return;
        }
        this.computeFrame();
        let self = this;
        setTimeout(function() {
            self.timerCallback();
        }, 0);
    },

    doLoad: function() {
        this.video = document.querySelector('video');
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.detector = new AR.Detector();
        let self = this;
        this.video.addEventListener(
            'play',
            function() {
                self.width = 800;
                self.height = 600;
                self.timerCallback();
            },
            false
        );
    },

    computeFrame: function() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.drawImage(this.video, 0, 0, this.width, this.height);
        var imageData = this.context.getImageData(0, 0, this.width, this.height);
        var markers = this.detector.detect(imageData);
        console.log(markers);
        $('#scene').empty();
        var centor_x, centor_y;
        for (let i = 0; i < markers.length; i++) {
            if (typeof markers[i] === 'undefined') {
                console.log('undefined');
            } else {
                centor_x = markers[i].corners[0].x + (markers[i].corners[2].x - markers[i].corners[0].x) / 2;
                centor_y = markers[i].corners[0].y + (markers[i].corners[2].y - markers[i].corners[0].y) / 2;

                $('#scene').append('<p>id:' + markers[i].id + '</br>x:' + centor_x + ', y:' + centor_y + '</p>');
                drawCircle(
                    this.context,
                    centor_x,
                    centor_y,
                    (markers[i].corners[2].x - markers[i].corners[0].x) / 3,
                    '#ff2626'
                );
                centor_x = 0;
                centor_y = 0;
            }
        }
    },
};

document.addEventListener('DOMContentLoaded', () => {
    processor.doLoad();
});

// getVideoSources(function(cam) {
//     console.log('cam', cam);
//     var b = document.createElement('input');
//     b.type = 'button';
//     b.value = cam.name;
//     b.onclick = getMain(cam.id);
//     control.appendChild(b);
//     console.log('add button');
// });

// function getMain(cam_id) {
//     return function() {
//         main(cam_id);
//     };
// }