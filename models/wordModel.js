const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const wordSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    word: {
        type: String,
        required: true,
    },
    response: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required:true
    },
    count: {
        type: Number,
        required: true
    },
    // createdAt: { type: Date, default: Date.now },
    // updatedAt:  { type: Date, default: Date.now }
},  {
    timestamps: { createdAt: true, updatedAt: true }
});

// wordSchema.pre('save', function (next) {
//     if (!this.createdAt) this.createdAt = new Date;
//     next();
// });
//
// wordSchema.pre('update', function (next) {
//     this.updatedAt = new Date;
//     next();
// });

const Word = mongoose.model('Word', wordSchema);
module.exports = Word;