const request = require('supertest')
const app = require('../server')

// describe('GET /api/bro', function() {
//   test('Should retrieve id and username successfully', function() {
//     return request(app)
//       .get('/api/bro')
//       .expect(200)
//       .then(function(res) {
//         expect(res.body).toHaveProperty('id')
//         expect(res.body).toHaveProperty('username')
//         expect(res.body.username).toBe('seanmcp')
//       })
//   })
// })

describe('GET /', function() {
  test('Should send object sucessfully', function() {
    return request(app)
      .get('/api/')
      .expect(200)
      .then(function(res) {
        expect(res.body).toHaveProperty('status')
        expect(res.body).toHaveProperty('data')
      })
  })
})
