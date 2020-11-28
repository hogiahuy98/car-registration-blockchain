import React from 'react';
import { Card, Descriptions, Typography} from 'antd';
import { CalendarOutlined } from '@ant-design/icons'
import moment from 'moment';
import { REGISTRATION_FIELD } from './Constants'

const title = <Typography.Text style={{color: 'blue'}}><CalendarOutlined twoToneColor='yellow' /> Đăng ký đang chờ đăng kiểm và xét duyệt</Typography.Text>
const label = (text) => {
    return <Typography.Text strong>{text}</Typography.Text>
}

export default ({ registration }) => {
    const {
        brand,
        model,
        color,
        year,
        capality,
        engineNumber,
        chassisNumber,
        createTime,
    } = registration;
    if (typeof registration === 'undefined') return <Card></Card> 
    const registrationDate = moment(createTime).locale('en').format("D/MM/YYYY, hh:mm:ss");
    return (
        <Card title={title} bordered>
            <Descriptions  column={2}>
                <Descriptions.Item label={label(REGISTRATION_FIELD.REGISTRATION_DATE.LABEL)}>
                    Ngày {registrationDate}
                </Descriptions.Item>
                <Descriptions.Item label={label(REGISTRATION_FIELD.BRAND.LABEL)}>
                    {brand}
                </Descriptions.Item>
                <Descriptions.Item label={label(REGISTRATION_FIELD.MODEL.LABEL)}>
                    {model}
                </Descriptions.Item>
                <Descriptions.Item label={label(REGISTRATION_FIELD.COLOR.LABEL)}>
                    {color}
                </Descriptions.Item>
                <Descriptions.Item label={label(REGISTRATION_FIELD.YEAR.LABEL)}>
                    {year}
                </Descriptions.Item>
                <Descriptions.Item label={label(REGISTRATION_FIELD.CAPALITY.LABEL)}>
                    {capality}
                </Descriptions.Item>
                <Descriptions.Item label={label(REGISTRATION_FIELD.CHASSIS_NUMBER.LABEL)}>
                    {chassisNumber}
                </Descriptions.Item>
                <Descriptions.Item label={label(REGISTRATION_FIELD.ENGINE_NUMBER.LABEL)}>
                    {engineNumber}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
}