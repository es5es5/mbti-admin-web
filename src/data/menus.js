const MENUS = [
  {
    name: 'MBTI',
    route: 'MBTI',
    params: null,
    order: 0,
    icon: 'list-alt',
    roles: ['ROLE_ADMIN'],
    // roles: ['OTC_ADMIN', 'ROLE_ADMIN', 'EFA_MANAGER'], 'CLINIC_USER'
    subMenus: [
      {
        name: '아이돌',
        route: 'MBTI_아이돌',
        params: null,
        order: 0,
        icon: null,
        roles: ['ROLE_ADMIN'],
        // roles: ['OTC_ADMIN', 'ROLE_ADMIN', 'EFA_MANAGER'],
        subMenus: null
      },
    ]
  },
]

export default MENUS
