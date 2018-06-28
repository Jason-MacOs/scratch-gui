import axios from 'axios';
import io from 'socket.io-client';
import Swal from 'sweetalert2';

var runCode = (function() {
    const PROTOCOL = window.location.protocol;
    const LOCALHOST_NAME = 'http://127.0.0.1';
    // connections on a range of ports from 8990 to 9000
    const PORTS = Array.from({length: 11}, (x, i) => i + 8990);
    const EXTRA = {
        auth: {},
        network: false,
        wait_for_upload_port: false, 
        use_1200bps_touch: false
    };

    var socket, reply, portName;

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
            if (PROTOCOL == 'https:') {
                socket = io(reply.https); 
            } else {
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
                reply = {};
                Swal('小提示', '已断开连接', 'info');
            })
        } else {
            Swal('小提示', '你的浏览器不支持WebSockets, 换个浏览器试试吧', 'warning');
        }
    }

    // download sketch
    function _downloadSketch(url) {
        if (!reply){
            Swal('小提示', '打开Arduino助手了吗？', 'warning');
        } else {
            var href = "";
            if (PROTOCOL == "https:") {
                href = reply.https;
            } else {
                href = reply.http;
            }
            if (!portName) {
                Swal('小提示', '连接Arduino板了吗？', 'warning');
            } else {
                axios({
                    method: 'get',
                    url: url,
                }).then((response) => {
                    var data = response.data.data;
                    data['port'] = portName;
                    data['extra'] = EXTRA;
                    _upload(data)
                }).catch((error) => {
                    console.log(error)
                })
            }
        }
    }

    // upload
    function _upload(data){
        var href;
        if (PROTOCOL == 'https:') {
            href = reply.https;
        } else {
            href = reply.http;
        }
        axios({
            method: 'POST',
            url: `${href}/upload`,
            data: data
        }).then(response => {
            Swal({
                title: '上传成功',
                type: 'success',
                showConfirmButton: false,
                timer: 1500
            });
        }).catch(error => {
            Swal('出错了...', error.response.data || '再试一下吧', 'error');
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

