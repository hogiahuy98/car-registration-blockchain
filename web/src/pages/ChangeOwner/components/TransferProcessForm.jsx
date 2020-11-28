import React, { useContext, useState, useEffect } from 'react';
import { Card, Descriptions , Button, Typography, Divider, Modal, Result} from 'antd';
import { DEFAULT_HOST } from '@/host';
import path from 'path';
import axios from 'axios';
import moment from 'moment'

import {DESCRIPTION_LABEL} from '../../RegisteredCar/components/Constants'
import { fetchCurrentUser } from '@/helpers/Auth';

const Title = <Typography.Text strong   >Xác nhận chuyển quyền sở hữu xe</Typography.Text>
export default ({request}) => {
    const [car, setCar] = useState({});
    const [carOnwer, setCarOnwer] = useState({});
    const [confirming, setConfirming] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const auth = fetchCurrentUser();
    
    const config = {
        headers: {
            Authorization: `Bearer ${auth.token}`,
        },
    };

    useEffect(() => {
        const f = async () => {
            const getCarUrl = DEFAULT_HOST + path.join('/cars', request.carId);
            try {
                const result = await axios.get(getCarUrl, config);
                if(result.data.Key) setCar(result.data.Record);
            } catch (error) {
                console.log(error);
            }
        }
        f();
    }, []);
    
    useEffect(() => {
        const f = async () => {
            const getCarOwnerUrl = DEFAULT_HOST + path.join('/users', request.currentOwner);
            try {
                const result = await axios.get(getCarOwnerUrl, config);
                if(result.data.Key) setCarOnwer(result.data.Record);
            } catch (error) {
                console.log(error);
            }
        }
        if(car.id) f();
    }, [car])


    const handleConfirm = async () => {
        setConfirming(true);
        const confirmUrl = DEFAULT_HOST + path.join('/cars', 'transfer', request.id, 'approveTransfer');
        try {
            const result = await axios.post(confirmUrl, {}, config);
            if (result.data.success) {
                setModalVisible(true);
            }
        } catch (error) {
            setConfirming(false)
            console.log(error)
        }
    }


    return (
        <Card
            title={Title}
            style={{alignItems: 'center'}}
        >
            <p>
                Anh(Chị) có một yêu cầu chuyển đổi xe đến từ {carOnwer.fullName}, xem kỹ thông tin
                trước khi xác nhận.
            </p>
            <br />
            <Descriptions column={{ xs: 1, md: 1}} bordered={true}>
                <Descriptions.Item label={DESCRIPTION_LABEL.REGISTRATION_DATE}>
                    {moment(car.registrationTime).locale('en').format('D/MM/YYYY, hh:mm:ss A')}
                </Descriptions.Item>
                <Descriptions.Item label={DESCRIPTION_LABEL.BRAND}>{car.brand}</Descriptions.Item>
                <Descriptions.Item label={DESCRIPTION_LABEL.MODEL}>{car.model}</Descriptions.Item>
                <Descriptions.Item label={DESCRIPTION_LABEL.COLOR}>{car.color}</Descriptions.Item>
                <Descriptions.Item label={DESCRIPTION_LABEL.YEAR}>{car.year}</Descriptions.Item>
                <Descriptions.Item label={DESCRIPTION_LABEL.CAPALITY}>
                    {car.capality}
                </Descriptions.Item>
                <Descriptions.Item label={DESCRIPTION_LABEL.CHASSIS_NUMBER}>
                    {car.chassisNumber}
                </Descriptions.Item>
                <Descriptions.Item label={DESCRIPTION_LABEL.ENGINE_NUMBER}>
                    {car.engineNumber}
                </Descriptions.Item>
            </Descriptions>
            <br />
            <Button type="primary" style={{float: 'right', margin: 10}} loading={confirming} onClick={handleConfirm}>Xác nhận</Button>
            <Button type="link" style={{float:'right', margin: 10}}>
                Hủy bỏ
            </Button>
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
                    subTitle={`Đến trụ sở CSGT Quận Ninh Kiều để xác nhận thông tin và nhận giấy tờ xe mới`}
                >
                </Result>
            </Modal>
        </Card>
    );
}