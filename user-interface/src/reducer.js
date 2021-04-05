const initialState = {
    loggedIn: false,
    userID: "",
    token: "",
    keyId: ""
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case "LOGIN_USER":
            return {
                ...state,
                loggedIn: true,
                userID: action.payload.userID,
                token: action.payload.token,
                keyID: action.payload.keyID
            };
        case "LOGOUT_USER":
            return {
                ...state,
                loggedIn: false,
                userID: "",
                token: "",
                keyID: ""
            };
        default:
            return state;
    }
}

export default reducer;