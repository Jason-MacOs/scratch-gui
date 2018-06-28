import PropTypes from 'prop-types';
import React, {Fragment, con} from 'react';
import {FormattedMessage} from 'react-intl';

import {connect} from 'react-redux';
import {closePopup, submitPopup} from '../../reducers/popup';

import styles from './popup.css';
import closeIcon from '../close-button/icon--close.svg';
import Swal from 'sweetalert2';

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: ''
        };
        this.handleSubmitCode = this.handleSubmitCode.bind(this);
        this.handleChangeCode = this.handleChangeCode.bind(this);
    }
    
    handleChangeCode(e) {
        this.setState({code: e.target.value});
    }

    handleSubmitCode(e) {
        e.preventDefault();
        this.props.onSubmitPopup(btoa(this.state.code));
        Swal({
            toast: true,
            position: 'top-end',
            title: '保存成功', 
            type: 'success', 
            showConfirmButton: false,
            timer: 3000
        });
    } 

    render() {
        return (
            <div className={styles.popupContainer}>
                <div className={styles.headerButton}>
                    <div
                        className={styles.removeButton}
                        onClick={this.props.onClosePopup}
                    >
                        <FormattedMessage
                            defaultMessage="Close"
                            description="Title for button to close code popup"
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
                        value={this.state.code}
                        onChange={this.handleChangeCode}
                    ></textarea>
                </div>
                <div className={styles.submit}>
                    <div 
                        className={styles.submitButton}
                        onClick={this.handleSubmitCode}
                    >
                        <FormattedMessage
                            defaultMessage="Submit Code"
                            description="Title for button to submit code"
                            id="gui.popup.submit"
                        />
                    </div>
                </div>
            </div>
        )
    }
}

Popup.propTypes = {
    onClosePopup: PropTypes.func.isRequired,
    onSubmitPopup: PropTypes.func
};

const mapStateToProps = state => ({
    visible: state.scratchGui.popup.visible,
    code: state.scratchGui.popup.code
});

const mapDispatchToProps = dispatch => ({
    onClosePopup: () => {
        dispatch(closePopup());
    },
    onSubmitPopup: code => {
        dispatch(submitPopup(code));
    }
});
/*
Popup.childContextTypes = {
    code: PropTypes.string
}
*/
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Popup);

