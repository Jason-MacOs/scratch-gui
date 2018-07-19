import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import icon from './icon--serial-button.svg';
import styles from './serial-button.css';

const SerialButton = function(props) {
    const {
        active,
        opened,
        className,
        title,
        onClick,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.serialButton,
                { [ styles.isActive ]: active }
            )}
            draggable={false}
            src={icon}
            title={title}
            onClick={onClick}
            {...componentProps}
        />
    );
};

SerialButton.propTypes = {
    active: PropTypes.bool.isRequired,
    opened: PropTypes.bool.isRequired,
    className: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func.isRequired
};

SerialButton.defaultProps = {
    title: 'Serial'
};

export default SerialButton;
