import {TabInfo} from '../../tabs-page/tabs-state.service';

export interface MENU_ITEM_INTERFACE extends TabInfo {
  children: MENU_ITEM_INTERFACE[]
  param?: string
}

export const MENU_ITEMS: MENU_ITEM_INTERFACE[] = [
  {
    key: '/tabs/feature-a',
    title: 'Feature A',
    route: '/tabs/feature-a',
    component: null,
    isDetail: false,
    children: [],
    data: {}
  },
  {
    key: '/tabs/feature-b',
    title: 'Feature B',
    route: '/tabs/feature-b',
    component: null,
    isDetail: false,
    children: [
      {
        key: '/tabs/feature-b/',
        title: 'Item',
        route: '/tabs/feature-b/',
        param: 'title',
        component: null,
        isDetail: true,
        children: [],
        data: {},
      },
    ],
    data: {}
  },
  {
    key: '/tabs/feature-c',
    title: 'Feature C',
    route: '/tabs/feature-c',
    component: null,
    isDetail: false,
    children: [],
    data: {}
  },
]
