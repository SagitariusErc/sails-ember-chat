/**
 * UserController
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
	me: function(req, res)
	{
		if (req.session.user)
		{
			console.log(req.session.user);
			return res.json(req.session.user);
		}
		else
			return res.json( { loggedIn: false } );
	},

	login: function(req, res)
	{
		req.session.user = { name: req.param('name'), loggedIn: true, lastRoom: 0 };
		return res.json(req.session.user);
	},

	logout: function(req, res)
	{
		req.session.destroy();
		return res.json({});
	}

};
