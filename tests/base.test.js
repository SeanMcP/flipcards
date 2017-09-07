const request = require('supertest')
const app = require('../server')

describe('GET /', function() {
  test('Should render sucessfully', function() {
    return request(app) // When we test app
      .get('/')         // and go to '/'
      .expect(200)      // we expect a status of 200
  })
})
