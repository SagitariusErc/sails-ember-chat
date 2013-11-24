var C = Em.Application.create();
var socket = io.connect();
window.socket = socket;

C.User = Em.Object.create({
	name: null,
	loggedIn: false,
	activeRoom: 0
});

C.Router.map(function() {
	this.resource('start');
	this.resource('rooms');
	this.resource('room', { path: '/room/:room_id' });
	this.route('logout');
});

C.ApplicationRoute = Em.Route.extend({
	model: function()
	{
		return new Em.RSVP.Promise(function(resolve) {
			$.getJSON('/user/me', function(data)
			{
				C.User.name = data.name;
				C.User.loggedIn = data.loggedIn;
				C.User.lastRoom = data.lastRoom;
				C.User.set('loggedIn', data.loggedIn);
				resolve(C.User);
			});
		});
	},

	afterModel: function(model)
	{
		if (C.User.loggedIn)
		{
			if (model.lastRoom)
			{
				this.transitionTo('room', model.lastRoom);
			}
			else
			{
				this.transitionTo('rooms');
			}
		}
		else
		{
			this.transitionTo('start');
		}
	}

});

C.IndexRoute = Em.Route.extend({
	redirect: function()
	{
		if (C.User.loggedIn)
		{
			if (C.User.activeRoom)
			{
				C.User.activeRoom.leave();
			}
			this.transitionTo('rooms');
		}
		else
			this.transitionTo('start');
	}
});

C.StartController = Em.ObjectController.extend({
	name: '',

	start: function()
	{
		router = this;
		if (this.get('name'))
		{
			$.post('/user/login', { name: this.get('name') }, function(data)
			{
				C.User.set('name', data.name);
				//C.User.loggedIn = data.loggedIn;
				C.User.set('loggedIn', data.loggedIn);

				router.transitionToRoute('rooms');
			});
		}
		else
		{
			$('#nicknameInput').focus();
		}
	}
});

C.Room = Em.Model.extend({
	name: Em.attr(),
	messages: null,
	users: null,
	isJoined: false,

	init: function()
	{
		this.messages = [];
		this.users = [];
	},

	join: function()
	{
		var model = this;
		
		socket.on('chat-' + this.id, function(data)
		{
			model.messages.pushObject(
				{
					message: emot(data.message),
					username: data.username
				});

			$('#chat-inner').animate({ scrollTop: $('#chat-inner')[0].scrollHeight }, 2000);
		});

		socket.on('join-' + this.id, function(data)
		{
			model.users.pushObject(data);

			model.messages.pushObject(
				{
					username: data.name,
					message: 'has joined the room.',
					notify: true
				});
		});

		socket.on('leave-' + this.id, function(data)
		{
			model.messages.pushObject(
				{
					username: data.name,
					message: 'has left the room.',
					notify: true
				});

			model.users.popObject(data);
		});

		socket.request('/chat/join', { room: this.id, user: C.User.name });

		this.set('isJoined', true);
		C.User.activeRoom = this;
	},

	leave: function()
	{
		this.users.popObject({ name: C.User.name });
		this.set('isJoined', false);
		socket.request('/chat/leave', { room: this.id, user: C.User.name });
		socket.removeAllListeners('chat-' + this.id);
		socket.removeAllListeners('join-' + this.id);
		socket.removeAllListeners('leave-' + this.id);

		C.User.activeRoom = null;

		this.messages.clear();
	},

	send: function(messageText)
	{
		if (this.isJoined)
			socket.request('/chat/send', {
					message: messageText,
					username: C.User.name,
					room: this.id
				});
			//socket.emit('chat', { message: messageText, username: C.User.name, room: this.id });
	}
});

C.Room.url = '/room';
C.Room.adapter = Em.RESTAdapter.create();

C.RoomsRoute = Em.Route.extend({
	model: function()
	{
		return C.Room.find();
	},

	afterModel: function(model)
	{
		if (model.count > 0)
			this.get('controller').set('join', false);
	}
});

C.RoomsController = Em.ArrayController.extend({
	joinedRooms: Em.A(),
	join: true,

	actions: {

		create: function()
		{
			if (this.get('newRoom'))
			{
				var newRoom = C.Room.create({ name: this.get('newRoom') });
				newRoom.save();
				this.set('newRoom', '');
			}
		},

		willJoin: function()
		{
			this.set('join', true);
		},

		willCreate: function()
		{
			this.set('join', false);
		}

	}
});

C.RoomRoute = Em.Route.extend({
	model: function(params)
	{
		var room = C.Room.find(params.room_id);

		if (C.User.lastRoom == params.room_id)
		{
			room.isJoined = true;
		}

		return room;
	},

	afterModel: function(model)
	{
		model.join();
	}
});

C.RoomController = Em.ObjectController.extend({

	text: '',
	emots: emots,

	actions: {

		joinRoom: function()
		{
			this.set('isJoined', true);
			this.get('model').join();
			$('#sender').focus();
		},

		leaveRoom: function()
		{
			this.set('isJoined', false);
			this.get('model').leave();

			this.transitionToRoute('rooms');
		},

		sendMessage: function()
		{
			if (this.get('text') === '')
				return;
			else if (this.get('text').length < 2)
				return;

			this.get('model').send(this.get('text'));
			this.set('text', '');
		},

		addEmot: function(emot)
		{
			this.set('text', this.get('text') + ':' + emot + ':');
			$('#sender').focus();
		}
	}
});

C.LogoutRoute = Em.Route.extend({
	redirect: function()
	{
		var router = this;
		$.post('/user/logout', function()
			{
				C.User.set('loggedIn', false);
				C.User.set('name', null);
				C.User.set('activeRoom', 0);
				
				router.transitionTo('start');
			});
	}
});