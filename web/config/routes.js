export default [
  {
    path: '/',
    component: '../layouts/AuthLayout',
    routes: [
      {
        exact: true,
        name: 'landing',
        path: '/index',
        component: '../layouts/BlankLayout',
        routes: [
          {
            path: '/index',
            wrappers: ['@/wrappers/LandingWrappers'],
            component: './Landing'
          }
        ]
      },
      {
        path: '/app',
        component: '../layouts/BasicLayout',
        routes: [
          {
            exact: true,
            name: 'RegistryCar',
            icon: 'file',
            path: '/app/car-register',
            component: './CarRegister'
          },
          // {
          //   path: '/welcome',
          //   name: 'welcome',
          //   icon: 'smile',
          //   component: './Welcome',
          // },
          // {
          //   path: '/admin',
          //   name: 'admin',
          //   icon: 'crown',
          //   component: './Admin',
          //   authority: ['admin'],
          //   routes: [
          //     {
          //       path: '/admin/sub-page',
          //       name: 'sub-page',
          //       icon: 'smile',
          //       component: './Welcome',
          //       authority: ['admin'],
          //     },
          //   ],
          // },
          // {
          //   name: 'list.table-list',
          //   icon: 'table',
          //   path: '/list',
          //   component: './ListTableList',
          // },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
