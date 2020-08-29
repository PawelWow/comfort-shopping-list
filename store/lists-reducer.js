import { ADD_LIST } from './lists-actions';

const initialState = {
    shoppingLists: []
};

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_LIST:
            return {
                shoppingLists: state.shoppingLists.concat(action.newList)
            };
        default:
            return state;
    }
}