import React, { useState, useEffect } from 'react';
import { useHistory, Redirect } from 'umi';
import { logout, login } from '@/helpers/Auth';
import axios from 'axios';

const defaultAuth = {
    isAuth: false,
    token: null,
    role: null,
    userInfo: {},
}

const AuthLayout = (props) => {
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('auth'));

    useEffect(() => {
        const f = async () => {
            const appName = history.location.pathname.split('/')[1];
            try {
                const result = await axios.get('http://localhost:3000/users/me', {
                    headers: {
                        Authorization: 'Bearer ' + user.token
                    }
                })
                login(user.token, result.data);
            } catch (error) {
                logout();
                if (history.location.pathname !== '/index') history.push('/index');
            }
        }
        f();
    })


    
    

    return <>{props.children}</>;
}


export default AuthLayout;