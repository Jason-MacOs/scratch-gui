import axios from 'axios';
import io from 'socket.io-client';

var runCode = (function() {
    const URL = 'http://10.0.0.25:6543';
    const PROTOCOL = window.location.protocol;
    const LOCALHOST_NAME = PROTOCOL === 'https:' ? 'https://127.0.0.1' : 'http://127.0.0.1';
    // connections on a range of ports from 8990 to 9000
    const PORTS = Array.from({length: 11}, (x, i) => i + 8990);
    const EXTRA = {
        auth: {},
        network: false,
        wait_for_upload_port: false, 
        use_1200bps_touch: false
    };

    var socket, reply, port, portName;

    // get reply from 127.0.0.1:xxxx
    function _getReply() {
        for (let p of PORTS){
            axios({
                method: 'get',
                url: `${LOCALHOST_NAME}:${p}/info`,
            }).then(response => {
                if (response.status == 200) {
                    reply = response.data;
                    _openWebsocket(response.data);
                }
            }).catch(error => {
                console.log(error);
            })
            
        }
    }

    // open a websocket
    function _openWebsocket() {
        if (window['WebSocket']) {
            if (PROTOCOL === 'https:') {
                port = reply.https.slice(-4);
                socket = io(reply.https);
            } else {
                port = reply.http.slice(-4);
                socket = io(reply.http);
            }
            // get port name
            if (!socket.connected) {
                socket.on('connect',()=>{
                })
            }
            socket.emit('command', 'list');
            socket.on('message', function(evt) {
                if (evt.indexOf('Ports') > 0) {
                    evt = JSON.parse(evt);
                    if (evt['Ports'].length) {
                        portName = evt['Ports'][0]['Name']
                    }
                }            
            });
            socket.on('command', `open ${portName} 9600`)
            socket.on('disconnect', function (evt) {
                port = '';
                alert('已断开连接！')
            })
        } else {
            alert('哎呀！你的浏览器不支持WebSockets哦。')
        }
    }

    // download sketch
    function _downloadSketch(url) {
        if (!port) {
            alert('哎呀！打开Arduino助手了吗？');
        } else if (!portName) {
            alert("哎呀！连接Arduino板了吗？");
        } else {
            axios({
                method: 'get',
                url: url,
            }).then((response) => {
                //      resolve(response);
                var data = response.data.data;
                data['port'] = portName;
                data['extra'] = EXTRA;
                _upload(data)
            
            }).catch((error) => {
                // reject(error);
                console.log(error)
            })
        }
    }

    // upload
    function _upload(data){
        axios({
            method: 'POST',
            url: `${LOCALHOST_NAME}:${port}/upload`,
            data: data
        }).then(response => {
            // alert('上传成功啦！');
        }).catch(error => {
            alert('哎呀！\n' + error.response.data || '');
        })
    }

    return {
        getReply: function() {
            return _getReply();
        },
        downloadSketch: function(url) {
            return _downloadSketch(url);
        },
        openWebSocket: function() {
            return _openWebSocket();
        }
    }
})()

export default runCode;

