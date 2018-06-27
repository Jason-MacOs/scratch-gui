import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import runArduinoIcon from './icon--run-arduino.svg';
import styles from './run-arduino.css';

const RunArduinoComponent = function (props) {
    const {
        active,
        running,
        className,
        title,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.runArduino,
                {
                    [styles.isActive]: running
                }
            )}
            draggable={false}
            src={runArduinoIcon}
            title={title}
            {...componentProps}
        />
    );
};
RunArduinoComponent.propTypes = {
    active: PropTypes.bool,
    running: PropTypes.bool,
    className: PropTypes.string,
    // onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};
RunArduinoComponent.defaultProps = {
    active: false,
    running: false,
    title: 'Run'
};
export default RunArduinoComponent;
