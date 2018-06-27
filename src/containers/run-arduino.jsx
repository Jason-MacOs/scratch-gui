import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import VM from 'scratch-vm';

import RunArduinoComponent from '../components/run-arduino/run-arduino.jsx';

class RunArduino extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick'
        ]);
        this.state={codeRunning: false};
    }
    componentDidMount () {
    }
    componentWillUnmount () {
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
            <RunArduinoComponent
                running={this.state.codeRunning}
                onClick={this.handleClick}
                {...props}
            />
        );
    }
}

RunArduino.propTypes = {
    vm: PropTypes.instanceOf(VM)
};

export default RunArduino;
