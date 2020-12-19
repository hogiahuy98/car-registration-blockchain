import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Typography, Popconfirm, Divider } from 'antd';
import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import { DEFAULT_HOST } from '@/host';
import { fetchCurrentUser } from '@/helpers/Auth';
import axios from 'axios';

export default ({ owner, registrationId, nextStep }) => {
    const [form] = Form.useForm();
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: 'Bearer ' + user.token,
        },
    };
    useEffect(() => {
        form.setFieldsValue(owner);
    }, [owner]);

    const finish = async () => {
        const url = DEFAULT_HOST + '/cars/' + registrationId + '/acceptRegistration';
        try {
            const result = await axios.put(url, {}, config);
            if (!result.data.error) setTimeout(() => nextStep(), 1000);
            else {
                alert('Lỗi không xác định');
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            alert('Lỗi không xác định');
        }
    };

    const handleReject = async () => {
        setLoading(true);
        const url = DEFAULT_HOST + '/cars/' + registrationId + '/rejectRegistration';
        try {
            const result = await axios.put(url, {}, config);
            if (result.data.TxID) {
                message.success('Hủy đăng ký thành công');
                disable();
            }
        } catch (error) {}
    };

    return (
        <Form
            autoComplete="off"
            labelAlign="left"
            labelCol={{ span: 6, offset: 3 }}
            wrapperCol={{ span: 12 }}
            style={{ marginTop: '30px' }}
            form={form}
            onFinish={finish}
            contentEditable={false}
        >
            <Form.Item name="fullName" label="Họ và tên">
                <Input readOnly></Input>
            </Form.Item>
            <Form.Item name="phoneNumber" label="Số điện thoại">
                <Input readOnly></Input>
            </Form.Item>
            <Form.Item name="identityCardNumber" label="Số CMND">
                <Input readOnly></Input>
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ">
                <Input readOnly></Input>
            </Form.Item>
            <Form.Item name="dateOfBirth" label="Ngày sinh">
                <Input readOnly></Input>
            </Form.Item>
            <Divider></Divider>
            <Form.Item wrapperCol={{ span: 18, offset: 3 }}>
                <Popconfirm
                    okText="Huỷ"
                    cancelText="Huỷ bỏ"
                    onConfirm={handleReject}
                    title="Hủy bỏ đăng ký này?"
                >
                    <Button style={{ float: 'left' }} type="primary" loading={loading} danger>
                        Xóa đăng ký
                    </Button>
                </Popconfirm>
                {!owner.verified ? (
                    <Space style={{ float: 'right' }}>
                        <Typography.Text type="warning">
                            <ExclamationCircleFilled /> Người dùng chưa xác thực
                        </Typography.Text>

                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={() => setLoading(true)}
                            loading={loading}
                            disabled
                        >
                            Tất cả thông tin đã chính xác
                        </Button>
                    </Space>
                ) : (
                    <Space style={{ float: 'right' }}>
                        <Typography.Text type="success">
                            <CheckCircleFilled />
                            Người dùng đã xác thực
                        </Typography.Text>
                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={() => setLoading(true)}
                            loading={loading}
                        >
                            Hoàn tất đăng ký
                        </Button>
                    </Space>
                )}
            </Form.Item>
        </Form>
    );
};
