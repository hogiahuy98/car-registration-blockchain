import React from 'react';
import { Card, Descriptions, Modal  } from 'antd';
import moment from 'moment';

const label = {
    fullName: "Họ và tên",
    dateOfBirth: "Ngày sinh",
    identityCardNumber: "Số CMND",
    phoneNumber: 'Số điện thoại',
    ward: 'Khu vực',
    createTime: 'Ngày đăng ký'
}

export default (props) => {
    const { user } = props;

    return (
        <Modal visible={props.visible} onCancel={props.onCancel} footer={null} width={800}>
            <Card title='Thông tin người đăng ký'>
                <Descriptions>
                    <Descriptions.Item label={label.fullName}>
                        {user.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label={label.dateOfBirth}>
                        {user.dateOfBirth}
                    </Descriptions.Item>
                    <Descriptions.Item label={label.identityCardNumber}>
                        {user.identityCardNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label={label.phoneNumber}>
                        {user.phoneNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label={label.ward}>
                        {user.ward}
                    </Descriptions.Item>
                    <Descriptions.Item label={label.createTime}>
                        {moment(user.createTime).locale('en').format("D/MM/YYYY, hh:mm:ss A")}
                    </Descriptions.Item>
                    {/* <Descriptions.Item>
                        
                    </Descriptions.Item>
                    <Descriptions.Item>
                        
                    </Descriptions.Item> */}
                </Descriptions>
            </Card>
        </Modal>
    )
}