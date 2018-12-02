import qfetch from './index'

export function usercollection () {
  return qfetch({
    url: `/usercollection`
  })
}
