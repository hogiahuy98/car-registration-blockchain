import React, { useContext, useEffect, useState } from 'react';
import { Card, Form, Input, DatePicker, InputNumber, Space, Button} from 'antd';
import path from 'path';
import { DEFAULT_HOST } from '@/host';
import axios from 'axios';
import { REGISTRATION_FIELD } from './Constants'

import { fetchCurrentUser, logout } from '@/helpers/Auth';


export default (props) => {
    const [edit, setEdit] = useState(false);
    const [registration, setRegistration] = useState({});
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const user = fetchCurrentUser()

    const config = {
        headers: {
            Authorization: 'Bearer ' + user.token
        }
    }

    const nextStep = props.nextStep;

    useEffect(() => {
        if(props.registration) setRegistration(props.registration); 
    },);

    useEffect(()=> {
        registration.capality = Number.parseInt(registration.capality);
        form.setFieldsValue(registration);
    },[registration])


    const onFinish = async (value) => {
        setLoading(true);
        if(!edit) setTimeout(() => nextStep(), 2000);
        const url = DEFAULT_HOST + '/cars/' + registration.id;
        try {
            const result = await axios.put(url, value, config);
            if(result.data.success) nextStep();
            else {
                setLoading(false);
                alert("Lỗi không xác định");
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            alert("Lỗi không xác định");
        }
    }

    return (
        <Form
            autoComplete="off"
            labelAlign="left"
            labelCol={{ span: 6, offset: 3 }}
            wrapperCol={{ span: 12 }}
            onFinishFailed={() => setEdit(false)}
            onFinish={onFinish}
            form={form}
            style={{marginTop: '30px'}}
        >
            <Form.Item
                label={REGISTRATION_FIELD.BRAND.LABEL}
                name={REGISTRATION_FIELD.BRAND.NAME}
                rules={[{ required: true, message: 'Hãng sản xuất không được bỏ trống' }]}
            >
                <Input disabled={!edit} placeholder="VD: Vinfast..." />
            </Form.Item>
            <Form.Item
                label={REGISTRATION_FIELD.MODEL.LABEL}
                name={REGISTRATION_FIELD.MODEL.NAME}
                rules={[{ required: true, message: 'Mẫu không được bỏ trống' }]}
            >
                <Input disabled={!edit} placeholder="VD: Lux SA2.0" />
            </Form.Item>
            <Form.Item
                label={REGISTRATION_FIELD.COLOR.LABEL}
                name={REGISTRATION_FIELD.COLOR.NAME}
                rules={[{ required: true, message: 'Màu sơn không được bỏ trống' }]}
            >
                <Input disabled={!edit} placeholder="VD: Hồng, Tím..." />
            </Form.Item>
            {/* <Form.Item
                label={REGISTRATION_FIELD.YEAR.LABEL}
                name={REGISTRATION_FIELD.YEAR.NAME}
                rules={[{ required: true, message: 'Chọn năm sản xuất' }]}
            >
                <DatePicker disabled={edit} picker="year" placeholder="Chọn năm" />
            </Form.Item> */}
            <Form.Item
                label={REGISTRATION_FIELD.CAPALITY.LABEL}
                name={REGISTRATION_FIELD.CAPALITY.NAME}
                rules={[
                    { required: true, message: 'Nhập dung tích xe' },
                    { type: 'number', message: 'Dung tích không hợp lệ' },
                ]}
            >
                <InputNumber disabled={!edit} />
            </Form.Item>
            <Form.Item
                label={REGISTRATION_FIELD.CHASSIS_NUMBER.LABEL}
                name={REGISTRATION_FIELD.CHASSIS_NUMBER.NAME}
                hasFeedback
                rules={[
                    { required: true, message: 'Nhập số khung' },
                ]}
            >
                <Input disabled={!edit} placeholder="Số khung" />
            </Form.Item>
            <Form.Item
                label={REGISTRATION_FIELD.ENGINE_NUMBER.LABEL}
                name={REGISTRATION_FIELD.ENGINE_NUMBER.NAME}
                hasFeedback
                rules={[
                    { required: true, message: 'Nhập số máy' },
                ]}
            >
                <Input disabled={!edit} placeholder="Số máy" />
            </Form.Item>
            <Form.Item wrapperCol={{span: 21}}>
                <Space style={{float: 'right'}}>
                    <Button>Hủy bỏ</Button>
                    <Button type='default' disabled={loading} onClick={() => setEdit(true)}>Chỉnh sửa</Button>
                    <Button type='primary' htmlType='submit' loading={loading}>Tất cả thông tin đã chính xác</Button>
                </Space>
            </Form.Item>
        </Form>
    );
};
