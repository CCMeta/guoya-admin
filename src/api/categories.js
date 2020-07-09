import request from '@/utils/request'

export function fetchList(query) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: '/admin/categories/index',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    // url: '/vue-element-admin/article/detail',
    url: '/admin/categories/get',
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
    url: '/admin/categories/post',
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
