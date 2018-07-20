import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import runArduinoIcon from './icon--run-arduino.svg';
import styles from './run-arduino.css';

const RunArduino = props => {
    const {
        active,
        connected,
        className,
        title,
        onClick,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.runArduino,
                { [styles.isActive]: active }
            )}
            draggable={false}
            src={runArduinoIcon}
            title={title}
            onClick={onClick}
            {...componentProps}
        />
    );
};

RunArduino.propTypes = {
    active: PropTypes.bool.isRequired,
    className: PropTypes.string,
    connected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

RunArduino.defaultProps = {
    title: 'Run',
};

export default RunArduino;
