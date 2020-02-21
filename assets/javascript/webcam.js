navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var URL = window.URL || window.webkitURL;
var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
var RTCSessionDescription =
    window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;
var RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate;

const constraints = {
    audio: false,
    video: { facingMode: 'environment' },
};

const elements_data = [{
        abbr: 'H',
        name: 'Hydrogen',
        color: 'white',
        colorcode: '#ffffff',
        number: 1,
    },
    {
        abbr: 'C',
        name: 'Carbon',
        color: 'black',
        colorcode: '#000000',
        number: 6,
    },
    {
        abbr: 'N',
        name: 'Nitrogen',
        color: 'blue',
        colorcode: '#0000ff',
        number: 7,
    },
    {
        abbr: 'O',
        name: 'Oxygen',
        color: 'red',
        colorcode: '#ff0000',
        number: 8,
    },
    {
        abbr: 'Na',
        name: 'Sodium',
        color: 'slateblue',
        colorcode: '#6a5acd',
        number: 11,
    },
    {
        abbr: 'Mg',
        name: 'Magnesium',
        color: 'greenyellow',
        colorcode: 'adff2f',
        number: 12,
    },
    {
        abbr: 'S',
        name: 'Sulfur',
        color: 'goldenrod',
        colorcode: '#daa520',
        number: 16,
    },
    {
        abbr: 'Cl',
        name: 'Chlorine',
        color: 'limegreen',
        colorcode: '32cd32',
        number: 17,
    },
    {
        abbr: 'Ca',
        name: 'Calcium',
        color: 'lawngreen',
        colorcode: '#7cfc00',
        number: 20,
    },
    {
        abbr: 'Fe',
        name: 'Iron',
        color: 'orangered',
        colorcode: 'ff4500',
        number: 26,
    },
    {
        abbr: 'Cu',
        name: 'Copper',
        color: 'chocolate',
        colorcode: '#d2691e',
        number: 29,
    },
    {
        abbr: 'Zn',
        name: 'Zinc',
        color: 'steelblue',
        colorcode: '#4682b4',
        number: 30,
    },
    {
        abbr: 'Ba',
        name: 'Barium',
        color: 'olivedrab',
        colorcode: '#6b8e23',
        number: 56,
    },
];

function drawElement(ctx, x, y, scale, color, name) {
    ctx.beginPath();
    ctx.arc(x, y, scale / 2.5, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = '#191970';
    ctx.font = '36px serif';
    ctx.fillText(name, x - scale / 2, y + scale / 2);
}

// help me!!!!!!!!!!!!!!!!!!!!!!!!
function chemicalReaction(id_0, id_1) {
    var element_0 = elements_data[id_0].abbr;
    var element_1 = elements_data[id_1].abbr;
    switch (element_0) {
        case 'H':
            switch (element_1) {
                case 'H':
                    break;

                default:
                    console.log(element_0 + ' × ' + element_1 + ' is not chemical reaction');
                    break;
            }
            break;

        case 'C':
            switch (element_1) {
                case 'C':
                    break;

                default:
                    break;
            }

        default:
            console.log(element_0 + ' × ' + element_1 + ' is not chemical reaction');
            break;
    }
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
        $('#canvas').attr({
            width: 800,
            height: 600,
        });
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

    // loop
    computeFrame: function() {
        // canvasの初期化
        this.context.clearRect(0, 0, this.width, this.height);
        // カメラから取得したデータをcanvasに書き込む
        this.context.drawImage(this.video, 0, 0, this.width, this.height);
        var imageData = this.context.getImageData(0, 0, this.width, this.height);
        // マーカーを検出
        var markers = this.detector.detect(imageData);
        var dist;
        console.log(markers);
        $('#scene').empty();
        var centor_x,
            centor_y,
            marker_width,
            marker_height,
            elements_x = [],
            elements_y = [];

        for (let i = 0; i < markers.length; i++) {
            if (typeof markers[i] === 'undefined') {
                console.log('undefined');
            } else {
                marker_width = markers[i].corners[2].y - markers[i].corners[0].y;
                marker_height = markers[i].corners[2].x - markers[i].corners[0].x;
                centor_x = markers[i].corners[0].x + marker_width / 2;
                centor_y = markers[i].corners[0].y + marker_height / 2;

                $('#scene').append('<p>id:' + markers[i].id + '</br>x:' + centor_x + ', y:' + centor_y + '</p>');
                if (elements_data[markers[i].id]) {
                    drawElement(
                        this.context,
                        centor_x,
                        centor_y,
                        marker_height,
                        elements_data[markers[i].id].colorcode,
                        elements_data[markers[i].id].name
                    );
                }
                elements_x.add(centor_x);
                elements_y.add(centor_y);
                centor_x = 0;
                centor_y = 0;
            }
        }
        for (let i = 0; i < elements_x.length; i++) {
            for (let j = i + 1; j < elements_x.length; j++) {
                dist =
                    (elements_x[i] - elements_x[j]) * (elements_x[i] - elements_x[j]) +
                    (elements_y[i] - elements_y[j]) * (elements_y[i] - elements_y[j]);
                if (dist < 5000) {
                    if (markers[i].id < markers[j].id) {
                        cemicalReaction(markers[i].id, markers[j].id);
                    } else {
                        cemicalReaction(markers[j].id, markers[i].id);
                    }
                }
            }
        }
    },
};

document.addEventListener('DOMContentLoaded', () => {
    processor.doLoad();
});