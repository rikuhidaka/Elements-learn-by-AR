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

// 元素のデータ
const elements_data = [{
        abbr: 'H',
        name: 'Hydrogen',
        color: 'white',
        colorcode: '#ffffff',
    },
    {
        abbr: 'C',
        name: 'Carbon',
        color: 'black',
        colorcode: '#000000',
    },
    {
        abbr: 'N',
        name: 'Nitrogen',
        color: 'blue',
        colorcode: '#0000ff',
    },
    {
        abbr: 'O',
        name: 'Oxygen',
        color: 'red',
        colorcode: '#ff0000',
    },
    {
        abbr: 'Na',
        name: 'Sodium',
        color: 'slateblue',
        colorcode: '#6a5acd',
    },
    {
        abbr: 'Mg',
        name: 'Magnesium',
        color: 'greenyellow',
        colorcode: 'adff2f',
    },
    {
        abbr: 'S',
        name: 'Sulfur',
        color: 'goldenrod',
        colorcode: '#daa520',
    },
    {
        abbr: 'Cl',
        name: 'Chlorine',
        color: 'limegreen',
        colorcode: '32cd32',
    },
    {
        abbr: 'Ca',
        name: 'Calcium',
        color: 'lawngreen',
        colorcode: '#7cfc00',
    },
    {
        abbr: 'Fe',
        name: 'Iron',
        color: 'orangered',
        colorcode: 'ff4500',
    },
    {
        abbr: 'Cu',
        name: 'Copper',
        color: 'chocolate',
        colorcode: '#d2691e',
    },
    {
        abbr: 'Zn',
        name: 'Zinc',
        color: 'steelblue',
        colorcode: '#4682b4',
    },
    {
        abbr: 'Ag',
        name: 'Silver',
        color: 'lavender',
        colorcode: '#e6e6fa',
    },
    {
        abbr: 'Ba',
        name: 'Barium',
        color: 'olivedrab',
        colorcode: '#6b8e23',
    },
    {
        abbr: 'O2',
        name: 'Oxygen2',
        color: 'red',
        colorcode: '#ff0000',
    },
    {
        abbr: 'H2',
        name: 'Hydrogen2',
        color: 'white',
        colorcode: '#ffffff',
    },
    {
        abbr: 'Cl2',
        name: 'Chlorine2',
        color: 'limegreen',
        colorcode: '32cd32',
    },
    {
        abbr: 'Ag2',
        name: 'Silver2',
        color: 'lavender',
        colorcode: '#e6e6fa',
    },
];

function distance(x0, y0, x1, y1) {
    return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
}

