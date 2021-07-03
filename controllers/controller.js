const { Thread } = require('./mongodb_schemas.js');
const { Reply } = require('./mongodb_schemas.js');

class MessageBoard {
  createThread = (board, text, delete_password, done) => {
    let newThread = new Thread({
      board: board,
      text: text,
      delete_password: delete_password,
      created_on: new Date(),
      bumped_on: new Date()
    })
    newThread.save((err, savedThread) => {
      if(err) {
        return done('Something went wrong');
      } else {
        done(null, savedThread);
      }
    });
  };
  
  createReply = (board, thread_id, text, delete_password, done) => {
    Thread.findOne({board: board, _id: thread_id})
          .exec((err, foundThread) => {
            if(err){
              return done('Something went wrong');
            } else if(!foundThread) {
              return done('Thread does not exist');
            } else {
              let newReply = new Reply({
                text: text,
                delete_password: delete_password,
                created_on: new Date()
              });
              foundThread.replies.push(newReply);
              foundThread.bumped_on = newReply.created_on;
              foundThread.save((err) => {
                if(err) done('Somehting went wrong');
                done(null, {response: 'success'});
              });
            }
          });
  };

  getThreads = (board, done) => {
    Thread.find({board: board})
          .sort({ bumped_on: -1 })
          .select('-__v -reported -delete_password -replies.delete_password -replies.reported')
          .limit(10)
          .exec((err, foundThreads) => {
            if(err){
              return done('Something went wrong');
            } else if(foundThreads.length == 0) {
              return done('Board does not exist');
            } else {
              foundThreads.forEach((thread, index, threadArray) => {
                threadArray[index].replies = thread.replies.slice(-3);
              });
              done(null, foundThreads);
            }
          });
  };

  getReplies = (board, thread_id, done) => {
    Thread.findOne({board: board, _id: thread_id})
          .select('-__v -reported -delete_password -replies.delete_password -replies.reported')
          .exec((err, foundThread) => {
            if(err) {
              return done('Something went wrong');
            } else if(!foundThread){
              return done('Invalid thread_id/board');
            } else {
              return done(null, foundThread)
            }
          });
  };

  deleteThread = (board, thread_id, delete_password, done) => {
    Thread.findOne({board: board, _id: thread_id})
          .exec((err, foundThread) => {
            if(err) {
              return done('Something went wrong');
            } else if(!foundThread) {
              return done('Invalid thread_id/board');
            } else {
              if(foundThread.delete_password != delete_password) {
                done(null, 'incorrect password');
              } else {
                foundThread.remove((err) => {
                  if(err) {
                    return done('Something went wrong');
                  } else {
                    done(null, 'success');
                  }
                });
              }
            }
          });
  };

  deleteReply = (board, thread_id, reply_id, delete_password, done) => {
    Thread.findOne({board: board, _id: thread_id})
          .exec((err, foundThread) => {
            if(err) {
              return done('Something went wrong');
            } else if(!foundThread.replies.id(reply_id)){
              return done('Invalid thread_id, reply_id');
            } else {
              if(foundThread.replies.id(reply_id).delete_password !== delete_password) {
                done(null, 'incorrect password');
              } else {
                foundThread.replies.id(reply_id).remove((err) => {
                  if(err) {
                    return done('Something went wrong');
                  } else {
                    done(null, 'success');
                  }
                });
              }
            }
          });
  };

  reportThread = (board, thread_id, done) => {
    Thread.findOne({board: board, _id: thread_id})
          .exec((err, foundThread) => {
            if(err) {
              return done('Something went wrong');
            } else if(!foundThread) {
              return done('Invalid thread_id');
            } else {
              foundThread.reported = true;
              foundThread.save((err) => {
                if(err){
                  return done('Something went wrong');
                } else {
                  return done(null, 'success');
                }
              })
            }
          });
  };

  reportReply = (board, thread_id, reply_id, done) => {
    Thread.findOne({board: board, _id: thread_id})
          .exec((err, foundThread) => {
            if(err) {
              return done('Something went wrong');
            } else if(!foundThread.replies.id(reply_id)) {
              return done('Invalid thread_id, reply_id');
            } else {
              foundThread.replies.id(reply_id).reported = true;
              foundThread.save((err) => {
                if(err) {
                  return done('Something went wrong');
                } else {
                  return done(null, 'success')
                }
              });
            }
          });
  }
}

module.exports = MessageBoard;