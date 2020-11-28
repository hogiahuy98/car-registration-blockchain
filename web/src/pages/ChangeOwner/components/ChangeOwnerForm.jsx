import React, { useContext, useState, useEffect } from 'react';
import { Form, Input, Select, Option , Spin, Button, Modal, Result  } from 'antd';
import { DEFAULT_HOST } from '@/host'
import axios from 'axios';

import { fetchCurrentUser } from '@/helpers/Auth';

export default (props) => {
    const [selectLoading, setSelectLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newOwnerName, setNewOwnerName] = useState('');
    const [isPending, setPending] = useState(false);
    const [options, setOptions] = useState([]);
    const [form] = Form.useForm();
    const { reload } = props;

    const auth = fetchCurrentUser();

    const config = {
        headers: {
            Authorization: `Bearer ${auth.token}`,
        },
    };



    useEffect(() => {
        const f = async () => {
            const userId = auth.id;
            const url = `${DEFAULT_HOST}/users/${userId}/cars/registered`;
            if (options.length === 0) {
                try {
                    const result = await axios.get(url, config);
                    if (result.data.length > 0) {
                        const opts = result.data.map((element) => {
                            const car = element.Record;
                            const label = `${car.brand} ${car.model} - ${car.registrationNumber}`;
                            return { label, value: car.id };
                        });
                        setOptions(opts);
                    } else {
                        setSelectLoading(false);
                    }
                } catch (error) {
                    setButtonLoading(false);
                }
            }
        };
        f();
    }, []);

    useEffect(() => {
        const f = async () => {
            const userId = auth.id;
            const url = `${DEFAULT_HOST}/users/${userId}/cars/transferring`;
            try {
                const result = await axios.get(url, config);
                if (result.data.length > 0) {
                    form.setFieldsValue({
                        carId: result.data[0].Record.carId,
                        newOwnerName: result.data[0].newOwnerName,
                        newOwnerPhoneNumber: result.data[0].newOwnerPhoneNumber,
                    });
                    setPending(true);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (options.length > 0) f();
    }, [options]);

    useEffect(() => {
        if (options.length > 0) setSelectLoading(false);
    }, [options]);

    const handleFormFinish = async (value) => {
        const newOwnerPhoneNumber = value.newOwnerPhoneNumber;
        const newOwnerName = value.newOwnerName;
        setNewOwnerName(newOwnerName);
        const validateUrl = `${DEFAULT_HOST}/users/validateChangeOwner?pn=${newOwnerPhoneNumber}&n=${newOwnerName}`;
        try {
            const validRes = await axios.get(validateUrl, config);
            if (validRes.data.valid) {
                const postUrl = `${DEFAULT_HOST}/cars/${value.carId}/transferOwnership`;
                const body = {
                    newOwner: validRes.data.newOwnerId,
                };
                const result = await axios.post(postUrl, body, config);
                if(typeof result.data.TxID !== 'undefined') {
                    setModalVisible(true);
                }
                else form.resetFields();
            }
            else {
                    form.resetFields();
                    setButtonLoading(false);
                }
        } catch (error) {
            console.log(error);
            setButtonLoading(false);
        }
    };

    return (
        <Form
            labelAlign="left"
            autoComplete="off"
            labelCol={{ span: 9, offset: 1 }}
            wrapperCol={{ span: 13 }}
            layout="horizontal"
            onFinish={handleFormFinish}
            onFinishFailed={() => setTimeout(
                function (){
                    setButtonLoading(false)
                }, 1500)
            }
            form={form}
        >
            <Form.Item label="Xe cần chuyển" name='carId'
                rules={[
                    {required: true, message: "Chọn xe cần chuyển"}
                ]}
            >
                <Select
                    loading={selectLoading}
                    options={options}
                    notFoundContent={<Spin style={{ marginInline: '45%' }} spinning={true}></Spin>}
                    disabled={isPending}
                ></Select>
            </Form.Item>
            <Form.Item
                name="newOwnerPhoneNumber"
                label="SĐT người nhận"
                rules={[
                    {required: true, message: "Nhập sđt người nhận"},
                    {pattern: /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, message: "SĐT không đúng định dạng"}
                ]}
            >
                <Input disabled={isPending}></Input>
            </Form.Item>
            <Form.Item
                name="newOwnerName"
                label="Họ và tên người nhận"
                rules={[
                    {required: true, message: "Nhập họ và tên người nhận"}
                ]}
            >
                <Input disabled={isPending}></Input>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10 }}>
                <Button type='primary' disabled={isPending} loading={buttonLoading} onClick={() => setButtonLoading(true)} htmlType='submit'>
                    {isPending ?"Đang đợi người nhận xác nhận": "Gửi"} 
                </Button>
            </Form.Item>
            <Modal
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                }}
                footer={null}
            >
                <Result
                    status='success'
                    title={"Thành công"}
                    subTitle={`Đã gửi yêu cầu đến ${newOwnerName}`}
                >
                </Result>
            </Modal>
        </Form>
    );
};