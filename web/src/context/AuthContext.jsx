import React, { createContext } from 'react';

const AuthContext = React.createContext({
    isAuth: false,
    token: "",
    userInfo: {},
    role: "",
    login: () => {},
    logout: () => {}
});

export default AuthContext;