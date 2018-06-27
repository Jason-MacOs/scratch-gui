import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import uploadCodeIcon from './icon--upload-code.svg';
import styles from './upload-code.css';

const UploadCodeComponent = function (props) {
    const {
        active,
        uploading,
        className,
        title,
        onClick,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.uploadCode,
                {
                    [styles.isActive]: uploading
                }
            )}
            draggable={false}
            src={uploadCodeIcon}
            title={title}
            onClick={onClick}
            {...componentProps}
        />
    );
};

UploadCodeComponent.propTypes = {
    active: PropTypes.bool,
    uploading: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

UploadCodeComponent.defaultProps = {
    active: false,
    uploading: false,
    title: 'Upload Code'
};

export default UploadCodeComponent;