// 元素を描く
function drawElement(ctx, x, y, scale, color, name) {
    ctx.beginPath();
    ctx.arc(x, y, scale / 2.5, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    // 文字はダークブルー
    ctx.fillStyle = '#191970';
    ctx.font = '36px serif';
    ctx.fillText(name, x - scale / 2, y + scale / 2);
}

function chemicalReaction(ctx, closeElements, position_x, position_y) {
    for(i=0;i<closeElements.length;i++){
        console.log(closeElements[i] + i);
        
    }

    if (closeElements[0] == 'S' && closeElements[1] == 'O2'){
        console.log('S + O2 -> SO2');
        drawElement(ctx,position_x,position_y,80,'#ec5210','SO2');
    } 
    if (closeElements[0] == 'H2' && closeElements[1] == 'H2' && closeElements[2] == 'O2'){
        console.log('2H2 + O2 -> 2H2O');
        drawElement(ctx,position_x,position_y,80,'#ff7f7f','2H2O');
    } 
    if (closeElements[0] == 'C' && closeElements[1] == 'O2'){
        console.log('C + O2 -> CO2');
        drawElement(ctx,position_x,position_y,80,'#7f0000','CO2');
    } 
    if (closeElements[0] == 'Fe' && closeElements[1] == 'S'){
        console.log('Fe + S -> FeS');
        drawElement(ctx,position_x,position_y,80,'#ec7510','FeS');
    } 
    if (closeElements[0] == 'Fe' && closeElements[1] == 'Fe' && closeElements[2] == 'Fe' && closeElements[3] == 'O2' && closeElements[4] == 'O2'){
        console.log('3Fe + 2O2 -> Fe3O4');
        drawElement(ctx,position_x,position_y,80,'#ff2200','Fe3O4');
    }
    if (closeElements[0] == 'Cu' && closeElements[1] == 'S'){
        console.log('Cu + S -> CuS');
        drawElement(ctx,position_x,position_y,80,'#d6871f','CuS');
    }
    if (closeElements[0] == 'Cu' && closeElements[1] == 'Cl2'){
        console.log('Cu + Cl2 -> CuCl2');
        drawElement(ctx,position_x,position_y,80,'#829b28','CuCl2');
    }
    if (closeElements[0] == 'Cu' && closeElements[1] == 'Cu' && closeElements[2] == 'O2'){
        console.log('2Cu + O2 -> 2CuO');
        drawElement(ctx,position_x,position_y,80,'#E2340F','2CuO');
    }
    if (closeElements[0] == 'Mg' && closeElements[1] == 'Mg' && closeElements[2] == 'O2'){
        console.log('2Mg + O2 -> 2MgO');
        drawElement(ctx,position_x,position_x,80,'#d67f17','2MgO');
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
            height: 800,
        });
        this.video.addEventListener(
            'play',
            function() {
                self.width = 800;
                self.height = 800;
                self.timerCallback();
            },
            false
        );
    },

    // loop
    computeFrame: function() {
        // カメラから取得したデータをcanvasに書き込む
        this.context.drawImage(this.video, 0, 0, this.width, this.height);
        var imageData = this.context.getImageData(0, 0, this.width, this.height);
        // マーカーを検出
        var markers = this.detector.detect(imageData);
        var dist;
        // console.log(markers);
        $('#scene').empty();
        var centor_x,
            centor_y,
            scale,
            marker_width,
            marker_height,
            elements_x = [],
            elements_y = [];
        for (let i = 0; i < markers.length; i++) {
            if (typeof markers[i] === 'undefined') {
                console.log('undefined');
            } else {
                marker_width = Math.abs(markers[i].corners[2].y - markers[i].corners[0].y);
                marker_height = Math.abs(markers[i].corners[2].x - markers[i].corners[0].x);
                centor_x = (markers[i].corners[2].x + markers[i].corners[0].x) / 2;
                centor_y = (markers[i].corners[2].y + markers[i].corners[0].y) / 2;

                scale = Math.max(marker_height, marker_width);

                $('#scene').append('<p>id:' + markers[i].id + '</br>x:' + centor_x + ', y:' + centor_y + '</p>');
                if (elements_data[markers[i].id]) {
                    drawElement(
                        this.context,
                        centor_x,
                        centor_y,
                        scale,
                        elements_data[markers[i].id].colorcode,
                        elements_data[markers[i].id].abbr
                    );
                    console.log(scale);
                }
                elements_x.push(centor_x);
                elements_y.push(centor_y);
                centor_x = 0;
                centor_y = 0;
            }
        }
        var elements = [],
            position_x = 0,
            position_y = 0,
            near_elements_x = [],
            near_elements_y = [];

        for (let i = 0; i < elements_x.length; i++) {
            elements.push(elements_data[markers[i].id].abbr);
            for (let j = 0; j < elements_x.length; j++) {
                if (i != j) {
                    // 2点間の距離でしきい値より小さければ反応する
                    if (distance(elements_x[i], elements_y[i], elements_x[j], elements_y[j]) < 80) {
                        elements.push(elements_data[markers[j].id].abbr);
                    }
                }
            }
            console.log(elements);
            if (elements.length > 1) {
                for (let k = 0; k < elements.length; k++) {
                    position_x += near_elements_x[k];
                    position_y += near_elements_y[k];
                }
                chemicalReaction(this.context, elements.sort(), position_x, position_y);
            }
            elements = [];
            position_x = 0;
            position_y = 0;
        }
        near_elements_x = [];
        near_elements_y = [];
        elements_x = [];
        elements_y = [];
    },
};

document.addEventListener('DOMContentLoaded', () => {
    processor.doLoad();
});