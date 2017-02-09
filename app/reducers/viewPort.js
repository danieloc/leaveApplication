/**
 * Created by Daniel on 2/9/2017.
 */
const initialState = {
    width: 500,
    height : 500,
};

export default function viewPort(state = initialState, action) {
    switch (action.type) {
        case 'SET_WIDTH' :
            return Object.assign({}, state, {
                width: action.width -55
            });
        case 'SET_HEIGHT' :
            return Object.assign({}, state, {
                height : action.height -100
            });
        default:
            return state;
    }
}