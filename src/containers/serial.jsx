import bindAll from 'lodash.bindall';
import defaultsDeep from 'lodash.defaultsdeep';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import Swal from 'sweetalert2';

import SerialComponent from '../components/serial/serial.jsx';
import {closeSerial, dragSerial, startDrag, stopDrag} from '../reducers/serial.js';
import runCode from '../lib/command-utils';

class Serial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            output: ''
        };
        this._intervalId = null;
    }

    componentDidMount() {
        runCode.openSerial();
        let id = setInterval(() => {
            let cont = runCode.getSerialData().join('');
            this.setState({ output: cont.trim() });
        }, 1000);
        this._intervalId = id;
    }

    componentWillUnmount() {
        clearInterval(this._intervalId);
        this._intervalId = null;
        runCode.closeSerial();
    }


    render() {
        return (
            <SerialComponent
                output={this.state.output}
                {...this.props}
            />
        );
    }
}

Serial.propTypes = {
    onClose: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    x: state.scratchGui.serial.x,
    y: state.scratchGui.serial.y
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(closeSerial()),
    onDrag: (e_, data) => dispatch(dragSerial(data.x, data.y)),
    onStartDrag: () => dispatch(startDrag()),
    onStopDrag: () => dispatch(stopDrag())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Serial);
