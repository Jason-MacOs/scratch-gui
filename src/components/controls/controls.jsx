import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import VM from 'scratch-vm';

import GreenFlag from '../green-flag/green-flag.jsx';
import StopAll from '../stop-all/stop-all.jsx';
import TurboMode from '../turbo-mode/turbo-mode.jsx';
import CompileArduino from '../compile-arduino/compile-arduino.jsx';
import RunArduino from '../run-arduino/run-arduino.jsx';
import ArduinoCodeButton from '../arduino-code-button/arduino-code-button.jsx';
import SerialButton from '../serial-button/serial-button.jsx';
import styles from './controls.css';

const messages = defineMessages({
    goTitle: {
        id: 'gui.controls.go',
        defaultMessage: 'Go',
        description: 'Green flag button title'
    },
    stopTitle: {
        id: 'gui.controls.stop',
        defaultMessage: 'Stop',
        description: 'Stop button title'
    },
    compileTitle: {
        id: 'gui.controls.compile',
        defaultMessage: 'Compile',
        description: 'Compile button title'
    },
    runTitle: {
        id: 'gui.controls.run',
        defaultMessage: 'Run',
        description: 'Run button title'
    },
    arduinoCodeButtonTitle: {
        id: 'gui.controls.arduinoCodeButton',
        defaultMessage: 'Arduino Code',
        description: 'Show Arduino code button'
    },
    serialPortTitle: {
        id: 'gui.controls.serialPort',
        defaultMessage: 'Serial Output',
        description: 'Serial port output.'
    }
});

const Controls = function (props) {
    const {
        active,
        compiling,
        className,
        intl,
        onGreenFlagClick,
        onStopAllClick,
        onArduinoCodeButtonClick,
        onSerialButtonClick,
        onCompileCodeClick,
        onRunArduinoClick,
        turbo,
        vm,
        isArduino,
        connected,
        serialOpened,
        ...componentProps
    } = props;
    
    return (
        <div
            className={classNames(styles.controlsContainer, className)}
            {...componentProps}
        >
            {isArduino ? [
            <CompileArduino
                active={!compiling}
                title={intl.formatMessage(messages.compileTitle)}
                onClick={onCompileCodeClick}
                key='compile-arduino'
            />,
            <RunArduino
                active={!compiling && connected}
                connected={connected}
                title={intl.formatMessage(messages.runTitle)}
                onClick={onRunArduinoClick}
                key='run-arduino'
            />,
            <ArduinoCodeButton
                active={!compiling}
                title={intl.formatMessage(messages.arduinoCodeButtonTitle)}
                onClick={onArduinoCodeButtonClick}
                key='arduino-code-button'
            />,
            <SerialButton
                active={connected && !compiling && !serialOpened}
                opened={serialOpened}
                title={intl.formatMessage(messages.serialPortTitle)}
                onClick={onSerialButtonClick}
                key='serial-button'
            />
            ] : [
            <GreenFlag
                active={active}
                title={intl.formatMessage(messages.goTitle)}
                onClick={onGreenFlagClick}
                key='start'
            />,
            <StopAll
                active={active}
                title={intl.formatMessage(messages.stopTitle)}
                onClick={onStopAllClick}
                key='stop'
            />
            ]
            }
            {turbo ? (
                <TurboMode />
            ) : null}
        </div>
    );
};

Controls.propTypes = {
    active: PropTypes.bool,
    compiling: PropTypes.bool.isRequired,
    className: PropTypes.string,
    intl: intlShape.isRequired,
    onGreenFlagClick: PropTypes.func.isRequired,
    onStopAllClick: PropTypes.func.isRequired,
    onCompileCodeClick: PropTypes.func.isRequired,
    onArduinoCodeButtonClick: PropTypes.func.isRequired,
    onSerialButtonClick: PropTypes.func.isRequired,
    onRunArduinoClick: PropTypes.func.isRequired,
    turbo: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired,
    isArduino: PropTypes.bool,
    connected: PropTypes.bool.isRequired,
    serialOpened: PropTypes.bool.isRequired
};

Controls.defaultProps = {
    active: false,
    turbo: false,
    isArduino: false,
};

export default injectIntl(Controls);
