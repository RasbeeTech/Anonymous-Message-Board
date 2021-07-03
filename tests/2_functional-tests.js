const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let test_id = '';
  let test_id2 = '';
  let test_id3 = '';
  let test_id4 = '';
  test('Creating a new thread: POST request to /api/threads/{board}', (done)=> {
    chai.request(server)
        .post('/api/threads/test')
        .type('form')
        .send({
          text: 'testing',
          delete_password: 'test_password'
        })
        .end((err, res)=> {
          assert.equal(res.status, 200);

          test_id = res.body._id;
        });
    chai.request(server)
        .post('/api/threads/test')
        .type('form')
        .send({
          text: 'testing2',
          delete_password: 'test_password2'
        })
        .end((err, res)=> {
          assert.equal(res.status, 200);

          test_id2 = res.body._id;
          done()
        });
  });
  test('Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}', (done)=> {
    chai.request(server)
        .get('/api/threads/test')
        .end((err, res)=> {
          assert.equal(res.status, 200);
          done()
        });
  });
  test('DELETE request to /api/threads/{board} with an invalid delete_password', (done)=> {
    chai.request(server)
        .delete('/api/threads/test')
        .send({
          thread_id: test_id,
          delete_password: 'wrong_password'
        })
        .end((err, res)=> {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done()
        });
  });
  test('DELETE request to /api/threads/{board} with a valid delete_password', (done)=> {
    chai.request(server)
        .delete('/api/threads/test')
        .send({
          thread_id: test_id,
          delete_password: 'test_password'
        })
        .end((err, res)=> {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done()
        });
  });
  test('Reporting a thread: PUT request to /api/threads/{board}', (done)=> {
    chai.request(server)
        .put('/api/threads/test')
        .send({
          thread_id: test_id2,
        })
        .end((err, res)=> {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done()
        });
  });
  test('Creating a new reply: POST request to /api/replies/{board}', (done)=> {
    chai.request(server)
        .post('/api/replies/test')
        .type('form')
        .send({
          text: 'testing',
          delete_password: 'test_password',
          thread_id: test_id2
        })
        .end((err, res)=> {
          assert.equal(res.status, 200);

          test_id3 = res.body._id;
        });
    chai.request(server)
        .post('/api/replies/test')
        .type('form')
        .send({
          text: 'testing2',
          delete_password: 'test_password2',
          thread_id: test_id2
        })
        .end((err, res)=> {
          assert.equal(res.status, 200);

          test_id4 = res.body._id;
          done()
        });
  });
  test('Viewing a single thread with all replies: GET request to /api/replies/{board}', (done)=> {
    chai.request(server)
        .get('/api/replies/test?thread_id=' + test_id2)
        .end((err, res)=> {
          assert.equal(res.status, 200);
          done()
        });
  });
  test('DELETE request to /api/replies/{board} with an invalid delete_password', (done)=> {
    chai.request(server)
        .delete('/api/replies/test')
        .send({
          thread_id: test_id2,
          reply_id: test_id3,
          delete_password: 'wrong_password'
        })
        .end((err, res)=> {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done()
        });
  });
  test('DELETE request to /api/replies/{board} with a valid delete_password', (done)=> {
    chai.request(server)
        .delete('/api/replies/test')
        .send({
          thread_id: test_id2,
          reply_id: test_id3,
          delete_password: 'test_password'
        })
        .end((err, res)=> {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done()
        });
  });
  test('Reporting a reply: PUT request to /api/replies/{board}', (done)=> {
    chai.request(server)
        .put('/api/threads/test')
        .send({
          thread_id: test_id2,
          reply_id: test_id4
        })
        .end((err, res)=> {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done()
        });
  });

});
