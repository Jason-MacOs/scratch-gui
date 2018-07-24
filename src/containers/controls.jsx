import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';

import analytics from '../lib/analytics';
import ControlsComponent from '../components/controls/controls.jsx';
import {openArduinoCode, saveArduinoCode} from '../reducers/arduino-code.js';
import {openSerial} from '../reducers/serial.js';
import runCode from '../lib/command-utils';

import axios from 'axios';
import Swal from 'sweetalert2';

const HOST = "https://arduino.codepku.com";
let intervalId = -1;

class Controls extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleGreenFlagClick',
            'handleStopAllClick',
            'handleArduinoCodeButtonClick',
            'handleSerialButtonClick',
            'handleCompileCodeClick',
            'handleRunArduinoClick',
            'onProjectRunStart',
            'onProjectRunStop',
            'onWorkspaceUpdate',
            'attachVM',
            'detachVM'
        ]);
        const {
            code
        } = props;
        this.state = {
            projectRunning: false,
            turbo: false,
            isArduino: false,
            connected: false,
            codeCompiling: false
        };
    }
    componentDidMount () {
        this.props.vm.addListener('PROJECT_RUN_START', this.onProjectRunStart);
        this.props.vm.addListener('PROJECT_RUN_STOP', this.onProjectRunStop);
        this.attachVM();

        // initialize Arduino
        let detect = () => {
            if(this.props.vm.extensionManager.isExtensionLoaded('arduino')) {
                runCode.detectAgent();
                runCode.detectDevice();
            }
        };
        intervalId = setInterval(detect, 3000);
        detect();

        let installed = false;
        let updateState = () => {
            if(this.props.vm.extensionManager.isExtensionLoaded('arduino')) {
                let isConnected = runCode.isConnected();
                if(!installed && isConnected) {
                    runCode.installAvrdude();
                    runCode.installDriver();
                    installed = true;
                } else if(installed && isConnected != this.state.connected) {
                    if(isConnected) {
                        Swal.hideLoading();
                        Swal({
                            toast: true,
                            position: 'top',
                            title: '成功',
                            text: 'Arduino设备已连接',
                            type: 'success',
                            showConfirmButton: false,
                            timer: 3000
                        });
                    } else {
                        Swal({
                            toast: true,
                            position: 'top',
                            title: '提示',
                            text: 'Arduino设备已断开连接',
                            type: 'info',
                            timer: 5000
                        });
                    }
                    this.setState({connected: isConnected});
                }
                if((!installed || !isConnected) && !Swal.isVisible()) {
                    Swal({
                         toast: true,
                         position: 'top',
                         title: '提示',
                         text: '尝试连接Arduino设备',
                         type: 'info'
                    });
                    Swal.showLoading();
                }
            }
        };
        setInterval(updateState, 1000);
        updateState();
    }
    componentWillUnmount () {
        this.props.vm.removeListener('PROJECT_RUN_START', this.onProjectRunStart);
        this.props.vm.removeListener('PROJECT_RUN_STOP', this.onProjectRunStop);
        clearInterval(intervalId);
    }
    onProjectRunStart () {
        this.setState({projectRunning: true});
    }
    onProjectRunStop () {
        this.setState({projectRunning: false});
    }
    onWorkspaceUpdate(data) {
        this.setState({isArduino: this.props.vm.extensionManager.isExtensionLoaded('arduino')});
    }
    attachVM() {
        this.props.vm.addListener('workspaceUpdate', this.onWorkspaceUpdate);
    }
    detachVM () {
        this.props.vm.removeListener('workspaceUpdate', this.onWorkspaceUpdate);
    }
    handleGreenFlagClick (e) {
        e.preventDefault();
        if (e.shiftKey) {
            this.setState({turbo: !this.state.turbo});
            this.props.vm.setTurboMode(!this.state.turbo);
        } else {
            this.props.vm.greenFlag();
            analytics.event({
                category: 'general',
                action: 'Green Flag'
            });
        }
    }
    handleStopAllClick (e) {
        e.preventDefault();
        this.props.vm.stopAll();
        analytics.event({
            category: 'general',
            action: 'Stop Button'
        });
    }
    handleArduinoCodeButtonClick (e) {
        e.preventDefault();
        if(this.state.codeCompiling) {
            return;
        }

        if(process.env.NODE_ENV != 'production') {
            let runtime = this.props.vm.runtime;
            let arduino = runtime.getExtensionDevice('arduino');
            if(arduino) {
                let code = arduino.converter.getArduinoCode();
                this.props.onSaveCode(code);
            }
        }

        this.props.onOpenPopup();
    }
    handleSerialButtonClick(e) {
        e.preventDefault();
        if(!this.state.connected || this.state.codeCompiling || this.props.serialOpened) {
            return;
        }
        this.props.onOpenSerial();
    }
    // Added by Maggie Lu
    // compile user input code
    handleCompileCodeClick(e) {
        e.preventDefault();
        if(this.state.codeCompiling) {
            return;
        }

        let code = this.props.code;
        if(process.env.NODE_ENV != 'production') {
            let runtime = this.props.vm.runtime;
            let arduino = runtime.getExtensionDevice('arduino');
            code = arduino == null ? '' : arduino.coverter.getArduinoCode();
        }

        if (code) {
            Swal({
                toast: true,
                position: 'top',
                title: '错误',
                text: '请先保存代码',
                showConfirmButton: false,
                type: 'warning'
            }).then(() => {
                this.props.onOpenPopup();
            });
        } else {
            let data = new FormData();
            data.append("b", "uno");
            data.append("s", btoa(unescape(encodeURIComponent(code))));

            Swal({
                toast: true,
                position: 'top',
                title: '提示',
                text: '正在编译...'
            });
            this.setState({ codeCompiling: true });
            Swal.showLoading();

            return axios({
                method: 'post',
                url: `${HOST}/compile`,
                headers: {
                    'Cache-Control': 'no-cache',
                    'Accept': 'application/json'
                },
                data: data
            }).then((response) => {
                let res = response.data;
                if (res.success == 1) {
                    Swal({
                        toast: true,
                        position: 'top',
                        title: '成功',
                        text: '编译成功！',
                        type: 'success',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    this.setState({downloadUrl: `${HOST}/sketch?s=${res.data.sketch}&b=uno`});
                } else {
                    Swal({
                        //toast: true,
                        //position: 'top',
                        title: '错误',
                        text: res.data.message,
                        type: 'error'
                    });
                }
            }).catch((error) => {
                Swal({
                    toast: true,
                    position: 'top',
                    title: '错误',
                    text: error,
                    type: 'error'
                });
            }).finally(() => {
                Swal.hideLoading();
                this.setState({ codeCompiling: false });
            });
        }
        return null;
    }
    handleRunArduinoClick(e) {
        e.preventDefault();
        if(!this.state.connected || this.state.codeCompiling || this.props.serialOpened) {
            return;
        }
        let p = this.handleCompileCodeClick(e);
        if(p) {
            p.then(() => { runCode.uploadSketchFromUrl(this.state.downloadUrl); });
        }
    }
    render () {
        const {
            vm, // eslint-disable-line no-unused-vars,
            onOpenPopup, // eslint-disable-line no-unused-vars,
            onSaveCode, // eslint-disable-line no-unused-vars,
            onOpenSerial, // eslint-disable-line no-unused-vars,
            code, // eslint-disable-line no-unused-vars,
            serialOpened,
            ...props
        } = this.props;
        return (
            <ControlsComponent
                {...props}
                active={this.state.projectRunning}
                compiling={this.state.codeCompiling}
                serialOpened={serialOpened}
                turbo={this.state.turbo}
                onGreenFlagClick={this.handleGreenFlagClick}
                onStopAllClick={this.handleStopAllClick}
                onArduinoCodeButtonClick={this.handleArduinoCodeButtonClick}
                onSerialButtonClick={this.handleSerialButtonClick}
                onCompileCodeClick={this.handleCompileCodeClick}
                onRunArduinoClick={this.handleRunArduinoClick}
                vm={vm}
                isArduino={this.state.isArduino}
                connected={this.state.connected}
            />
        );
    }
}

Controls.propTypes = {
    vm: PropTypes.instanceOf(VM),
    onOpenPopup: PropTypes.func.isRequired,
    onSaveCode: PropTypes.func.isRequired,
    onOpenSerial: PropTypes.func.isRequired,
    code: PropTypes.string.isRequired,
    serialOpened: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    code: state.scratchGui.arduinoCode.code,
    serialOpened: state.scratchGui.serial.visible
})

const mapDispatchToProps = dispatch => ({
    onOpenPopup: () => dispatch(openArduinoCode()),
    onSaveCode: (code) => dispatch(saveArduinoCode(code)),
    onOpenSerial: () => dispatch(openSerial())
});

// export default Controls;
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Controls);
