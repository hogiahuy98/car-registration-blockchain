import React, {useEffect, useContext} from 'react';
import { Card, Table, Space, Button, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useState } from 'react';
import { DEFAULT_HOST } from '@/host'
import axios from 'axios';
import moment from 'moment';

import CarDetail from './components/CarDetail';
import { fetchCurrentUser, logout } from '@/helpers/Auth';

 
export default () => {
    const [cars, setCars] = useState([]);
    const [tableLoading, setTableLoading] = useState(true);
    const [car, setCar] = useState({});
    const [detailVisible, setDetailVisible] = useState(false);

    const auth = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${auth.token}`,
        },
    };

    const columns = [
        {
            title: 'Hãng sx',
            dataIndex: 'brand',
            key: 'brand'
        },
        {
            title: 'Mẫu',
            dataIndex: 'model',
            key: 'model'
        },
        {
            title: 'Biển số xe',
            dataIndex: 'registrationNumber',
            key: 'registrationNumber'
        },
        {
            title: 'Ngày đăng ký',
            dataIndex: 'registrationDate',
            key: 'registrationDate'
        },
        {
            title: '',
            key: 'action',
            render: (text, record) => (
                    <Button type='link'
                        onClick={() => {
                            setCar(record);
                        }}
                    >Xem chi tiết</Button>
            )
        }
    ]

    useEffect(() => {
        const url = `${DEFAULT_HOST}/users/${auth.id}/cars/registered`
        const fetchCars = async () => {
            try {
                const result = await axios.get(url, config);
                const carArr = [];
                const listCars = result.data;
                listCars.map(car => {
                    car.Record.registrationDate = moment(car.Record.registrationTime).locale('en').format("D/MM/YYYY, h:mm:ss A");
                    carArr.push(car.Record);
                })
                setCars(carArr);
            } catch (error) {
                console.log(error);
            }
        }
        fetchCars().then(() => setTableLoading(false));;
    }, [])

    useEffect(() => {
        if (typeof car.id !== 'undefined')
            setDetailVisible(true);
    }, [car]);

    useEffect(() => {
        if (!detailVisible)
            setCar({});   
    }, [detailVisible])

    return (
        <PageContainer>
            <Card >
                <Table loading={tableLoading} columns={columns} dataSource={cars}>

                </Table>
            </Card>
            <Modal
                visible={detailVisible}
                onCancel={() => setDetailVisible(false)}
                maskClosable={false}    
                footer={null}              
                width={'800px'}
            >
                <CarDetail car={car}/>
            </Modal>
        </PageContainer>
    )
}