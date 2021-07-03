'use strict';
const MessageBoard = require('../controllers/controller.js');

module.exports = function (app) {
  let messageBoard = new MessageBoard();

  app.route('/api/threads/:board')
    .post((req, res) => {
      let { board } = req.params;
      let {text} = req.body;
      let { delete_password } = req.body;

      messageBoard.createThread(board, text, delete_password, (err, createdThread) => {
        if(err) {
          return res.json({error: err});
        } else {
          return res.json(createdThread);
        }
      })
    })
    .get((req, res) => {
      let { board } = req.params;

      messageBoard.getThreads(board, (err, threads) => {
        if(err) {
          return res.json({error: err});
        } else {
          return res.json(threads);
        }
      });
    })
    .delete((req, res) => {
      let { board } = req.params;
      let { thread_id } = req.body;
      let { delete_password } = req.body;

      messageBoard.deleteThread(board, thread_id, delete_password, (err, repsonse) => {
        if(err) {
          return res.send(err);
        } else {
          return res.send(repsonse);
        }
      });
    })
    .put((req, res) => {
      let { board } = req.params;
      let { thread_id } = req.body;

      messageBoard.reportThread(board, thread_id, (err, repsonse) => {
        if(err) {
          return res.send(err);
        } else {
          return res.send(repsonse);
        }
      })
    })

  app.route('/api/replies/:board')
    .post((req, res) => {
      let { board } = req.params;
      let { thread_id } = req.body;
      let {text} = req.body;
      let { delete_password } = req.body;

      messageBoard.createReply(board, thread_id, text, delete_password, (err, newReply) => {
        if(err) {
          return res.json({error: err});
        } else {
          return res.json(newReply);
        }
      });

    })
    .get((req, res) => {
      let { board } = req.params;
      let { thread_id } = req.query;

      messageBoard.getReplies(board, thread_id, (err, foundThread)=> {
        if(err) {
          return res.json({error: err});
        } else {
          return res.json(foundThread);
        }
      });
    })
    .delete((req, res) => {
      let { board } = req.params;
      let { thread_id } = req.body;
      let { reply_id } = req.body;
      let { delete_password } = req.body;

      messageBoard.deleteReply(board, thread_id, reply_id, delete_password, (err, response)=> {
        if(err) {
          return res.send(err);
        } else {
          return res.send(response);
        }
      });
    })
    .put((req, res) => {
      let { board } = req.params;
      let { thread_id } = req.body;
      let { reply_id } = req.body;
      
      messageBoard.reportReply(board, thread_id, reply_id, (err, response) => {
        if(err) {
          return res.send(err);
        } else {
          return res.send(response);
        }
      });
    })
};
