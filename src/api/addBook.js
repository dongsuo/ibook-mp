import qfetch from './index'
// import config from 'config'

export function addBook (data) {
  return qfetch({
    url: '/addbook',
    method: 'POST',
    data: data
  })
}
