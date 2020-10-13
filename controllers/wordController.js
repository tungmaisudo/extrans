const Word = require('../models/wordModel');
const mongoose = require('mongoose');
const APIFeatures = require('../utils/apiFeatures');


exports.save = async (word, source, response) => {
    try {
        const wordSave = new Word({
            _id: mongoose.Types.ObjectId(),
            word: word,
            source: source,
            response: JSON.stringify(response),
            count: 1
        });
        await wordSave.save().then(newWord => {
            console.log(newWord);
        }).catch(error => console.log(error));

    } catch (error) {
        console.log(error);
    }
};

exports.findByWord = async (word) => {
    try {
        const wordDb = await Word.findOne({word: word});
        return wordDb;
    } catch (error) {
        console.log(error);
    }
}

exports.updateCount = async (word) => {
    try {

        await Word.updateOne({_id: word.id}, { $set: {count: word.count+ 1}});
    } catch (error) {
        console.log(error);
    }
}

exports.findAll = async(word, page, limit) => {
    const features = new APIFeatures(Word.find({word: new RegExp('^'+word+'$', "i")}), {
        sort: 'count desc',
        page: page,
        limit: limit
    })
        .sort()
        .paginate();

    const doc = await features.query
    return doc;
}