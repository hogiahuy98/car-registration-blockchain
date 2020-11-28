import React, {useState, useCallback} from 'react';
import { Card, Table, Input, Row, Col, Typography, Divider, Badge, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout'
import axios from 'axios';
import moment from 'moment';
moment.locale('en');

import Information from './components/CitizenInfomation'

import { fetchCurrentUser } from '@/helpers/Auth';
import { DEFAULT_HOST } from '@/host';
import { useEffect } from 'react';

const { Search } = Input;


export default () => {
    const [data, setData] = useState([]);
    const [tloading, setTloading] = useState(false);
    const [ownerInfo, setOwnerInfo] = useState({});
    const auth = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: 'Bearer ' + auth.token,
        }
    }

    useEffect(() => {
        fetchData()
    },[]);

    // useEffect(() => {
    //     if (ownerInfo.id)

    // }, [ownerInfo])
    

    const handleOwnerClick = (owner) => {
        setOwnerInfo({
            ...owner,
            modal: true
        })
    }

    const columns = [
        {
            title: 'Mã đăng ký',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Ngày đăng ký',
            dataIndex: 'registrationDate',
            key: 'registrationDate',
            render: (text, record) => {
                return moment(record.createTime).format("D/MM/YYYY, hh:mm:ss A")
            }
        },
        {
            title: 'Người đăng ký',
            dataIndex: 'owner',
            key: 'owner', 
            render: (text, record) => {
                return <Button type='link' onClick={() =>handleOwnerClick(record.owner)}>{record.owner.fullName}</Button>
            }
        },
        {
            title: 'Hãng xe',
            dataIndex: 'brand',
            key: 'brand'
        },
        {
            title: 'Kiểu xe',
            dataIndex: 'model',
            key: ''
        },
        {
            title: 'Tình trạng đăng ký',
            dataIndex: 'registrationState',
            key: 'registrationState',
            render: state => {
                if (state === 'transferring_ownership') return <Badge color='orange' text='Đang chuyển quyền sở hữu'></Badge>
                if (state === 'pending') return <Badge color='blue' text='Đang đợi đăng kiểm và bấm số'></Badge>
                if (state === 'registered') return <Badge color='green' text='Đã đăng ký'></Badge>
            }
        },
        {   
            title: '',
            render: (text, record) => {
                return <Button type='link'>Xem chi tiết</Button>
            }
        }
    ];

    const fetchData = async () => {
        setTloading(true);
        const url = DEFAULT_HOST + '/cars';
        try {
            const result = await axios.get(url, config);
            const cars = result.data;
            setData(() => {
                return cars.map(car => {
                    return car;
                })
            })
            setTloading(false);
        } catch (error) {
            
        }
    }

    const handleTableChange = () => {
        
    }

    return (
        <PageContainer>
            <Card>
                <Row gutter={16}>
                    <Col span={8}>
                        <Search
                            placeholder="Nhập mã đăng ký"
                            allowClear
                            enterButton="Tìm kiếm"
                            size='middle'
                        />
                    </Col>
                </Row>
                <Divider></Divider>
                <Table columns={columns} dataSource={data} loading={tloading}>
                </Table>
            </Card>
            <Information visible={ownerInfo.modal} onCancel={() => {setOwnerInfo({...ownerInfo, modal: false})}} user={ownerInfo}></Information>
        </PageContainer>
    );
}