var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema(
    {
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        timestamp: { type: Date, requried: true },
        content: { type: String, required: true},
        post: { type: Schema.Types.ObjectId, ref: 'Post', required: true }
    }
);

module.exports = mongoose.model('Comment', CommentSchema);