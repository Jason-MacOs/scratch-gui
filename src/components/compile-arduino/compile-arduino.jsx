import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import compileArduinoIcon from './icon--compile-arduino.svg';
import styles from './compile-arduino.css';

const CompileArduinoComponent = function (props) {
    const {
        active,
        compiling,
        className,
        title,
        onClick,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.compileArduino,
                {
                    [styles.isActive]: compiling
                }
            )}
            draggable={false}
            src={compileArduinoIcon}
            title={title}
            onClick={onClick}
            {...componentProps}
        />
    );
};

CompileArduinoComponent.propTypes = {
    active: PropTypes.bool,
    compiling: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

CompileArduinoComponent.defaultProps = {
    active: false,
    compiling: false,
    title: 'Compile'
};

export default CompileArduinoComponent
