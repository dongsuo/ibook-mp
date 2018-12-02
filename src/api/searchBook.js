import qfetch from './index'

export function search (query) {
  query = {
    keyword: query.keyword || '',
    start: query.start || '',
    count: query.count || '',
    tag: query.tag || ''
  }
  return qfetch({
    url: `/searchbook?keyword=${query.keyword}&start=${query.start}&count=${query.count}&tag=${query.tag}`
  })
}
