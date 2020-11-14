import React, { useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

const AuthLayout = ({ children }) => {
    const login = ({token, role, userInfo}) => {
        setAuth(prevState => {
            return {
                isAuth: true,
                token: token,
                role: role,
                userInfo: userInfo,
                ...prevState
            }
        });
    }


    const logout = () => {
        setAuth(prevState => {
            return {
                isAuth: false,
                token: "",
                role: "",
                userInfo: {},
                ...prevState
            }
        });
    }

    // useEffect(() => {
    //     console.log(auth);
    // }, [auth])


    const [auth, setAuth] = useState({
        isAuth: false,
        token: "",
        role: "",
        userInfo: {},
        login,
        logout,
    });

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

const Test = () => {
    
}

export default AuthLayout;