const MENUS = [
  {
    name: '계약',
    route: '계약',
    params: null,
    order: 0,
    icon: 'list-alt',
    roles: ['ROLE_ADMIN'],
    // roles: ['OTC_ADMIN', 'ROLE_ADMIN', 'EFA_MANAGER'], 'CLINIC_USER'
    subMenus: [
      {
        name: '신계약',
        route: '계약_신계약',
        params: null,
        order: 0,
        icon: null,
        roles: ['ROLE_ADMIN'],
        // roles: ['OTC_ADMIN', 'ROLE_ADMIN', 'EFA_MANAGER'],
        subMenus: null
      },
    ]
  },
  {
    name: '업무보고',
    route: '업무보고',
    params: null,
    order: 0,
    icon: 'list-alt',
    roles: ['ROLE_ADMIN'],
    subMenus: [
      {
        name: '일일업무보고',
        route: '업무보고_일일업무보고',
        params: null,
        order: 1,
        icon: null,
        roles: ['ROLE_ADMIN'],
        subMenus: null
      }
    ]
  },
]

export default MENUS
