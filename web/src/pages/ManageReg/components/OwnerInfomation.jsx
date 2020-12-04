import React, { useState, useEffect } from 'react';
import {Form, Input, Button, Space} from 'antd';
import { DEFAULT_HOST } from '@/host';
import { fetchCurrentUser } from '@/helpers/Auth'
import axios from 'axios';

export default ({owner, registrationId, nextStep}) => {
    const [form] = Form.useForm();
    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(false);

    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: 'Bearer ' + user.token,
        }
    }

    useEffect(() => {
        form.setFieldsValue(owner);
    }, [owner])

    const finish = async () => {
        const url = DEFAULT_HOST + '/cars/' + registrationId + '/acceptRegistration';
        try {
            const result = await axios.put(url, {}, config);
            console.log(result);
            if(!result.data.error) setTimeout(() => nextStep(), 1000);
            else {
                alert("Lỗi không xác định");
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
            alert("Lỗi không xác định");
        }
    }

    return (
        <Form
            autoComplete="off"
            labelAlign="left"
            labelCol={{ span: 6, offset: 3 }}
            wrapperCol={{ span: 12 }}
            style={{marginTop: '30px'}}
            form={form}
            onFinish={finish}
        >
            <Form.Item name='fullName' label='Họ và tên'>
                <Input disabled={!edit}></Input>
            </Form.Item>
            <Form.Item name='phoneNumber' label='Số điện thoại'>
                <Input disabled={!edit}></Input>
            </Form.Item>
            <Form.Item name='identityCardNumber' label='Số CMND'>
                <Input disabled={!edit}></Input>
            </Form.Item>
            <Form.Item name='ward' label='Địa chỉ'>
                <Input disabled={!edit}></Input>
            </Form.Item>
            <Form.Item  name='dateOfBirth'label='Ngày sinh'>
                <Input disabled={!edit}></Input>
            </Form.Item>
            <Form.Item wrapperCol={{span: 21}}>
                <Space style={{float: 'right'}}>
                    <Button>Hủy bỏ</Button>
                    <Button type='default' disabled={loading} onClick={() => setEdit(true)}>Chỉnh sửa</Button>
                    <Button type='primary' htmlType='submit' onClick={() => setLoading(true)} loading={loading}>Tất cả thông tin đã chính xác</Button>
                </Space>
            </Form.Item>
        </Form>
    )
}