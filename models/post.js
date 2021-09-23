var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema(
    {
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        timestamp: { type: Date, required: true },
        title: { type: String, maxLength: 100, required: true },
        content: { type: String, required: true },
        is_published: { type: Boolean, required: true }
    }
);

module.exports = mongoose.model('Post', PostSchema);