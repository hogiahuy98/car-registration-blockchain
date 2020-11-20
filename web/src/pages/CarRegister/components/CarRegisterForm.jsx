import React, { useContext, useState } from 'react';
import { Card, Form, Input, DatePicker, InputNumber, Button, Result, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { DEFAULT_HOST } from '@/host';
import axios from 'axios';


import AuthContext from '@/context/AuthContext';

export default (props) => {
    const [successModalVisible, setSucessModalVisible] = useState(false);
    const [txid, setTxid] = useState();
    const [posting, setPosting] = useState(false);
    const { auth } = useContext(AuthContext);

    const config = {
        headers: {
            Authorization: `Bearer ${auth.token}`,
        },
    };

    const formFinish = async (values) => {
        const url = `${DEFAULT_HOST}/cars/`;
        values.year = values.year.year();
        try {
            const result = await axios.post(url, values, config);
            setPosting(false);
            console.log(result);
            if (result.data.success && result.data.result.TxID) {
                setTxid(result.data.result.TxID);
                setSucessModalVisible(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const checkChassisNumber = async (rule, chassisNumber) => {
        try {
            const url = `${DEFAULT_HOST}/cars/checkChassisNumber?cn=${chassisNumber}`;
            const result = await axios.get(url, config);
            if (!result.data.valid) throw new Error('69');
        } catch (error) {
            if (error.message === '69') throw 'Số khung đã được đăng ký';
        }
    };

    const checkEngineNumber = async (rule, engineNumber) => {
        try {
            const url = `${DEFAULT_HOST}/cars/checkEngineNumber?en=${engineNumber}`;
            const result = await axios.get(url, config);
            if (!result.data.valid) throw new Error('69');
        } catch (error) {
            if (error.message === '69') throw 'Số máy đã được đăng ký';
        }
    };

    return (
        <Card title={props.title}>
            <Form
                autoComplete="off"
                labelAlign="left"
                labelCol={{ span: 6, offset: 1 }}
                wrapperCol={{ span: 12 }}
                onFinish={formFinish}
                onFinishFailed={() => setPosting(false)}
            >
                <Form.Item
                    label="Hãng sản xuất"
                    name="brand"
                    rules={[{ required: true, message: 'Hãng sản xuất không được bỏ trống' }]}
                >
                    <Input disabled={posting} placeholder="VD: Vinfast..." />
                </Form.Item>
                <Form.Item
                    label="Mẫu"
                    name="model"
                    rules={[{ required: true, message: 'Mẫu không được bỏ trống' }]}
                >
                    <Input disabled={posting} placeholder="VD: Lux SA2.0" />
                </Form.Item>
                <Form.Item
                    label="Màu sơn"
                    name="color"
                    rules={[{ required: true, message: 'Màu sơn không được bỏ trống' }]}
                >
                    <Input disabled={posting} placeholder="VD: Hồng, Tím..." />
                </Form.Item>
                <Form.Item
                    label="Năm sản xuất"
                    name="year"
                    rules={[{ required: true, message: 'Chọn năm sản xuất' }]}
                >
                    <DatePicker disabled={posting} picker="year" placeholder="Chọn năm" />
                </Form.Item>
                <Form.Item
                    label="Dung tích xe (cc)"
                    name="capality"
                    rules={[
                        { required: true, message: 'Nhập dung tích xe' },
                        { type: 'number', message: 'Dung tích không hợp lệ' },
                    ]}
                >
                    <InputNumber disabled={posting} />
                </Form.Item>
                <Form.Item
                    label="Số khung"
                    name="chassisNumber"
                    hasFeedback
                    rules={[
                        { validator: checkChassisNumber },
                        { required: true, message: 'Nhập số khung' },
                    ]}
                >
                    <Input disabled={posting} placeholder="Số khung" />
                </Form.Item>
                <Form.Item
                    label="Số máy"
                    name="engineNumber"
                    hasFeedback
                    rules={[
                        { validator: checkEngineNumber },
                        { required: true, message: 'Nhập số máy' },
                    ]}
                >
                    <Input disabled={posting} placeholder="Số máy" />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 7 }}>
                    <Button
                        htmlType="submit"
                        type="primary"
                        loading={posting}
                        onClick={() => setPosting(true)}
                    >
                        Đăng ký
                    </Button>
                </Form.Item>
            </Form>
            <Modal
                visible={successModalVisible}
                onCancel={() => setSucessModalVisible(false)}
                footer={null}
            >
                <Result
                    status='success'
                    title='Đăng ký thành công'
                    subTitle={"Mã giao dịch: " + txid}
                >
                </Result>
            </Modal>
        </Card>
    );
};
