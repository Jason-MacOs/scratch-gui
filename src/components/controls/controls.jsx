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
import UploadCode from '../upload-code/upload-code.jsx';
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
    uploadCodeTitle: {
        id: 'gui.controls.uploadCode',
        defaultMessage: 'Upload Code',
        description: 'Upload code button title'
    }
});

const Controls = function (props) {
    const {
        active,
        uploading,
        compiling,
        running,
        className,
        intl,
        onGreenFlagClick,
        onStopAllClick,
        onUploadCodeClick,
        onCompileCodeClick,
        onRunCodeClick,
        turbo,
        vm,
        isArduino,
        ...componentProps
    } = props;
    
    return (
        <div
            className={classNames(styles.controlsContainer, className)}
            {...componentProps}
        >
            {isArduino ? <CompileArduino
                compiling={compiling}
                title={intl.formatMessage(messages.compileTitle)}
                onClick={onCompileCodeClick}
            /> : <GreenFlag
                active={active}
                title={intl.formatMessage(messages.goTitle)}
                onClick={onGreenFlagClick}
            />}

            {isArduino ? <RunArduino
                running={running}
                title={intl.formatMessage(messages.runTitle)}
                onClick={onRunCodeClick}
            />: <StopAll
                active={active}
                title={intl.formatMessage(messages.stopTitle)}
                onClick={onStopAllClick}
            />}
            {isArduino ? <UploadCode
                uploading={uploading}
                title={intl.formatMessage(messages.uploadCodeTitle)}
                onClick={onUploadCodeClick}
            /> : null}
            {turbo ? (
                <TurboMode />
            ) : null}
        </div>
    );
};

Controls.propTypes = {
    active: PropTypes.bool,
    uploading: PropTypes.bool,
    compiling: PropTypes.bool,
    running: PropTypes.bool,
    className: PropTypes.string,
    intl: intlShape.isRequired,
    onGreenFlagClick: PropTypes.func.isRequired,
    onStopAllClick: PropTypes.func.isRequired,
    onCompileCodeClick: PropTypes.func.isRequired,
    onUploadCodeClick: PropTypes.func.isRequired,
    onRunCodeClick: PropTypes.func.isRequired,
    turbo: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired,
    isArduino: PropTypes.bool
};

Controls.defaultProps = {
    active: false,
    uploading: false,
    compiling: false,
    running: false,
    turbo: false,
    isArduino: false
};

export default injectIntl(Controls);
