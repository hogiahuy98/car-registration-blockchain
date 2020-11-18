import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage = () => {
  history.push('/index');
  return (<div></div>)
};

export default NoFoundPage;
