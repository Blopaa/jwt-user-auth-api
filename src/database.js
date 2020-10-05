const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/simplejwt', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {console.log(`Database connected`)})