import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import compileArduinoIcon from './icon--compile-arduino.svg';
import styles from './compile-arduino.css';

const CompileArduino = props => {
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
                styles.compileArduino,
                { [ styles.isActive ]: active }
            )}
            draggable={false}
            src={compileArduinoIcon}
            title={title}
            onClick={onClick}
            {...componentProps}
        />
    );
};

CompileArduino.propTypes = {
    active: PropTypes.bool.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

CompileArduino.defaultProps = {
    title: 'Compile'
};

export default CompileArduino;
