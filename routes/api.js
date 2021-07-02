'use strict';

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post((req, res) => {
      let { board } = req.params;
      let {text} = req.body;
      let { delete_password } = req.body;

    })
    .get((req, res) => {
      let { board } = req.params;
    })
    .delete((req, res) => {
      let { board } = req.params;
      let { thread_id } = req.body;
      let { delete_password } = req.body;
    })
    .put((req, res) => {
      let { board } = req.params;
      let { thread_id } = req.body;
    })

  app.route('/api/replies/:board')
    .post((req, res) => {
      let { board } = req.params;
      let {text} = req.body;
      let { delete_password } = req.body;

    })
    .get((req, res) => {
      let { board } = req.params;
      let { thread_id } = req.query;
    })
    .delete((req, res) => {
      let { board } = req.params;
      let { thread_id } = req.body;
      let {text} = req.body;
      let { delete_password } = req.body;
    })
    .put((req, res) => {
      let { board } = req.params;
      let { thread_id } = req.body;
      let { reply_id } = req.body;
    })
};
