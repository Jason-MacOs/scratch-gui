const OPEN_ARDUINO_CODE = 'scratch-gui/arduino-code/OPEN_ARDUINO_CODE';
const CLOSE_ARDUINO_CODE = 'scratch-gui/arduino-code/CLOSE_ARDUINO_CODE';
const SAVE_ARDUINO_CODE = 'scratch-gui/arduino-code/SAVE_ARDUINO_CODE';

const initialState = {
    visible: false,
    code: ''
}

const reducer = function(state, action) {
    if(typeof state === 'undefined') state = initialState;
    switch(action.type) {
    case OPEN_ARDUINO_CODE:
        return Object.assign({}, state, { visible: true });
    case CLOSE_ARDUINO_CODE:
        return Object.assign({}, state, { visible: false });
    case SAVE_ARDUINO_CODE:
        return Object.assign({}, state, { visible: false, code: action.code });
    default:
        return state;
    }
};

const openArduinoCode = () => { return { type: OPEN_ARDUINO_CODE }; };
const closeArduinoCode = () => { return { type: CLOSE_ARDUINO_CODE }; };
const saveArduinoCode = (code) => { return { type: SAVE_ARDUINO_CODE, code }; };

export {
    reducer as default,
    initialState as arduinoCodeInitialState,
    openArduinoCode,
    closeArduinoCode,
    saveArduinoCode
};
