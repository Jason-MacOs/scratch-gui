import bindAll from 'lodash.bindall';
import defaultsDeep from 'lodash.defaultsdeep';
import PropTypes from 'prop-types';
import React from 'react';
import ArduinoCodeComponent from '../components/arduino-code/arduino-code.jsx';
import {connect} from 'react-redux';
import Swal from 'sweetalert2';
import {saveArduinoCode, closeArduinoCode} from '../reducers/arduino-code.js';

class ArduinoCode extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleCancel',
            'handleSave',
            'handleTextChange'
        ]);
        this.state = {
            inputValue: props.code
        };
    }

    handleCancel(e) {
        e.preventDefault();
        this.props.onCancel();
    }

    handleSave(e) {
        e.preventDefault();
        this.props.onSave(this.state.inputValue);
        Swal({
            toast: true,
            position: 'top',
            title: '保存成功', 
            type: 'success', 
            showConfirmButton: false,
            timer: 3000
        });
    }

    handleTextChange(e) {
        this.setState({inputValue: e.target.value});
    }

    render() {
        const {
            code,
            ...componentProps
        } = this.props;
        return (
            <ArduinoCodeComponent
                code={this.state.inputValue}
                onCancel={this.handleCancel}
                onSave={this.handleSave}
                onTextChange={this.handleTextChange}
            />
        );
    }
}

ArduinoCode.propTypes = {
    code: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    code: state.scratchGui.arduinoCode.code
});

const mapDispatchToProps = dispatch => ({
    onSave: (b64Code) => dispatch(saveArduinoCode(b64Code)),
    onCancel: () => dispatch(closeArduinoCode())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArduinoCode);
