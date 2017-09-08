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
        expect(res.body.status).toBe('success')
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toBeTruthy()
      })
  })
})

describe('GET /me', function() {
  test('Should send object sucessfully', function() {
    return request(app)
      .get('/me')
      .expect(200)
  })
})

// describe('GET /me', function() {
//   test('Should return a json object', function() {
//     return request(app)
//       .get('/me')
//       .expect(200)
//       .then(function(res) {
//         expect(res.body).toBeTruthy()
//       })
//   })
// })

describe('GET /decks', function() {
  test('Should send object containing all decks sucessfully', function() {
    return request(app)
      .get('/api/decks')
      .expect(200)
      .then(function(res) {
        expect(res.body).toHaveProperty('status')
        expect(res.body.status).toBe('success')
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toBeTruthy()
        // expect(res.body.data).toHaveProperty('data.id')
      })
  })
})
