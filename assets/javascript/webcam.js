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

function chemicalReaction(ctx, closeElements, scale, position_x, position_y) {
    if (closeElements[0] == 6 && closeElements[1] == 14) {
        console.log('S + O2 -> SO2');
        drawElement(ctx, position_x, position_y, scale, '#ec5210', 'SO2');
        return true;
    }
    if (closeElements[0] == 14 && closeElements[1] == 15 && closeElements[2] == 15) {
        console.log('2H2 + O2 -> 2H2O');
        drawElement(ctx, position_x, position_y, scale, '#ff7f7f', '2H2O');
        return true;
    }
    if (closeElements[0] == 1 && closeElements[1] == 14) {
        console.log('C + O2 -> CO2');
        drawElement(ctx, position_x, position_y, scale, '#7f0000', 'CO2');
        return true;
    }
    if (closeElements[0] == 6 && closeElements[1] == 9) {
        console.log('Fe + S -> FeS');
        drawElement(ctx, position_x, position_y, scale, '#ec7510', 'FeS');
        return true;
    }
    if (
        closeElements[0] == 9 &&
        closeElements[1] == 9 &&
        closeElements[2] == 9 &&
        closeElements[3] == 14 &&
        closeElements[4] == 14
    ) {
        console.log('3Fe + 2O2 -> Fe3O4');
        drawElement(ctx, position_x, position_y, scale, '#ff2200', 'Fe3O4');
        return true;
    }
    if (closeElements[0] == 6 && closeElements[1] == 10) {
        console.log('Cu + S -> CuS');
        drawElement(ctx, position_x, position_y, scale, '#d6871f', 'CuS');
        return true;
    }
    if (closeElements[0] == 10 && closeElements[1] == 16) {
        console.log('Cu + Cl2 -> CuCl2');
        drawElement(ctx, position_x, position_y, scale, '#829b28', 'CuCl2');
        return true;
    }
    if (closeElements[0] == 10 && closeElements[1] == 10 && closeElements[2] == 14) {
        console.log('2Cu + O2 -> 2CuO');
        drawElement(ctx, position_x, position_y, scale, '#E2340F', '2CuO');
        return true;
    }
    if (closeElements[0] == 5 && closeElements[1] == 5 && closeElements[2] == 14) {
        console.log('2Mg + O2 -> 2MgO');
        drawElement(ctx, position_x, position_x, scale, '#d67f17', '2MgO');
        return true;
    }

    return false;
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
        var elements = [];

        for (let i = 0; i < markers.length; i++) {
            if (markers[i].id < elements_data.length) {
                let marker_width = Math.abs(markers[i].corners[2].y - markers[i].corners[0].y);
                let marker_height = Math.abs(markers[i].corners[2].x - markers[i].corners[0].x);
                let marker_data = {
                    id: markers[i].id,
                    x: (markers[i].corners[2].x + markers[i].corners[0].x) / 2,
                    y: (markers[i].corners[2].y + markers[i].corners[0].y) / 2,
                    scale: Math.max(marker_height, marker_width),
                };
                $('#scene').append(
                    '<p>id:' + markers[i].id + '</br>x:' + marker_data.x + ', y:' + marker_data.y + '</p>'
                );
                elements.push(marker_data);
            }
        }
        var position_x = 0,
            position_y = 0,
            element_scale = 0,
            numbers = [],
            near_elements = [];

        for (let i = 0; i < elements.length; i++) {
            let near_element = {
                x: elements[i].x,
                y: elements[i].y,
                id: elements[i].id,
            };
            numbers.push(i);
            near_elements.push(near_element);
            for (let j = 0; j < elements.length; j++) {
                if (i != j) {
                    // 2点間の距離でしきい値より小さければ反応する
                    if (distance(elements[i].x, elements[i].y, elements[j].x, elements[j].y) < 300) {
                        let element = {
                            x: elements[j].x,
                            y: elements[j].y,
                            id: elements[j].id,
                        };
                        numbers.push(j);
                        near_elements.push(element);
                    }
                }
            }
            // console.log(elements);
            if (near_elements.length > 1) {
                for (let k = 0; k < elements.length; k++) {
                    position_x += near_elements[k].x;
                    position_y += near_elements[k].y;
                    element_scale += near_elements[k].scale;
                }
                let Ids = [];
                near_elements.forEach((element) => {
                    Ids.push(element.id);
                });

                if (
                    chemicalReaction(
                        this.context,
                        Ids.sort((a, b) => a - b),
                        element_scale,
                        position_x / near_elements.length,
                        position_y / near_elements.length
                    ) === true
                ) {
                    numbers.sort(function(a, b) {
                        return a < b ? 1 : -1;
                    });
                    console.log(elements.length);
                    numbers.forEach((number) => {
                        if (number == 0) {
                            elements.shift();
                        } else {
                            elements.splice(number, number);
                        }
                    });
                    console.log(numbers);
                }
            }
            numbers = [];
            near_elements = [];
            element_scale = 0;
            position_x = 0;
            position_y = 0;
        }
        elements.forEach((element) => {
            drawElement(
                this.context,
                element.x,
                element.y,
                element.scale,
                elements_data[element.id].colorcode,
                elements_data[element.id].abbr
            );
        });
        elements = [];
    },
};

document.addEventListener('DOMContentLoaded', () => {
    processor.doLoad();
});