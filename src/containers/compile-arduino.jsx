import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import VM from 'scratch-vm';

import CompileArduinoComponent from '../components/compile-arduino/compile-arduino.jsx';
class CompileArduino extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
        ]);
        this.state={codeCompiling: false};
    }
    handleClick (e) {
        e.preventDefault();
    }
    render () {
        const {
            vm, // eslint-disable-line no-unused-vars
            ...props
        } = this.props;
        return (
            <CompileArduino
                compiling={this.state.codeCompiling}
                onClick={this.handleClick}
                {...props}
            />
        );
    }
}

CompileArduino.propTypes = {
    vm: PropTypes.instanceOf(VM)
};

export default CompileArduino;
