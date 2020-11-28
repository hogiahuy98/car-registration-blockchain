import React, { useState, useEffect, useContext } from 'react';
import { Card, Descriptions, Divider, Typography, Timeline } from 'antd';
import { DESCRIPTION_LABEL } from './Constants';
import { DEFAULT_HOST } from '@/host';
import axios from 'axios';
import moment from 'moment';
import { fetchCurrentUser } from '@/helpers/Auth'

const TIMELINE_ACTION_TYPE = [
    "Đăng ký lên hệ thống",
    "CSGT đăng kiểm, bấm biển số",
]

export default (props) => {
    const [timeline, setTimeline] = useState([]);
    const auth = fetchCurrentUser();

    const config = {
        headers: {
            Authorization: `Bearer ${auth.token}`,
        }
    }
    const car = {...props.car};
    const title = <Typography.Text strong>{`${car.brand} ${car.model}`}</Typography.Text>

    useEffect(() => {
        const fetchTimeline = async () => {
            const url = `${DEFAULT_HOST}/cars/${car.id}/history`;
            try {
                const result = await axios.get(url, config);
                // console.log(result);
                if (result.data.length > 0) {
                    const arr =result.data;
                    const tl = arr.map(element => {
                        element.Value.time = moment(element.Timestamp.seconds.low * 1000).locale('en').format("D/MM/YYYY, hh:mm:ss A");
                        console.log(element);
                        return element.Value;
                    })
                    setTimeline(tl.reverse());
                }
            } catch(error) {
                console.log(error);
            }
        }
        fetchTimeline();
    }, [])

    useEffect(() => console.log(timeline), [timeline]);

    return (
    <Card size='small' title={title} loading={false}>
            <Descriptions column={2}>
                <Descriptions.Item label={DESCRIPTION_LABEL.REGISTRATION_DATE}>
                    Ngày {car.registrationDate}
                </Descriptions.Item>
                <Descriptions.Item label={DESCRIPTION_LABEL.BRAND}>
                    {car.brand}
                </Descriptions.Item>
                <Descriptions.Item label={DESCRIPTION_LABEL.MODEL}>
                    {car.model}
                </Descriptions.Item>
                <Descriptions.Item label={DESCRIPTION_LABEL.COLOR}>
                    {car.color}
                </Descriptions.Item>
                <Descriptions.Item label={DESCRIPTION_LABEL.YEAR}>
                    {car.year}
                </Descriptions.Item>
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
            <Divider/>
            <Typography.Text strong>Lịch sử đăng ký</Typography.Text>
            <Timeline style={{marginTop: '1rem'}} mode='left'>
                {
                    timeline.map(tl => {
                        return (<Timeline.Item label={"Ngày " + tl.time}>{TIMELINE_ACTION_TYPE[tl.modifyType]}</Timeline.Item>)
                    })
                }
            </Timeline>
        </Card>
    )
}