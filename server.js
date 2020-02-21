const express = require('express');
const path = require('path');

const app = express();

const defaultPath = path.join(__dirname, 'dist');
app.use(express.static(defaultPath));

app.listen(3301, function() {
    console.log("Express satart successfully at port 3301");
});

