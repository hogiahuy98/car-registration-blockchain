import React, { useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

const defaultAuth = {
    isAuth: false,
    token: null,
    role: null,
    userInfo: {},
}

const AuthLayout = (props) => {
    const localAuth = JSON.parse(localStorage.getItem('auth'))
    const [auth, setAuth] = useState(localAuth ? localAuth : defaultAuth);
    const login = async ({token, role, userInfo}) => {
        await setAuth(prevState => {
            return {
                ...prevState,
                isAuth: true,
                token: token,
                role: role,
                userInfo: userInfo,
            }
        });
    }

    useEffect(() => localStorage.setItem('auth', JSON.stringify(auth)),[auth]);

    const logout = () => {
        setAuth(prevState => {
            return {
                ...prevState,
                isAuth: false,
                token: "",
                role: "",
                userInfo: {}
            }
        });
        localStorage.removeItem('auth');
    }

    return (
        <AuthContext.Provider value={{auth, login, logout}}>
            {props.children}
        </AuthContext.Provider>
    )
}


export default AuthLayout;