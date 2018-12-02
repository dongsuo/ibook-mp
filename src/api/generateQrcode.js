import qfetch from './index'

export function getToken () {
  return qfetch({
    url: '/weapp/accesstoken'
  })
}

export function generateCode (token) {
  return qfetch({
    url: '/weapp/generatecode'
  })
}
