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
  test('Should render sucessfully', function() {
    return request(app) // When we test app
      .get('/')         // and go to '/'
      .expect(200)      // we expect a status of 200
  })
})
