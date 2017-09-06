var express = require('express');
var app = express();
var pug = require('pug');
var fs = require('fs');

var times = 0; // Counter för /hidden

app.set('view engine', 'pug');
app.set('views', __dirname + '/views')

app.use(express.static(__dirname + '/public'));

var logVisits = function(req, res, next) {
    let input = new Date() + ' ' + req.path + '\n';
    fs.appendFile('accessLog', input, (err) => {
        if (err) throw err;
    });
    next();
}
var hiddenCounter = function (req, res, next) {
    times++;
    console.log(times);
    next();
}

// Skriv ner info om vad som besökts och när.
app.use(logVisits);

// Räkna antalet besök till /hidden.
app.use('/hidden', hiddenCounter);

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Min sida för middleware'
    });
})
// Längst ner i routingen har vi ett wildcard.
// Den tar då hand om alla requests som inte stämmer.
app.get('*', (req, res) => {
    res.status(404).render('404', {
        title: '404 - not found'
    });
})



app.listen(3000, () => {
    console.log("Nu lyssnar vi på 3000.");
});