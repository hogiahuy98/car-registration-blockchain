import React from 'react';
import {Button, Table} from 'antd';
import { useEffect } from 'react';

const TIMELINE_ACTION_TYPE = [
    "Đăng ký lên hệ thống",
    "CSGT đăng kiểm, bấm biển số",
    "Huỷ đăng ký",
    "Yêu cầu chuyển đổi quyền sở hữu",
    "Thay đổi thông tin xe",
    "CSGT xác nhận chuyển quyền sở hữu",
    "Người nhận xác nhận quyền sở hữu",
    "Hủy chuyển quyền sở hũu",
];


export default ({history, watchState, loading}) => {
    useEffect(() => console.log(history));
    const columns = [
        {
            title: 'Thời gian',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Người thực hiện',
            dataIndex: 'user',
            key: 'user',
            render: (text, record) => {
                if (record.modifyUser.role === 'police')
                    return 'CSGT. ' + record.modifyUser.fullName;
                return record.modifyUser.fullName;
            },
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'modifyType',
            render: (text, record) => {
                return TIMELINE_ACTION_TYPE[record.modifyType];
            },
        },
        {
            title: 'Xem trạng thái',
            render: (text, record) => {
                return (
                    <Button
                        onClick={() => {
                            loading(true);
                            watchState({
                                ...record,
                                history,
                            });
                            setTimeout(() => loading(false), 1000)
                        }}
                    >
                        Xem
                    </Button>
                );
            },
        },
    ];
    return (
        <Table  columns={columns} dataSource={history}></Table>
    )
}