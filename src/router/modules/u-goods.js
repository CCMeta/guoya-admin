/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const uTableRouter = {
  path: '/u-goods',
  component: Layout,
  redirect: '/u-goods/list',
  name: 'UGoods',
  meta: {
    title: 'uGoods',
    icon: 'theme'
  },
  children: [{
    path: 'goods',
    component: () => import('@/views/u-goods/list'),
    name: 'UGoodsList',
    meta: {
      title: 'uGoodsList',
      icon: 'list'
    }
  }, {
    path: 'categories',
    component: () => import('@/views/u-goods/categories'),
    name: 'UGoodsCategories',
    meta: {
      title: 'uGoodsCategories',
      icon: 'tree-table'
    }
  }]
}
export default uTableRouter
