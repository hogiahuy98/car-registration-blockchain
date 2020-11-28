import React from 'react';
import TweenOne from 'rc-tween-one';
import { Menu, Modal } from 'antd';
import { getChildrenToRender } from './utils';
import LoginForm from './Components/LoginFrom'

const { Item, SubMenu } = Menu;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneOpen: undefined,
      loginVisible: false
    };
    this.loginClick = this.loginClick.bind(this);
  }

  loginClick = (e) => {
    e.preventDefault();
    this.setState({
      loginVisible: true
    })
  }

  render() {
    const { dataSource, isMobile, ...props } = this.props;
    const { phoneOpen, loginVisible } = this.state;
    const navData = dataSource.Menu.children;
    const navChildren = navData.map((item) => {
      const { children: a, subItem, ...itemProps } = item;
      return (
        <Item key={item.name} {...itemProps}>
          <a {...a} className={`header0-item-block ${a.className}`.trim()} onClick={(event)=>this.loginClick(event)}>
            {a.children.map(getChildrenToRender)}
          </a>
        </Item>
      );
    });
    const moment = phoneOpen === undefined ? 300 : null;
    return (
      <TweenOne
        component="header"
        animation={{ opacity: 0, type: 'from' }}
        {...dataSource.wrapper}
        {...props}
      >
        <div
          {...dataSource.page}
          className={`${dataSource.page.className}${phoneOpen ? ' open' : ''}`}
        >
          <TweenOne
            animation={{ x: -30, type: 'from', ease: 'easeOutQuad' }}
            {...dataSource.logo}
          >
            <img width="100%" src={dataSource.logo.children} alt="img" />
          </TweenOne>
          {isMobile && (
            <div
              {...dataSource.mobileMenu}
              onClick={() => {
                this.phoneClick();
              }}
            >
              <em />
              <em />
              <em />
            </div>
          )}
          <TweenOne
            {...dataSource.Menu}
            animation={
              isMobile
                ? {
                    height: 0,
                    duration: 300,
                    onComplete: (e) => {
                      if (this.state.phoneOpen) {
                        e.target.style.height = 'auto';
                      }
                    },
                    ease: 'easeInOutQuad',
                  }
                : null
            }
            moment={moment}
            reverse={!!phoneOpen}
          >
            <Menu
              mode={isMobile ? 'inline' : 'horizontal'}
              defaultSelectedKeys={['sub0']}
              theme="dark"
            >
              {navChildren}
            </Menu>
          </TweenOne>
        </div>
        <Modal
          visible={this.state.loginVisible}
          footer={false}
          title="Đăng nhập"
          onCancel={() => {this.setState({loginVisible: false})}}
        >
          <LoginForm></LoginForm>
        </Modal>
      </TweenOne>
    );
  }
}


export default Header;
