const CLOSE_POPUP = 'scratch-gui/popup/CLOSE_POPUP';
const OPEN_POPUP = 'scratch-gui/popup/OPEN_POPUP';
const SUBMIT_POPUP = 'scratch-gui/popup/SUBMIT_POPUP';

const initialState = {
    visible: false,
    code: ''
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
        })
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
}

export {
    reducer as default,
    initialState as popupInitialState,
    openPopup,
    closePopup,
    submitPopup
};
