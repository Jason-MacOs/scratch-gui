import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';

import analytics from '../lib/analytics';
import ControlsComponent from '../components/controls/controls.jsx';
import {openPopup} from '../reducers/popup';
import runCode from '../lib/command-utils';

import axios from 'axios';
import Swal from 'sweetalert2';

const HOST = "https://arduino.codepku.com";

class Controls extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleGreenFlagClick',
            'handleStopAllClick',
            'handleUploadCodeClick',
            'handleCompileCodeClick',
            'handleRunCodeClick',
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
            codeCompiling: false,
            codeUploading: false,
            codeRunning: false,
            compiled: false
        };
    }
    componentDidMount () {
        this.props.vm.addListener('PROJECT_RUN_START', this.onProjectRunStart);
        this.props.vm.addListener('PROJECT_RUN_STOP', this.onProjectRunStop);
        this.attachVM();
    }
    componentWillUnmount () {
        this.props.vm.removeListener('PROJECT_RUN_START', this.onProjectRunStart);
        this.props.vm.removeListener('PROJECT_RUN_STOP', this.onProjectRunStop);
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
    handleUploadCodeClick () {
        this.props.onOpenPopup();
    }
    // compile user input code
    handleCompileCodeClick() {
        if (!this.props.code) {
            Swal("小提示", "请先上传代码", 'warning');
        } else {
            let data = new FormData();
            data.append("b", "uno");
            data.append("s", this.props.code);
            axios({
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
                        position: 'top-end',
                        title: '编译成功',
                        type: 'success',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    this.setState({downloadUrl: `${HOST}/sketch?s=${res.data.sketch}&b=uno`});
                } else {
                    Swal('出错了...', res.data.message, 'error'); 
                }
            }).catch((error) => {
                Swal('出错了...', error, 'error');
            }) 
        }
    }
    handleRunCodeClick() {
        this.handleCompileCodeClick();
        var r = runCode;
        r.getReply();
        r.downloadSketch(this.state.downloadUrl);
    }
    render () {
        const {
            vm, // eslint-disable-line no-unused-vars,
            onOpenPopup,
            ...props
        } = this.props;
        return (
            <ControlsComponent
                {...props}
                active={this.state.projectRunning}
                compiling={this.state.codeCompiling}
                uploading={this.state.codeUploading}
                running={this.state.codeRunning}
                turbo={this.state.turbo}
                onGreenFlagClick={this.handleGreenFlagClick}
                onStopAllClick={this.handleStopAllClick}
                onUploadCodeClick={this.handleUploadCodeClick}
                onCompileCodeClick={this.handleCompileCodeClick}
                onRunCodeClick={this.handleRunCodeClick}
                vm={vm}
                isArduino={this.state.isArduino}
            />
        );
    }
}

Controls.propTypes = {
    vm: PropTypes.instanceOf(VM),
    onOpenPopup: PropTypes.func.isRequired,
    code: PropTypes.string
};

const mapStateToProps = state => ({
    code: state.scratchGui.popup.code
})

const mapDispatchToProps = dispatch => ({
    onOpenPopup: () => dispatch(openPopup())
});

// export default Controls;
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Controls);
