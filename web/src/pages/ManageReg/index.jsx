import React, { useState, useCallback } from 'react';
import { Card, Table, Input, Row, Col, Typography, Divider, Badge, Button, Select } from 'antd';
import { useHistory } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { AuditOutlined, SwapOutlined, SelectOutlined} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
moment.locale('en');

import Complete from './components/CompleteRegistration';
import Information from './components/CitizenInfomation';
import TransferComfirm from './components/TransferConfirm'

import { fetchCurrentUser } from '@/helpers/Auth';
import { DEFAULT_HOST } from '@/host';
import { useEffect } from 'react';

const { Search } = Input;
const { Option } = Select;

export default () => {
    const [data, setData] = useState([]);
    const [tloading, setTloading] = useState(false);
    const [ownerInfo, setOwnerInfo] = useState({});
    const [complete, setComplete] = useState({
        registration: {},
        visible: false,
    });
    const [search, setSeach] = useState({})
    const [transfer, setTransfer] = useState({
        deal: {
            currentOwner: {},
            newOwner: {},
            car: {}
        },
    });
    const history = useHistory();
    const auth = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: 'Bearer ' + auth.token,
        },
    };

    useEffect(() => {
        fetchData();
    }, [complete, transfer]);


    const handleComplete = (registration) => {
        setComplete({
            registration: registration,
            visible: true
        });
    };

    const handleOwnerClick = (owner) => {
        setOwnerInfo({
            ...owner,
            visible: true,
        });
    };

    const onSelectField = (value) => {
        setSeach({
            ...search,
            field: value,
        })
    }

    const handleSearch = (value) => {
        if(value =="") return fetchData();
        const newData = data.filter((element) => {
            return element[search.field].includes(value);
        })
        setData(newData);
    } 

    const handleTransferClick = async (registration) => {
        const url = DEFAULT_HOST + '/cars/' + registration.id + '/transferDeal';
        try {
            const result = await axios.get(url, config);
            const deal = result.data;
            console.log(deal);
            setTransfer({
                deal,
                visible: true
            });
        } catch (error) {
            console.log(error);
        }
    }

    const columns = [
        {
            title: 'Mã đăng ký',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Biển số',
            dataIndex: 'registrationNumber',
            key: 'registrationNumber',
            render: (text, record) => {
                if (text === 'jotaro') return "Chưa có"
                return text;
            },
        },
        {
            title: 'Người đăng ký',
            dataIndex: 'owner',
            key: 'owner',
            render: (text, record) => {
                return (
                    <Button type="link" onClick={() => handleOwnerClick(record.owner)}>
                        {record.owner.fullName}
                    </Button>
                );
            },
        },
        {
            title: 'Hãng xe',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'Kiểu xe',
            dataIndex: 'model',
            key: '',
        },
        {
            title: 'Tình trạng đăng ký',
            dataIndex: 'registrationState',
            key: 'registrationState',
            render: (state) => {
                if (state === 'transferring_ownership')
                    return <Badge color="orange" text="Đang chuyển quyền sở hữu"></Badge>;
                if (state === 'pending')
                    return <Badge color="blue" text="Đang đợi đăng kiểm và bấm số"></Badge>;
                if (state === 'registered') return <Badge color="green" text="Đã đăng ký"></Badge>;
                if (state === 'rejected') return <Badge color="red" text="Đã huỷ đăng ký"></Badge>;
            },
        },
        {
            title: 'Chi tiết',
            render: (text, record) => {
                return (
                    <Button
                        type="default"
                        onClick={() => history.push('/police/read-registration/' + record.id)}
                    >
                        <SelectOutlined />
                    </Button>
                );
            }
        },
        {
            title: null,
            render: (text, record) => {
                if (record.registrationState === 'registered' || record.registrationState === 'rejected') return null;
                if (record.registrationState === 'transferring_ownership')
                    return (
                        <Button
                            type="default"
                            style={{ backgroundColor: 'orange', color: 'white' }}
                            onClick={() => handleTransferClick(record)}
                        >
                            <SwapOutlined />
                        </Button>
                    );
                else
                    return (
                        <Button type="primary" onClick={() => handleComplete(record)}>
                            <AuditOutlined />
                        </Button>
                    );
            },
        },
    ];

    const fetchData = async () => {
        setTloading(true);
        const url = DEFAULT_HOST + '/cars';
        try {
            const result = await axios.get(url, config);
            const cars = result.data;
            console.log(cars);
            setData(() => {
                return cars.map((car) => {
                    return car;
                });
            });
            setTloading(false);
        } catch (error) {}
    };

    const handleTableChange = () => {};

    return (
        <PageContainer>
            <Card>
                <Row gutter={1}>
                    <Col span={3}>
                        <Select placeholder="Tìm kiếm bằng" style={{ width: '100%' }} onSelect={onSelectField}>
                            <Option value="id">Mã đăng ký</Option>
                            <Option value="registrationNumber">Biển số xe</Option>
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Search
                            placeholder="Nội dung tìm kiếm"
                            allowClear
                            enterButton="Tìm kiếm"
                            size="middle"
                            onSearch={handleSearch}
                        />
                    </Col>
                </Row>
                <Divider></Divider>
                <Table columns={columns} dataSource={data} loading={tloading}></Table>
            </Card>
            <Complete
                visible={complete.visible}
                disable={() => setComplete({ ...complete, visible: false })}
                registration={complete.registration}
            ></Complete>
            <Information
                visible={ownerInfo.visible}
                onCancel={() => {
                    setOwnerInfo({ ...ownerInfo, visible: false });
                }}
                user={ownerInfo}
            ></Information>
            <TransferComfirm
                visible={transfer.visible}
                disable={() => setTransfer({ ...transfer, visible: false })}
                deal={transfer.deal}
            ></TransferComfirm>
        </PageContainer>
    );
};
