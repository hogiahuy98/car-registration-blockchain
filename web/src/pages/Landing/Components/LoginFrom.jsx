import React, {useEffect, useState, useContext } from 'react';
import { Menu, Modal, Card, Form, Button, Input, Checkbox } from 'antd';
import AuthContext from '@/context/AuthContext';
import axios from 'axios';
import { history } from 'umi';

const serverUrl = 'http://localhost:3000/';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);
    const context = useContext(AuthContext);
    const handleUsernameInput = (event) => {
        setUsername(event.target.value);
    }
    const handlePasswordInput = (event) => {
        setPassword(event.target.value);
    }

    const formFinish = async (values) => {
        setButtonLoading(true);
        let result
        try {
            result = await axios({
                method: 'post',
                url: serverUrl + 'auth/login',
                data: values,
            });
        } catch (error) {
            result = error.response;
        }
        if (result.data.success) {
            const user = result.data.data.user;
            const token = result.data.data.token;
            context.login({
                token: token,
                role: user.role,
                userInfo: user
            });
            setTimeout(() => {
                setButtonLoading(false);
                history.push('/welcome');
            }, 1500);
        }
    }
  
    return (
        <Form
            name="basic"
            initialValues={{remember: true,}}
            style={{border: true}}
            onFinish={formFinish}
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
        >
            <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                    {
                        required: true,
                        message: 'SDT không được để trống',
                    },
                ]}
            >
                <Input value={username} onChange={handleUsernameInput} />
            </Form.Item>

            <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Mật khẩu không được để trống',
                    },
                ]}
            >
                <Input.Password value={password} onChange={handlePasswordInput} />
            </Form.Item>

            <Form.Item  name="remember" valuePropName="checked" wrapperCol={{offset: 6, span: 16}}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 6, span: 16}}>
                <Button 
                    type="primary"
                    style={{height:'35', width: '15  0px', marginRight: 0}}
                    htmlType='submit'
                    loading={buttonLoading}
                >
                    Đăng nhập
                </Button>
            </Form.Item>
        </Form>
    )
  }

  
export default LoginForm;