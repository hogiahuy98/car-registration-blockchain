import React, {useState} from 'react';
import {Modal, Descriptions, Card, Button, Result} from 'antd';
import { useEffect } from 'react';
import CarInfo from '@/pages/DetailRegistration/components/CarDetail';
import CarDetail from '@/pages/DetailRegistration/components/CarDetail';
import { fetchCurrentUser } from '@/helpers/Auth';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';

export default ({visible, deal, disable}) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const disableButton = deal.state == 0 ? true : false;
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: 'Bearer ' + user.token,
        }
    }

    const handleConfirm = async () => {
        setLoading(true);
        const url = DEFAULT_HOST + '/cars/transfer/' + deal.id + '/confirmTransfer';
        try {
            const result = await axios.post(url, {}, config);
            if (result.data.success) {
                setSuccess(true);
                disable();
            }
        } catch (error) {
            
        }
    }

    return (
        <Modal
            visible={visible}
            width="800px"
            onCancel={() => {
                setSuccess(false);
                setLoading(false);
                disable();
            }}
            footer={[
                <Button type="default" loading={loading}>
                    Trở về
                </Button>,
                <Button type="primary" loading={loading} danger>
                    Huỷ bỏ yêu cầu
                </Button>,
                <Button
                    type="primary"
                    loading={loading}
                    onClick={handleConfirm}
                    disabled={disableButton}
                >
                    {disableButton ? 'Chủ sở hữu mới chưa xác nhận' : 'Hoàn tất yêu cầu'}
                </Button>,
            ]}
            destroyOnClose
        >
            <Card title="Chủ sở hữu hiện tại">
                <Descriptions>
                    <Descriptions.Item label="Họ và tên">
                        {deal.currentOwner.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">
                        {deal.currentOwner.address}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                        {deal.currentOwner.phoneNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số CMND">
                        {deal.currentOwner.identityCardNumber}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
            <Card title="Chủ sở hữu mới">
                <Descriptions>
                    <Descriptions.Item label="Họ và tên">
                        {deal.newOwner.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">{deal.newOwner.address}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                        {deal.newOwner.phoneNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số CMND">
                        {deal.newOwner.identityCardNumber}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
            <CarDetail car={deal.car}></CarDetail>
            <Modal
                visible={success}
                onOk={() => setSuccess(false)}
                onCancel={() => setSuccess(false)}
            >
                <Result
                    status="success"
                    title={() =>
                        `Đã chuyển quyền sở hữu xe ${deal.car.brand} ${deal.car.model} biển số ${deal.car.registrationNumber} cho anh/chị ${deal.newOwner.fullName}`
                    }
                ></Result>
            </Modal>
        </Modal>
    );
}