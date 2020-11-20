import React, { useContext } from 'react';
import { Card, Row, Col, Typography} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

import CarRegisterForm from './components/CarRegisterForm';



const mainTitle = <Typography.Text strong>Đăng ký xe</Typography.Text>
const subTitle =  <Typography.Text strong>Quy trình đăng ký xe</Typography.Text>



export default () => {
    return (
        <PageContainer>
            <Row>
                <Col span={12}>
                    <CarRegisterForm title={mainTitle} />
                </Col>
                <Col span={12} style={{paddingLeft: '20px'}}>
                    <Card title={subTitle}>
                        <p><strong>Bước 1:</strong> Đăng ký tài khoản trên hệ thống</p>
                        <p><strong>Bước 2:</strong> Đăng nhập vào hệ thống</p>
                        <p><strong>Bước 3:</strong> Vào trang "Đăng ký xe" điền thông tin đầy đủ và gửi lên hệ thống, nhận ngày hẹn kiểm tra xe để  hoàn thành đăng ký</p>
                        <p><strong>Bước 4:</strong> Đến ngày hẹn, mang xe cùng với giấy tờ liên quan đến trụ sở CSGT để đăng kiểm và bấm biển số xe</p>
                    </Card>
                </Col>
            </Row>
        </PageContainer>
    )
}