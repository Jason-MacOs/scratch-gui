import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../modal/modal.jsx';
import Box from '../box/box.jsx';
import {FormattedMessage} from 'react-intl';

import styles from './arduino-code.css';

class ArduinoCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        return (
        <Modal
            className={styles.modalContent}
            contentLabel="Arduino代码"
            onRequestClose={this.props.onCancel}
        >
            <Box className={styles.body}>
                <textarea 
                    className={styles.textarea}
                    value={this.props.code}
                    onChange={this.props.onTextChange}
                >
                </textarea>
                <Box className={styles.buttonRow}>
                    <button
                        className={styles.cancelButton}
                        onClick={this.props.onCancel}
                    >
                        <FormattedMessage
                            defaultMessage="Cancel"
                            description="Label for button to cancel arduino code edits"
                            id="gui.arduinoCode.cancel"
                        />
                    </button>
                    <button
                        className={styles.saveButton}
                        onClick={this.props.onSave}
                    >
                        <FormattedMessage
                            defaultMessage="Save"
                            description="Label for button to save arduino code edits"
                            id="gui.arduinoCode.save"
                        />
                    </button>
                </Box>
            </Box>
        </Modal>
        );
    }
}

ArduinoCode.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onTextChange: PropTypes.func.isRequired
};

export default ArduinoCode;
