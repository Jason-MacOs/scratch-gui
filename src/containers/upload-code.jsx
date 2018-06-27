import bindAll from 'lodash.bindAll';
import PropTypes from 'prop-types';
import React from 'react';

import VM from 'scratch-vm';

import UploadCodeComponent from '../components/upload-code/upload-code.jsx';

class UploadCode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick'
        ]);
        this.state = {codeUploading: false};
    }
    handleClick (e) {
        e.preventDefault();
    }

    render () {
        const {
            vm,
            ...props
        } = this.props;
        return (
            <UploadCodeComponent
                uploading={this.state.codeUploading}
                onClick={this.handleClick}
            />
        )
    }
}

UploadCode.proTypes = {
    vm: PropTypes.instanceOf(VM)
};

export default UploadCode;
