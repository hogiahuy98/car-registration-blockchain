import React, { useContext, useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { history } from 'umi'

import {DEFAULT_HOST} from '@/host'
import CarRegisterForm from './components/CarRegisterForm';
import Description from './components/PendingRegistration';
import { fetchCurrentUser, logout } from '@/helpers/Auth';

const icon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const mainTitle = <Typography.Text strong>Đăng ký xe</Typography.Text>
const subTitle =  <Typography.Text strong>Quy trình đăng ký xe</Typography.Text>


export default () => {
    const [spin, setSpin] = useState(true);
    const [pending, setPending] = useState(false);
    const [registration, setRegistration] = useState({});
    const [reload, setReload] = useState(false);

    const auth = fetchCurrentUser();

    useEffect(() => {
        const f = async () => {
            const pendingUrl = `${DEFAULT_HOST}/users/${auth.id}/cars/pending`;
            try {
                const response = await axios.get(pendingUrl, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                const pendingRegistration = response.data;
                if (pendingRegistration.length === 0) {
                    setPending(false);
                    setSpin(false)
                }
                else {
                    setSpin(false);
                    setPending(true);
                    setRegistration(pendingRegistration[0].Record);
                }
            } catch (error) {
                setSpin(false);
                setPending(true);
            }
        }
        f();
    }, [reload]);

    return (
        <PageContainer>
            <Row>
                <Col span={12} >
                    <Spin spinning={spin} indicator={icon} style={{backgroundColor: 'white'}}>
                        {pending ? <Description registration={registration} /> : <CarRegisterForm reload={setReload} title={mainTitle}/>}
                    </Spin>
                </Col>
                <Col span={12} style={{paddingLeft: '20px'}}>
                    <Card title={subTitle}>
                        <p><strong>Bước 1:</strong> Đăng ký tài khoản trên hệ thống</p>
                        <p><strong>Bước 2:</strong> Đăng nhập vào hệ thống</p>
                        <p><strong>Bước 3:</strong> Vào trang "Đăng ký xe" điền thông tin đầy đủ và gửi lên hệ thống</p>
                        <p><strong>Bước 4:</strong> Chuẩn bị hồ sơ theo quy định của pháp luật</p>
                    </Card>
                </Col>
            </Row>
        </PageContainer>
    )
}