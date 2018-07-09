import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import icon from './icon--serial-port.svg';
import styles from './upload-code.css';

const SerialPortComponent = function(props) {
    const {
        className,
        title,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.uploadCode
            )}
            draggable={false}
            src={icon}
            title={title}
            {...componentProps}
        />
    );
};

SerialPortComponent.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string
};
SerialPortComponent.defaultProps = {
    title: 'Serial'
};
export default SerialPortComponent;
