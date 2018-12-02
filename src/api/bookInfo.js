import qfetch from './index'

export function getBookInfo (isbn) {
  console.log(isbn)
  return qfetch({
    url: '/isbnbook' + '?isbn=' + isbn
  })
}
