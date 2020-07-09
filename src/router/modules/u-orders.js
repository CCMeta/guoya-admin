/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const uTableRouter = {
  path: '/u-orders',
  component: Layout,
  redirect: '/u-orders/list',
  name: 'UOrders',
  meta: {
    title: 'uOrders',
    icon: 'skill'
  },
  children: [{
    path: 'list',
    component: () => import('@/views/u-orders/list'),
    name: 'UOrdersList',
    meta: {
      title: 'uOrdersList',
      icon: 'skill'
    }
  }]
}
export default uTableRouter
