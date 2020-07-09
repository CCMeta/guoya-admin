import request from '@/utils/request'

export function fetchList(query) {
  return request({
    // url: '/vue-element-admin/article/list',
    url: '/admin/goods/index',
    method: 'get',
    params: query
  })
}

export function fetchCategories(query) {
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
    url: '/admin/goods/get',
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
    url: '/admin/goods/post',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/admin/goods/update',
    method: 'post',
    data
  })
}

export function uploadImage(data) {
  return request({
    url: '/admin/goods/image',
    method: 'post',
    data
  })
}
