import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../modal/modal.jsx';
import Box from '../box/box.jsx';
import {FormattedMessage} from 'react-intl';
import brace from 'brace';
import AceEditor from 'react-ace';

import styles from './arduino-code.css';

import 'brace/mode/c_cpp';
import 'brace/theme/github';

class ArduinoCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        const {
            code,
            onTextChange,
            onCancel,
            onSave,
            ...props
        } = this.props;

        return (
        <Modal
            className={styles.modalContent}
            contentLabel="Arduino代码"
            onRequestClose={onCancel}
        >
            <Box className={styles.body}>
                <AceEditor
                    mode="c_cpp"
                    theme="github"
                    width="100%"
                    height="90%"
                    fontSize="1rem"
                    value={code}
                    onChange={onTextChange}
                    name="ace_editor"
                    editorProps={{$blockScrolling: true}}
                />

                <Box className={styles.buttonRow}>
                    <button
                        className={styles.cancelButton}
                        onClick={onCancel}
                    >
                        <FormattedMessage
                            defaultMessage="Cancel"
                            description="Label for button to cancel arduino code edits"
                            id="gui.arduinoCode.cancel"
                        />
                    </button>
                    <button
                        className={styles.saveButton}
                        onClick={onSave}
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
    code: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onTextChange: PropTypes.func.isRequired
};

export default ArduinoCode;
