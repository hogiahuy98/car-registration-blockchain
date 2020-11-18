import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '@/context/AuthContext';
import { Button, Space, Card, Form, Input, Checkbox, Row, Col } from 'antd';
import { Redirect, history } from 'umi';
import Axios from 'axios';
import styles from './index.less';
// const layout = {
//     labelCol: { span: 8 },
//     wrapperCol: { span: 16 },
//   };
//   const tailLayout = {
//     wrapperCol: { offset: 8, span: 16 },
//   };

const Login = (props) => {
    const context = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameInput = (event) => {
        setUsername(event.target.value);
    }
    const handlePasswordInput = (event) => {
        setPassword(event.target.value);
    }



    return (
        <Row >
            <Col md={{span: 10, offset: 7}} lg={{span: 6, offset: 9}}>
                    <Card className={styles.loginCard}>
                    <Form
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        style={{border: true}}
                        >
                        <Form.Item
                            label="Số CMND"
                            name="indentityCardNumber"
                            rules={[
                            {
                                required: true,
                                message: 'CMND không được để trống',
                            },
                            ]}
                        >
                            <Input value={username} onChange={handleUsernameInput}  />
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
                            <Input.Password />
                        </Form.Item>

                        <Form.Item  name="remember" valuePropName="checked">
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item >
                            <Button type="primary" style={{height:'35', width: '15  0px', right: 0}} htmlType='submit'>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                    </Card>
            </Col>
        </Row>
    )
};


export default Login;