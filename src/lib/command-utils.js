import axios from 'axios';
import io from 'socket.io-client';
import Swal from 'sweetalert2';

let runCode = (function() {
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

    function _openSerial() {
        if(_ws && _ws.connected && _device) {
            _ws.emit('command', `open ${_device['Name']} 115200`);
        }
    }

    function _closeSerial() {
        if(_ws && _ws.connected && _device) {
            _ws.emit('command', `close ${_device['Name']}`);
        }
        _serialData = [];
    }

    let _serialData = [];
    let _line = '';
    function _onSerialMessage(evt) {
        if(evt.indexOf('"D"') != -1) {
            // Parse data from serial
            let data = JSON.parse(evt);
            _line += data['D'];

            if(_line.indexOf('\r\n') != -1) {
                _serialData.push(_line);
                if(_serialData.length >= 11) {
                    _serialData.shift();
                }
                //let cont = _serialData.join('');
                //window.serialData = cont;
                _line = '';
            }
        } else if(evt.indexOf('"Flash"') != -1) {
            let data = JSON.parse(evt);
            if(data['Flash'] == 'Ok' && data['ProgrammerStatus'] == 'Done') {
                Swal.hideLoading();
                Swal({
                    toast: true,
                    position: 'top',
                    title: '上传成功',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 2000
                //}).then(() => {
                    //_ws.emit('command', `open ${_device['Name']} 115200`);
                });
            }
        } else if(evt.indexOf('"Error"') != -1) {
            let data = JSON.parse(evt);
            if(data['ProgrammerStatus'] == 'Error') {
                Swal.hideLoading();
                Swal({
                    toast: true,
                    position: 'top',
                    title: '上传失败',
                    type: 'error',
                    text: data['Msg'],
                    showConfirmButton: false
                });
            }
        } else if(evt.indexOf('"Open"') != -1) {
            let data = JSON.parse(evt);
            if(data['Baud'] == 115200) {
                Swal({
                    toast: true,
                    position: 'top',
                    title: '成功',
                    text: '串口已连接',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 3000
                });
                //_serialData.push('串口已连接\r\n');
            }
        } else if(evt.indexOf('"OpenFail"') != -1) {
            let data = JSON.parse(evt);
            if(data['Baud'] == 115200) {
                Swal({
                    toast: true,
                    position: 'top',
                    title: '失败',
                    text: '串口连接失败',
                    type: 'error',
                    showConfirmButton: false,
                    timer: 3000
                });
                //_serialData.push('串口连接失败\r\n');
            }
        } else if(evt.indexOf('"Close"') != -1) {
            let data = JSON.parse(evt);
            if(data['Baud'] == 115200) {
                Swal({
                    toast: true,
                    position: 'top',
                    title: '提示',
                    text: '串口已断开',
                    type: 'info',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        }
    }

    function _getSerialData() {
        return _serialData;
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
            Swal({
                toast: true,
                position: 'top',
                title: '正在上传...',
                type: 'info',
                showConfirmButton: false
            });
            Swal.showLoading();
            if(_ws && _ws.connected) {
                _ws.emit('command', `close ${_device['Name']}`);
            }
            setTimeout(() => {
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
                        if(resp.status == 202) {
                        } else {
                            Swal.hideLoading();
                            Swal({
                                toast: true,
                                position: 'top',
                                title: '上传失败',
                                text: resp.data,
                                type: 'error',
                                showConfirmButton: false,
                            });
                        }
                    }).catch(err => {
                        console.log(err);
                        Swal.hideLoading();
                        Swal({
                            toast: true,
                            position: 'top',
                            title: '上传失败',
                            text: err,
                            type: 'error'
                        });
                    })
                }).catch((error) => {
                    Swal.hideLoading();
                    console.log(error)
                })
            }, 1000);
        }
    }

    return {
        downloadSketch: function(url) {
            return _downloadSketch(url);
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
        openSerial: function() {
            return _openSerial();
        },
        closeSerial: function() {
            return _closeSerial();
        },
        getSerialData: function() {
            return _getSerialData();
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
