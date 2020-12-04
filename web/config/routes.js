export default [
  {
    path: '/',
    component: '../layouts/AuthLayout',
    routes: [
      {
        exact: true,
        name: 'landing',
        path: '/index',
        wrappers: ['@/wrappers/LandingWrappers'],
        component: './Landing'
      },
      {
        path: '/app',
        component: '../layouts/BasicLayout',
        wrappers: ['@/wrappers/Citizen'],
        routes: [
          {
            path: '/app',
            redirect: '/app/car-register'
          },
          {
            exact: true,
            name: 'RegistryCar',
            icon: 'FormOutlined',
            path: '/app/car-register',
            component: './CarRegister'
          },
          {
            exact: true, 
            name: "ChangeOwner",
            icon: 'SwapRightOutlined',
            path: '/app/change-owner',
            component: './ChangeOwner'
          },
          {
            exact: true, 
            name: "RegisteredCar",
            icon: 'CarOutlined',
            path: '/app/registered-car',
            component: './RegisteredCar'
          },
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
        path: '/police',
        component: '../layouts/BasicLayout', 
        routes: [
          {
            path: '/police',
            redirect: '/police/manage-registration'
          },
          {
            exact: true,
            path: '/police/manage-registration',
            component: './ManageReg',
            name: "manage-reg"
          },{
            exact: true,
            path: '/police/manage-citizen',
            name: 'manage-citizen',
            component: './ManageReg',
          },
          {
            path: '/police/read-registration/:id',
            component: './DetailRegistration',
            name: 'read',
            hideInMenu: true,
          }
        ]
      },
      {
        // path: '/404',
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },

];
