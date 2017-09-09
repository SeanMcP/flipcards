const request = require('supertest')
const app = require('../server')

describe('GET /', function() {
  test('Should send object sucessfully', function() {
    return request(app)
      .get('/api/')
      .expect(200)
      .set({"Authorization": "Basic YW5uZTphbm5l"})
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
      .get('/api/me')
      .expect(200)
      .set({"Authorization": "Basic YW5uZTphbm5l"})
  })
})

describe('GET /decks', function() {
  test('Should send object containing all decks sucessfully', function() {
    return request(app)
      .get('/api/decks')
      .expect(200)
      .set({"Authorization": "Basic YW5uZTphbm5l"})
      .then(function(res) {
        expect(res.body).toHaveProperty('status')
        expect(res.body.status).toBe('success')
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toBeTruthy()
      })
  })
})

describe('POST /decks', function() {
  test('Should create one deck', function() {
    return request(app)
      .post('/api/decks')
      .type('form')
      .send({
        name: "Testing Name",
        description: "This is a des"
      })
      .set({"Authorization": "Basic YW5uZTphbm5l"})
      .expect(200)
      .then(function(res) {
        expect(res.body).toHaveProperty('status')
        expect(res.body.status).toBe('success')
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toBeTruthy()
      })
  })
})

describe('POST /decks/:id/cards', function() {
  test('Should create one card with deckId req.params.id', function() {
    return request(app)
      .post('/api/decks/45/cards')
      .set({"Authorization": "Basic YW5uZTphbm5l"})
      .type('form')
      .send({
        // deckId: 1,
        front: "Front of card",
        back: "Back of card"
      })
      .expect(200)
      .then(function(res) {
        expect(res.body).toHaveProperty('status')
        expect(res.body.status).toBe('success')
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toBeTruthy()
      })
  })
})

describe('PUT /cards/:id', function() {
  test('Should edit one card with id req.params.id', function() {
    return request(app)
      .put('/api/cards/1')
      .type('form')
      .send({
        front: "Front of card",
        back: "Back of card"
      })
      .expect(200)
      .set({"Authorization": "Basic YW5uZTphbm5l"})
      .then(function(res) {
        expect(res.body).toHaveProperty('status')
        expect(res.body.status).toBe('success')
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toBeTruthy()
      })
  })
})

describe('DELETE /cards/:id', function() {
  test('Should delete one card with id req.params.id', function() {
    return request(app)
      .delete('/api/cards/1')
      .expect(200)
      .set({"Authorization": "Basic YW5uZTphbm5l"})
      .then(function(res) {
        expect(res.body).toHaveProperty('status')
        expect(res.body.status).toBe('success')
        expect(res.body).toHaveProperty('data')
      })
  })
})
