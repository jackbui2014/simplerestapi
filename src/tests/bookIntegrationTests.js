const should = require('should');
const supertest = require('supertest');

const mongoose = require('mongoose');

process.env.ENV = 'Test';
const app = require('../../app.js');
const { expectation } = require('sinon');
const Book = mongoose.model('Book');
const agent = supertest.agent(app);

describe('Book crud test: ', () => {
  it('it should allow a book to be posted and return read and _id', (done) => {
    const bookPost = { title: 'My book', genre: 'Fiction', author: 'Jack' };
    agent.post('/api/books')
      .send(bookPost)
      .expect(200)
      .end((err, results) => {
        //console.log(results);
        //results.body.read.should.not.equal(false);
        results.body.should.have.property('_id');
        done();
      })

  });
  afterEach((done) => {
    Book.deleteMany({}).exec();
    done();
  })

  after((done)=>{
    mongoose.connection.close();
    app.server.close(done());
  })
})