const CLOSE_POPUP = 'scratch-gui/popup/CLOSE_POPUP';
const OPEN_POPUP = 'scratch-gui/popup/OPEN_POPUP';
const SUBMIT_POPUP = 'scratch-gui/popup/SUBMIT_POPUP';
const CLOSE_SERIAL = 'scratch-gui/serial/CLOSE_SERIAL';
const OPEN_SERIAL = 'scratch-gui/serial/OPEN_SERIAL';
const UPDATE_SERIAL = 'scratch-gui/serial/UPDATE_SERIAL';

const initialState = {
    visible: false,
    code: ''
}

const serialState = {
    visible: false,
    output: ''
}

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CLOSE_POPUP:
        return Object.assign({}, state, {
            visible: false
        });
    case OPEN_POPUP:
        return Object.assign({}, state, {
            visible: true
        });
    case SUBMIT_POPUP:
        return Object.assign({}, state, {
            visible: false,
            code: action.code
        });
    default:
        return state;
    }
};

const serialReducer = function(state, action) {
    if (typeof state === 'undefined') state = serialState;
    switch(action.type) {
    case CLOSE_SERIAL:
        return Object.assign({}, state, { visible: false });
    case OPEN_SERIAL:
        return Object.assign({}, state, { visible: true });
    case UPDATE_SERIAL:
        return Object.assign({}, state, {
            output: action.output
        });
    default:
        return state;
    }
};

const openPopup = function () {
    return {type: OPEN_POPUP};
};

const closePopup = function () {
    return {type: CLOSE_POPUP};
};

const submitPopup = function (code) {
    return {
        type: SUBMIT_POPUP,
        code
    };
};
const openSerial = function() {
    return {type: OPEN_SERIAL};
};
const closeSerial = function() {
    return {type: CLOSE_SERIAL};
};
const updateSerial = function(output) {
    return {
        type: UPDATE_SERIAL,
        output
    };
};

export {
    reducer as default,
    serialReducer,
    initialState as popupInitialState,
    serialState as serialInitialState,
    openPopup,
    closePopup,
    submitPopup,
    openSerial,
    closeSerial,
    updateSerial
};
