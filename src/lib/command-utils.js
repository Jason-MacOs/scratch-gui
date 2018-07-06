import axios from 'axios';
import io from 'socket.io-client';
import Swal from 'sweetalert2';

var runCode = (function() {
    const PROTOCOL = window.location.protocol;
    const LOCALHOST_NAME = 'http://127.0.0.1';
    // connections on a range of ports from 8990 to 9000
    const EXTRA = {
        auth: {},
        network: false,
        wait_for_upload_port: false, 
        use_1200bps_touch: false
    };

    let _info = null;
    function _detectAgent() {
        if(_ws && _ws.connected) {
            return;
        }
        let found = false;
        let ports = Array.from({length: 11}, (x, i) => i + 8990);
        if(_info) {
            ports = [ parseInt(_info.http.split(':').pop()) ];
        }

        let detect = function() {
            if(!found && ports.length == 0) {
                _info = null;
                Swal({
                    toast: true,
                    position: 'top',
                    title: '失败',
                    text: '请启动Arduino助手！',
                    type: 'warning',
                    timer: 3000
                });
            }
            if(ports.length > 0) {
                let port = ports.shift();
                axios({
                    method: 'GET',
                    url: `${LOCALHOST_NAME}:${port}/info`,
                }).then(resp => {
                    if(resp.status == 200) {
                        _info = resp.data;
                        found = true;
                    } else {
                        detect();
                    }
                }).catch(error => {
                    detect();
                });
            }
        };
        detect();
        return _info != null; // 上一次的结果
    }

    function _hasAgent() {
        return _info != null; // 上一次的结果
    }

    let _ws = null, _device = null;
    function _connect() {
        if((_ws && _ws.connected) || !_info) {
            return;
        }
        if(window['WebSocket']) {
            // Connect WebSocket
            _ws = io(_info.ws);

            if(!_ws.connected) {
                _ws.on('connect', () => {
                    _detectDevice();
                });
            } else {
                _detectDevice();
            }
            _ws.on('message', _onSerialMessage);
            _ws.on('disconnect', (evt) => {
                _device = null;
                _ws = null;
            });
        } else {
            Swal({
                toast: true,
                position: 'top',
                title: '注意',
                text: '浏览器不支持WebSockets，请更换浏览器后重试！',
                type: 'warning',
                timer: 3000
            });
        }
    }

    let _serialData = '';
    const serialToast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false
    });
    function _onSerialMessage(evt) {
        if(evt.indexOf('"D"') != -1) {
            let data = JSON.parse(evt);
            _serialData += data['D'];
        }

        if(_serialData.indexOf('\r\n') != -1) {
            console.debug(_serialData);
            
            _serialData = '';
        }
    }

    const DOWNLOAD_AVRDUDE = 'downloadtool avrdude 6.3.0-arduino9';
    let _avrdude = false;
    function _installAvrdude() {
        if(!_ws || !_ws.connected) {
            _connect();
        } else {
            _ws.on('message', _onAvrdudeMessage);
            _ws.emit('command', DOWNLOAD_AVRDUDE);
        }
    }

    function _onAvrdudeMessage(evt) {
        if(evt == DOWNLOAD_AVRDUDE) {
            _avrdude = true;
        } else if(_avrdude && evt.indexOf('DownloadStatus') != -1) {
            try {
                let resp = JSON.parse(evt);
                if(resp['DownloadStatus'] == 'Success') {
                    console.log('Install plugin "avrdude(6.3.0-arduino9)" success!');
                    _avrdude = false;
                } else if(resp['DownloadStatus'] == 'Failed') {
                    console.log('Install plugin "avrdude(6.3.0-arduino9)" failed!');
                    _avrdude = false;
                } else {
                    console.log(resp['Msg']);
                }
            } catch(err) {
                console.log(err);
            } finally {
            }
        }
    }

    const DOWNLOAD_DRIVER = 'downloadtool windows-drivers 1.8.0';
    let _driver = false;
    function _installDriver() {
        if(!_ws || !_ws.connected) {
            _connect();
        } else {
            _ws.on('message', _onDriverMessage);
            _ws.emit('command', DOWNLOAD_DRIVER);
        }
    }

    function _onDriverMessage(evt) {
        if(evt == DOWNLOAD_DRIVER) {
            _driver = true;
        } else if(_driver && evt.indexOf('DownloadStatus') != -1) {
            try {
                let resp = JSON.parse(evt);
                if(resp['DownloadStatus'] == 'Success') {
                    console.log('Install plugin "windows-driver(1.8.0)" success!');
                    _driver = false;
                } else if(resp['DownloadStatus'] == 'Failed') {
                    console.log('Install plugin "windows-driver(1.8.0)" failed!');
                    _driver = false;
                } else {
                    console.log(resp['Msg']);
                }
            } catch(err) {
                console.log(err);
            } finally {
            }
        }
    }

    function _detectDevice() {
        if(!_ws || !_ws.connected) {
            _connect();
        } else {
            _ws.on('message', _onListMessage);
            _ws.emit('command', 'list');
        }
    }

    let _listCount = 0;
    function _onListMessage(evt) {
        /* Sample:
{
    "Ports": [
		{
			"Name": "COM5",
			"SerialNumber": "",
			"DeviceClass": "",
			"IsOpen": false,
			"IsPrimary": false,
			"Baud": 0,
			"BufferAlgorithm": "",
			"Ver": "1.1.71",
			"NetworkPort": false,
			"VendorID": "0x1A86",
			"ProductID": "0x7523"
		}
	],
	"Network": false
}
         */
        if(evt == 'list') {
            _listCount = 2;
        } else if(_listCount > 0 && evt.indexOf('Ports') != -1) {
            try {
                let resp = JSON.parse(evt);
                if(!resp['Network']) {
                    if(resp['Ports'].length) {
                        _device = resp['Ports'][0];
                        if(!_device['IsOpen']) {
                            _ws.emit('command', `open ${_device['Name']} 115200`);
                        }
                    } else {
                        _device = null;
                    }
                }
                _listCount--;
            } catch(err) {
                console.log(err);
            } finally {
            }
        } else {
            _ws.off('message', _onListMessage);
        }
    }

    function _isConnected() {
        return _ws != null && _ws.connected && _hasDevice();
    }

    function _send() {
        if(!_isConnected()) {
            Swal({
                toast: true,
                position: 'top',
                title: '正在编译',
                type: 'error',
                timer: 3000
            });
        }
    }

    function _hasDevice() {
        return _device != null;
    }

    function _uploadSketchFromUrl(url) {
        if(!_hasDevice()) {
            Swal({
                toast: true,
                position: 'top',
                title: '请连接Arduino设备',
                showConfirmButton: false,
                type: 'error'
            });
        } else {
            axios({
                method: 'GET',
                url: url,
            }).then((response) => {
                var data = response.data.data;
                data['port'] = _device['Name'];
                data['extra'] = EXTRA;
                let href = PROTOCOL == 'https:' ? _info['http'] : _info['http'];
                axios({
                    method: 'POST',
                    url: `${href}/upload`,
                    data: data
                }).then(resp => {
                    console.debug(resp);
                    if(resp.status == 202) {
                        Swal({
                            toast: true,
                            position: 'top',
                            title: '上传成功',
                            type: 'success',
                            showConfirmButton: false,
                            timer: 3000
                        });
                    } else {
                        Swal({
                            toast: true,
                            position: 'top',
                            title: '上传成功',
                            text: resp.data,
                            type: 'success',
                            showConfirmButton: false,
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    Swal({
                        toast: true,
                        position: 'top',
                        title: '上传失败',
                        text: err,
                        type: 'error'
                    });
                    //Swal('出错了...', error.response.data || '再试一下吧', 'error');
                })
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    return {
        downloadSketch: function(url) {
            return _downloadSketch(url);
        },
        openWebSocket: function() {
            return _openWebSocket();
        },
        detectAgent: function() {
            return _detectAgent();
        },
        detectDevice: function() {
            return _detectDevice();
        },
        isConnected: function() {
            return _isConnected();
        },
        connect: function() {
            return _connect();
        },
        uploadSketchFromUrl: function(url) {
            return _uploadSketchFromUrl(url);
        },
        installAvrdude: function() {
            return _installAvrdude();
        },
        installDriver: function() {
            return _installDriver();
        }
    }
})()

export default runCode;
