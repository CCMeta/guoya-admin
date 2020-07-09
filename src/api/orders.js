import request from '@/utils/request'

export function fetchList(query) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: '/admin/orders/index',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    // url: '/vue-element-admin/article/detail',
    url: '/admin/orders/get',
    method: 'get',
    params: {
      id
    }
  })
}

export function fetchPv(pv) {
  return request({
    // url: '/vue-element-admin/article/pv',
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: {
      pv
    }
  })
}

export function createArticle(data) {
  return request({
    url: '/admin/orders/post',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/admin/categories/update',
    method: 'post',
    data
  })
}
