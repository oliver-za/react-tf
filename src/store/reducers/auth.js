import * as actionTypes from '../actions/actionTypes'
import { updObj } from '../utility';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false
};

const authBegin = (state, action) => {
    return updObj(state, {error: null, loading: true})
};

const authSuccess = (state, action) => {
    return updObj(state, {
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false
    });
};

const authFailed = (state, action) => {
    return updObj(state, {
        error: action.error,
        loading: false
    });
};

const authLogout = (state, action) => {
    return updObj(state, {
        token: null,
        userId: null
    })
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.AUTH_BEGIN: return authBegin(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAILED: return authFailed(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        default: return state;
    }
};

export default reducer;