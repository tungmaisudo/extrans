var express = require('express');
var router = express.Router();
var http = require('http');
const wordController = require('./../controllers/wordController');

router.get('/search/word', async function (req, res, next) {
    try {
        const word = req.query.word;
        const page = req.query.page;
        const limit = req.query.limit;
        const data = await wordController.findAll(word, page, limit);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.json([]);
    }
})

router.get('/:keyword', async function (req, res, next) {
    try {
        let keyword = req.params.keyword;

        const wordDb = await wordController.findByWord(keyword);
        let data = null;
        if (wordDb) {
            data = JSON.parse(wordDb.response);
            await wordController.updateCount(wordDb);
        } else {
            let url = 'http://inter.youdao.com/intersearch?q=' + keyword + '&from=vi&to=en';
            let resCalled = await doGet(url);
            data = resCalled.data;

            await wordController.save(keyword, 'UDictionary', data);
        }
        if (!data) {
            res.json(null);
        }
        const definition = data.eh.trs.map(item => {
            return item.i;
        });
        //
        const word_net = [];
        data.ee.word.trs.forEach(item => {
            let word_net_item = {};
            word_net_item.pos = item.pos;
            word_net_item.tr = [];
            const trItem = item.tr.map(tr => {
                return {
                    exam: tr.exam && tr.exam.i && tr.exam.i.f && tr.exam.i.f.l && tr.exam.i.f.l.map(l => l.i),
                    l: tr.l.i,
                    similar: tr['similar-words'] && tr['similar-words'].map(e => e.similar)
                }
            });
            word_net_item.tr = trItem;
            word_net.push(word_net_item);
        });

        const result = {
            word: '',
            pronunciation: data.eh[""],
            definition: definition,
            rel_word: data.rel_word,
            word_net: word_net,
            collins: data.collins.collins_entries,
            sentence: data.auth_sents_part.sent,
            phrases: data.phrs && data.phrs.phrs && data.phrs.phrs.map(p => p.phr.headword.l.i),
            synonyms: data.syno && data.syno.synos && data.syno.synos.map(s => s.syno),
            forvo: data.forvo.items
        }

        res.json(result);
    } catch (err) {
        console.log(err);
        res.json(null);
    }
});

async function doGet(url) {
    let p = new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            res.setEncoding('utf8');
            let responseBody = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(responseBody));
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });

    return await p;
}

module.exports = router;
