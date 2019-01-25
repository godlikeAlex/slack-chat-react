import {combineReducers} from 'redux';
import * as actionTypes from '../actions/types';

const initialUserState = {
    currentUser: null,
    isLoading: true
};

const user_reducer  = (state = initialUserState, action)=>{
    const {type, payload} = action;
    
    switch (type) {
        case actionTypes.SET_USER:
            return {
                currentUser: payload.currentUser,
                isLoading: false
            };
        case actionTypes.CLEAR_USER:
            return{
                ...state,
                isLoading: false
            };
        default:
            return state;
    }
};

// Chanel reducer
const initialChannelState = {
    currentChannel: null,
    isPrivateChannel: false,
    userPosts: null
};

const channel_reducer = (state = initialChannelState, action ) => {
    const {type, payload} = action;

    switch (type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel : payload.currentChannel
            };
        case actionTypes.SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel: payload.isPrivateChannel
            };
        case actionTypes.SET_USER_POSTS:
            return {
                ...state,
                userPosts: payload.userPosts
            };
        default:
            return state
    }
};

const initialColorsState = {
    primaryColor: '#492098',
    secondaryColor: '#eee',
};

const colors_reducer = (state = initialColorsState, action) => {
    const {type, payload} = action;

    switch (type) {
        case actionTypes.SET_COLORS:
            return {
                primaryColor: payload.primaryColor,
                secondaryColor: payload.secondaryColor
            };
        default:
            return state
    }
};

const rootReducer = combineReducers({
    user: user_reducer,
    channel: channel_reducer,
    colors: colors_reducer
});

export default rootReducer;