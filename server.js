const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

// Create socket.io for server and listens to it. 
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const dbConfig = require('./Config/secret');
const auth = require('./Routes/authRoutes');
const posts = require('./Routes/postRoutes');
const users = require('./Routes/userRoute');
const friends = require('./Routes/friendsRoutes');
const message = require('./Routes/messageRoutes');

require('./socket/streams')(io);
require('./socket/private')(io);

// Middlewares 
app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(cookieParser());
app.use('/api/socialconnect', auth);
app.use('/api/socialconnect', posts);
app.use('/api/socialconnect', users);
app.use('/api/socialconnect', friends);
app.use('/api/socialconnect', message);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, { useNewUrlParser: true });

// const auth = require('./Routes/authRoutes');
// app.use('/api/socialconnect', auth);


server.listen(3000, () => {
    console.log('Server started on port 3000!');
});