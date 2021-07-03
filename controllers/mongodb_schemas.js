var mongoose = require('mongoose');
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })

// DB Schemas.
const Schema = mongoose.Schema;

const replySchema = new Schema({
    text: {type: String, required: true},
    created_on: {type: Date},
    reported: {type: Boolean, default: false},
    delete_password: {type: String},
});

const threadSchema = new Schema({
    board: {type: String, required: true},
    text: {type: String, required: true},
    created_on: {type: Date},
    bumped_on: {type: Date},
    reported: {type: Boolean, default: false},
    delete_password: {type: String},
    replies: {type: [replySchema]}
});

// Create DB models.
let Thread = mongoose.model("thread", threadSchema);
let Reply = mongoose.model("reply", replySchema);

// Export DB models.
module.exports = {Thread: Thread, Reply: Reply};