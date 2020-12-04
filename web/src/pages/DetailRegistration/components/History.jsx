import React from 'react';
import {Table} from 'antd';

const TIMELINE_ACTION_TYPE = [
    "Đăng ký lên hệ thống",
    "CSGT đăng kiểm, bấm biển số",
    "Huỷ đăng ký",
    "Chuyển đổi quyền sở hữu",
    "Thay đổi thông tin xe"
]


export default ({history}) => {

    const columns = [
        {
            title: 'Thời gian',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: "Người thực hiện",
            dataIndex: 'user',
            key: 'user',
            render: (text, record) => {
                if(record.modifyUser.role === 'police') return "CSGT. " + record.modifyUser.fullName;
                return record.modifyUser.fullName
            }
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'modifyType',
            render: (text, record) => {
                return TIMELINE_ACTION_TYPE[record.modifyType];
            }
        }
    ]
    return (
        <Table columns={columns} dataSource={history}></Table>
    )
}