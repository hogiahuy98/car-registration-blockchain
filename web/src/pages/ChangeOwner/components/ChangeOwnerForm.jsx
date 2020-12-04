import React, { useContext, useState, useEffect } from 'react';
import { Form, Input, Select, Option , Spin, Button, Modal, Result  } from 'antd';
import { DEFAULT_HOST } from '@/host'
import axios from 'axios';

import { fetchCurrentUser } from '@/helpers/Auth';

export default () => {
    const [selectLoading, setSelectLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [error, setError] = useState(false);
    const [newOwnerName, setNewOwnerName] = useState('');
    const [isPending, setPending] = useState(false);
    const [deal, setDeal] = useState({});
    const [options, setOptions] = useState([]);
    const [form] = Form.useForm();
    const [initLoading, setInitLoading] = useState(true);

    const [load, setReload] = useState(0);

    const auth = fetchCurrentUser();

    const config = {
        headers: {
            Authorization: `Bearer ${auth.token}`,
        },
    };

    const reload = () => setReload(load + 1);


    useEffect(() => {
        const f = async () => {
            const userId = auth.id;
            const url = `${DEFAULT_HOST}/users/${userId}/cars/transferring`;
            try {
                const result = await axios.get(url, config);
                if (result.data.length > 0) {
                    setDeal(result.data[0].Record);
                    form.setFieldsValue({
                        carId: result.data[0].Record.carId,
                        newOwnerName: result.data[0].newOwnerName,
                        newOwnerPhoneNumber: result.data[0].newOwnerPhoneNumber,
                    });
                    setPending(true);
                    setInitLoading(false);
                }
                else {
                    form.resetFields();
                    setPending(false);
                    setInitLoading(false);
                    setButtonLoading(false);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (!modalVisible) f();
    }, [modalVisible, load]);

    useEffect(() => {
        setInitLoading(true)
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
                        setInitLoading(false);
                    } else {
                        setSelectLoading(false);
                        setInitLoading(false)
                    }
                } catch (error) {
                    setButtonLoading(false);
                }
            }
        };
        f();
    }, [load]);


    useEffect(() => {
        if (options.length > 0) {
            setSelectLoading(false);
            setInitLoading(false);
        }
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
                if (typeof result.data.TxID !== 'undefined') {
                    setModalVisible(true);
                } else {
                    setError(true);
                    setButtonLoading(false);
                }
            } else {
                setError(true);
                setButtonLoading(false);
            }
        } catch (error) {
            setError(true);
            setButtonLoading(false);
        }
    };

    const handleCancel = async () => {
        setButtonLoading(true)
        const url = DEFAULT_HOST + '/cars/transfer/' + deal.id + '/rejectTransfer';
        try {
            const result = await axios.post(url ,{}, config);
            if (result.data.success) setCancelled(true);
            else setButtonLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    return initLoading ? (
        <Spin spinning={true} style={{ alignItems: 'center' }}></Spin>
    ) : (
        <Form
            labelAlign="left"
            autoComplete="off"
            labelCol={{ span: 9, offset: 1 }}
            wrapperCol={{ span: 13 }}
            layout="horizontal"
            onFinish={handleFormFinish}
            onFinishFailed={() =>
                setTimeout(function () {
                    setButtonLoading(false);
                }, 1500)
            }
            form={form}
        >
            <Form.Item
                label="Xe cần chuyển"
                name="carId"
                rules={[{ required: true, message: 'Chọn xe cần chuyển' }]}
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
                    { required: true, message: 'Nhập sđt người nhận' },
                    {
                        pattern: /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                        message: 'SĐT không đúng định dạng',
                    },
                ]}
            >
                <Input disabled={isPending}></Input>
            </Form.Item>
            <Form.Item
                name="newOwnerName"
                label="Họ và tên người nhận"
                rules={[{ required: true, message: 'Nhập họ và tên người nhận' }]}
            >
                <Input disabled={isPending}></Input>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10 }}>
                <Button
                    type="primary"
                    disabled={isPending}
                    loading={buttonLoading}
                    onClick={() => setButtonLoading(true)}
                    htmlType="submit"
                >
                    {isPending ? 'Đang đợi người nhận xác nhận' : 'Gửi'}
                </Button>
                {isPending ? (
                    <Button type="primary" onClick={handleCancel} danger loading={buttonLoading}>
                        Hủy yêu cầu
                    </Button>
                ) : null}
            </Form.Item>
            <Modal
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    reload();
                    setButtonLoading(false);
                }}
                footer={null}
            >
                <Result
                    status="success"
                    title={'Thành công'}
                    subTitle={`Đã gửi yêu cầu đến ${newOwnerName}`}
                ></Result>
            </Modal>
            <Modal
                visible={error}
                onCancel={() => setError(false)}
                onOk={() => setError(false)}
                okText="Thực hiện lại"
            >
                <Result
                    status="error"
                    title={'Thất bại'}
                    subTitle={`Sai thông tin người nhận`}
                ></Result>
            </Modal>
            <Modal
                visible={cancelled}
                onCancel={() => {
                    setCancelled(false);
                    reload();
                }}
                footer={null}
            >
                <Result
                    status="success"
                    title={'Thành công'}
                    subTitle={`Đã hủy yêu cầu chuyển quyền sở hữu xe`}
                ></Result>
            </Modal>
        </Form>
    );
};