import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '@/context/AuthContext';
import { Button, Space } from 'antd';

const HelloWorld = (props) => {
    const [flag, setFlag] = useState(0);
    
    const context = useContext(AuthContext);

    const handleLogin = () => {
        context.login({token: "haha", useInfo:{name: "Kakyoin"}, role:"stand user"});
        setFlag(flag + 1);
    }

    useEffect(() => {
        console.log(context.isAuth);
    }, [flag])

    return (
        <React.Fragment>
            <Space>
                <Button onClick={ handleLogin } type="primary">Login</Button>
                <Button>Logout</Button>
            </Space>  
        </React.Fragment>
    )
};

export default HelloWorld;