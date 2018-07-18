import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import Draggable from 'react-draggable';

import styles from './serial.css';
import closeIcon from '../close-button/icon--close.svg';

class Serial extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    componentDidUpdate() {
        let textarea = this.refs.outputText;
        if(textarea) {
            textarea.scrollTop = textarea.scrollHeight;
        }
    }

    render() {
        const {
            ...props
        } = this.props;

        return (
            <Draggable
                bounds="parent"
                position={{x: props.x, y: props.y}}
                onDrag={props.onDrag}
                onStart={props.onStartDrag}
                onStop={props.onStopDrag}
            >
                <div className={styles.container}>
                    <div className={styles.popupContainer}>
                        <div className={styles.headerButton}>
                            <div
                                className={styles.removeButton}
                                onClick={props.onClose}
                            >
                                <FormattedMessage
                                    defaultMessage="Close"
                                    description="Close button"
                                    id="gui.popup.remove"
                                />
                                <img
                                    className={styles.closeIcon}
                                    src={closeIcon}
                                />
                            </div>
                        </div>
                        <div className={styles.popupBody}>
                            <textarea
                                ref="outputText"
                                readOnly
                                className={styles.textarea}
                                value={props.output}
                            ></textarea>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}

Serial.propTypes = {
    output: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onDrag: PropTypes.func.isRequired,
    onStartDrag: PropTypes.func.isRequired,
    onStopDrag: PropTypes.func.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
}

export default Serial;
