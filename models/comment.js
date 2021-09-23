var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema(
    {
        author: { type: Schema.Types.ObjectId, required: true },
        timestamp: { type: Date, requried: true },
        content: { type: String, required: true}
    }
);

module.exports = mongoose.model('Comment', CommentSchema);