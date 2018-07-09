import PropTypes from 'prop-types';
import React, {Fragment, con} from 'react';
import {FormattedMessage} from 'react-intl';

import {connect} from 'react-redux';
import {closeSerial} from '../../reducers/popup';
import runCode from '../../lib/command-utils';

import styles from './popup.css';
import closeIcon from '../close-button/icon--close.svg';

class SerialPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            output: '',
            intervalId: null
        };
    }

    componentDidMount() {
        runCode.openSerial();
        let id = setInterval(() => {
            let cont = runCode.getSerialData().join('');
            this.setState({ output: cont });
        }, 1000);
        this.setState({intervalId: id});
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
        this.setState({intervalId: null});
        runCode.closeSerial();
    }

    render() {
        return (
            <div className={styles.popupContainer}>
                <div className={styles.headerButton}>
                    <div
                        className={styles.removeButton}
                        onClick={this.props.onCloseSerial}
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
                        className={styles.textarea}
                        value={this.state.output}
                    ></textarea>
                </div>
            </div>
        );
    }
}

SerialPopup.propTypes = {
    onCloseSerial: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    visible: state.scratchGui.serial.visible,
    output: state.scratchGui.serial.output
});

const mapDispatchToProps = dispatch => ({
    onCloseSerial: () => { dispatch(closeSerial()); }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SerialPopup);
