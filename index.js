const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const UsersService = require('./UsersService');
const path = require('path');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

const userService = new UsersService();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
let fileName = 0;

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './public/uploads')
	},
	filename: function(req, file, callback) {
		console.log(file);
		fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
		callback(null, fileName);
	}
});

app.post('/upload', function(req, res) {
	var upload = multer({
		storage: storage,
		fileFilter: function (req, file, callback) {
	        var ext = path.extname(file.originalname);
	        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
	            return callback(new Error('Only images are allowed'))
	        }
	        callback(null, true)
	    },
    	limits: {
        	fileSize: 1024 * 1024
    	}
	}).single('userFile')
	upload(req, res, function(err) {
		res.redirect('back');
	})
});

io.on('connection', function(socket) {
	socket.on('join', function(name) {
		userService.addUser({
			id: socket.id,
			name,
			image: '/uploads/' + (fileName ? fileName : 'default-avatar.png')
		});
		io.emit('update', {
			users: userService.getAllUsers()
		});
		fileName = 0;
	});

	socket.on('disconnect', () => {
		userService.removeUser(socket.id);
		socket.broadcast.emit('update', {
			users: userService.getAllUsers()
		});
	});

	socket.on('message', function(message) {
		const {name, image} = userService.getUserById(socket.id);
		io.sockets.emit('message', {
			id: uuidv4(),
			text: message.text,
			from: name,
			image: image
		});
	});
});

server.listen(3000, function(){
	console.log('listening on *:3000');
});