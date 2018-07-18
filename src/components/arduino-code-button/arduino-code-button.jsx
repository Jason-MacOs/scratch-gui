import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import arduinoCodeButtonIcon from './icon--arduino-code-button.svg';
import styles from './arduino-code-button.css';

const ArduinoCodeButton = function (props) {
    const {
        active,
        className,
        title,
        onClick,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.arduinoCodeButton,
                {
                    [styles.isActive]: active 
                }
            )}
            draggable={false}
            src={arduinoCodeButtonIcon}
            title={title}
            onClick={onClick}
            {...componentProps}
        />
    );
};

ArduinoCodeButton.propTypes = {
    active: PropTypes.bool.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

ArduinoCodeButton.defaultProps = {
    active: false,
    title: 'Arduino Code'
};

export default ArduinoCodeButton;
