import React from 'react';
export const Nav00DataSource = {
  wrapper: { className: 'header0 home-page-wrapper' },
  page: { className: 'home-page' },
  logo: {
    className: 'header0-logo',
    children: 'https://os.alipayobjects.com/rmsportal/mlcYmsRilwraoAe.svg',
  },
  Menu: {
    className: 'header0-menu',
    children: [
      {
        name: 'item0',
        className: 'header0-item',
        children: {
          href: '#',
          children: [
            {
              children: (
                <span>
                  <p>ĐĂNG NHẬP</p>
                </span>
              ),
              name: 'text',
            },
          ],
        },
      },
    ],
  },
  mobileMenu: { className: 'header0-mobile-menu' },
};
export const Banner50DataSource = {
  wrapper: { className: 'home-page-wrapper banner5' },
  page: { className: 'home-page banner5-page' },
  childWrapper: {
    className: 'banner5-title-wrapper',
    children: [
      {
        name: 'title',
        children: (
          <span>
            <span>
              <span>
                <span>
                  <span>
                    <p>ĐĂNG KÝ XE TRỰC TUYẾN</p>
                  </span>
                </span>
              </span>
            </span>
          </span>
        ),
        className: 'banner5-title khj6umpxte-editor_css',
      },
      {
        name: 'explain',
        className: 'banner5-explain',
        children: (
          <span>
            <p>Áp dụng công nghê Blockchain</p>
          </span>
        ),
      },
      {
        name: 'content',
        className: 'banner5-content',
        children: (
          <span>
            <p>Xây dựng trên nền tảng Hyperledger Fabric</p>
          </span>
        ),
      },
      {
        name: 'button',
        className: 'banner5-button-wrapper',
        children: {
          href: '#',
          className: 'banner5-button',
          type: 'primary',
          children: (
            <span>
              <p>Đăng ký ngay</p>
            </span>
          ),
        },
      },
    ],
  },
  image: {
    className: 'banner5-image',
    children:
      'https://gw.alipayobjects.com/mdn/rms_ae7ad9/afts/img/A*-wAhRYnWQscAAAAAAAAAAABkARQnAQ',
  },
};
