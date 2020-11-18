import { Button } from 'antd';
import { QuestionCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import React, { useContext } from 'react';
import { connect, SelectLang, history } from 'umi';
import styles from './index.less';
const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

import AuthContext from '@/context/AuthContext';

const GlobalHeaderRight = (props) => {
  const { theme, layout } = props;
  const { logout } = useContext(AuthContext);
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const handleLogout = () => {
    logout();
    history.push('/index');
  }

  return (
    <div className={className}>
      <Button type='link' danger onClick={handleLogout}>Đăng xuất<LogoutOutlined /></Button>
    </div>
  );
};

export default connect(({ settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
