const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const _ = require('lodash');

const app = express();

const { User } = require('./Helpers/UserClass');

// Create socket.io for server and listens to it. 
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const dbConfig = require('./Config/secret');
const auth = require('./Routes/authRoutes');
const posts = require('./Routes/postRoutes');
const users = require('./Routes/userRoute');
const friends = require('./Routes/friendsRoutes');
const message = require('./Routes/messageRoutes');
const image = require('./Routes/imageRoutes');

require('./socket/streams')(io, User, _);
require('./socket/private')(io);

// Middlewares 
app.use(cors());
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use('/api/socialconnect', auth);
app.use('/api/socialconnect', posts);
app.use('/api/socialconnect', users);
app.use('/api/socialconnect', friends);
app.use('/api/socialconnect', message);
app.use('/api/socialconnect', image);

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, { useNewUrlParser: true },
    (err) =>
        err ? console.log(err) : console.log(
            "Connected to socialconnect database", dbConfig.url));


let port = process.env.PORT;
if (port == null || port == '') {
    port = 3000;
}

// server.listen(3000, () => {
//     console.log('Server started on port 3000!');
// });

server.listen(port, () => {
    console.log(`Server started on port ${port} ${server}!`);
});