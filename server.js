const express = require('express');
const app = express();

app.use('/public',express.static('dist'));
// app.get('/',(req,res) => res.end('hello world'))

app.listen(3300, function() {
    console.log("Express satart successfully");
});

