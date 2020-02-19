const constraints = { audio: false, video: { width: 800, height: 600 } };

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
                self.width = 400;
                self.height = 300;
                self.timerCallback();
            },
            false
        );
    },

    computeFrame: function() {
        this.context.drawImage(this.video, 0, 0, this.width, this.height);
        var imageData = this.context.getImageData(0, 0, this.width, this.height);
        var markers = this.detector.detect(imageData);
        console.log(markers);
    },
};

document.addEventListener('DOMContentLoaded', () => {
    processor.doLoad();
});