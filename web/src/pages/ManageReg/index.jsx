import React, { useState, useCallback } from 'react';
import { Card, Table, Input, Row, Col, Typography, Divider, Badge, Button, Select, DatePicker, Space } from 'antd';
import { useHistory } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { AuditOutlined, SwapOutlined, SelectOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
moment.locale('en');

const {RangePicker} = DatePicker;

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
    const [search, setSeach] = useState({field: 'id'})
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
    const [range, setRange] = useState({});

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

    const handleSearch = async (value) => {
        if(value =="") return fetchData();
        setTloading(true)
        const temp = await getData()
        const newData = temp.filter((element) => {
            return element[search.field].includes(value);
        })
        setData(newData);
        setTloading(false);
    } 

    const handleTransferClick = async (registration) => {
        const url = DEFAULT_HOST + '/cars/' + registration.id + '/transferDeal';
        try {
            const result = await axios.get(url, config);
            const deal = result.data;
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
            ellipsis: true
        },
        {
            title: 'Biển số',
            dataIndex: 'registrationNumber',
            key: 'registrationNumber',
            render: (text, record) => {
                if (text === 'none') return "Chưa có"
                return text;
            },
        },
        {
            title: 'Chủ sở hữu',
            dataIndex: 'owner',
            key: 'owner',
            render: (text, record) => {
                return (
                    <a type="link" onClick={() => handleOwnerClick(record.owner)}>
                        {record.owner.fullName}
                    </a>
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
            filters: [
                {text: 'Đã đăng ký', value: 'registered'},
                {text: 'Đang đợi kiểm tra', value: 'pending'},
                {text: 'Đang chuyển quyền sở hữu', value: 'transferring_ownership'},
                {text: 'Đã hủy', value: 'rejected'}
            ],
            onFilter: (value, record) => record.registrationState.includes(value),
            render: (state) => {
                if (state === 'transferring_ownership')
                    return <Badge color="orange" text="Đang chuyển quyền sở hữu"></Badge>;
                if (state === 'pending')
                    return <Badge color="blue" text="Đang đợi kiểm tra và nhận biển số"></Badge>;
                if (state === 'registered') return <Badge color="green" text="Đã đăng ký"></Badge>;
                if (state === 'rejected') return <Badge color="red" text="Đã huỷ"></Badge>;
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
            },
            ellipsis: true
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
            width: 0
        },
    ];

    const fetchData = async () => {
        setTloading(true);
        try {
            const cars = await getData();
            if (cars.length === 0) return;
            setData(() => {
                return cars.map((car) => {
                    return car;
                });
            });
            setTloading(false);
        } catch (error) {
            console.log(error);
            setTloading(false)
        }
    };

    const getData = async () => {
        const url = DEFAULT_HOST + '/cars';
        try {
            const result = await axios.get(url, config);
            return result.data;
        } catch (error) {
            console.log(error);
        }
    }

    const handleListed = async () => {
        setTloading(true);
        const dataa = await getData();
        const newDate = dataa.filter(cars => {
            const regDate = new Date(cars.registrationTime).setUTCHours(0,0,0,0);
            return regDate >= range.start && regDate <=  range.end;
        });
        setData(newDate);
        setTloading(false);
    };

    const handleRangeDate = (value) => {
        if (value == null) {
            fetchData();
            return;
        }
        if (value[0])
            setRange({
                ...range,
                start: new Date(value[0]._d).setUTCHours(0, 0, 0, 0)
            })
        if (value[1])
            setRange({
                ...range,
                end: new Date(value[1]._d).setUTCHours(0, 0, 0, 0)
            });
    };

    return (
        <PageContainer>
            <Card>
                <Row gutter={1}>
                    <Col span={3}>
                        <Select defaultValue='id' placeholder="Tìm kiếm bằng" style={{ width: '100%' }} onSelect={onSelectField}>
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
                    <Col offset={5} span={8}>
                        <Space style={{float: 'right'}} >
                            <RangePicker onCalendarChange={handleRangeDate}></RangePicker>
                            <Button type='primary' onClick={handleListed}>Liệt kê</Button>
                        </Space>
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
