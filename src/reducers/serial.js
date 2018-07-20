const OPEN_SERIAL = 'scratch-gui/serial/OPEN_SERIAL';
const CLOSE_SERIAL = 'scratch-gui/serial/CLOSE_SERIAL';
const UPDATE_SERIAL = 'scratch-gui/serial/UPDATE_SERIAL';
const DRAG_SERIAL = 'scratch-gui/serial/DRAG_SERIAL';
const START_DRAG = 'scratch-gui/serial/START_DRAG';
const STOP_DRAG = 'scratch-gui/serial/STOP_DRAG';

const initialState = {
    visible: false,
    output: '',
    x: 292,
    y: 365,
    dragging: false
};

const reducer = (state, action) => {
    if(typeof state === 'undefined') state = initialState;
    switch(action.type) {
    case OPEN_SERIAL:
        return Object.assign({}, state, { visible: true });
    case CLOSE_SERIAL:
        return Object.assign({}, state, { visible: false });
    case UPDATE_SERIAL:
        return Object.assign({}, state, { output: action.output });
    case DRAG_SERIAL:
        return Object.assign({}, state, { x: action.x, y: action.y });
    case START_DRAG:
        return Object.assign({}, state, { dragging: true });
    case STOP_DRAG:
        return Object.assign({}, state, { dragging: false });
    default:
        return state;
    }
};

const openSerial = () => { return { type: OPEN_SERIAL }; };
const closeSerial = () => { return { type: CLOSE_SERIAL }; };
const updateSerial = (output) => { return { type: UPDATE_SERIAL, output }; };
const dragSerial = (x, y) => { return { type: DRAG_SERIAL, x, y }; };
const startDrag = () => { return { type: START_DRAG }; };
const stopDrag = () => { return { type: STOP_DRAG }; };

export {
    reducer as default,
    initialState as serialInitialState,
    openSerial,
    closeSerial,
    updateSerial,
    dragSerial,
    startDrag,
    stopDrag
}
