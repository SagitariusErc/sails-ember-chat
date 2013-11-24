/**
 * ChatController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

	/* e.g.
	sayHello: function (req, res) {
		res.send('hello world!');
	}
	*/
	send: function(req, res)
	{
		req.socket.join(req.param('room'));
		
		sails.io.sockets.in(req.param('room'))
			.emit('chat-' + req.param('room'), 
				{
					message: req.param('message'),
					username: req.param('username')
				});

		return res.json({success: true});
	},

	join: function(req, res)
	{
		console.log(req.param('user') + ' has joined room ' + req.param('room'));
		
		req.socket.join(req.param('room'));
		
		sails.io.sockets.in(req.param('room'))
			.emit('join-' + req.param('room'), 
				{
					name: req.param('user'),
					notify: true
				});

		req.session.user.lastRoom = req.param('room');

		return res.json({success: true});
	},

	leave: function(req, res)
	{
		console.log(req.param('user') + ' has left room ' + req.param('room'));

		req.socket.leave(req.param('room'));
		
		sails.io.sockets.in(req.param('room'))
			.emit('leave-' + req.param('room'),
				{
					name: req.param('user'),
					notify: true
				});

		req.session.user.lastRoom = 0;

		return res.json({success: true});
	}

};
