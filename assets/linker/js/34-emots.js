var alternates = {
	':D': 'haha',
	':-D': 'haha',
	':))': 'haha',
	':)': 'smile',
	':-)': 'smile',
	':*': 'kiss',
	':-*': 'kiss',
	':o': 'oh',
	':O': 'oh',
	':-O': 'oh',
	'o_0': 'oh',
	'o_O': 'oh',
	':((': 'cry',
	':\'(': 'cry',
	':(': 'sad',
	':-(': 'sad',
}

function alternate(str)
{
	var str;
	$.each(alternates, function(i, e)
	{
		str = str.replace(i, ':' + e + ':');
	});
	return str;
}

function emot(str)
{
	str = alternate(str);

	var fin = str.replace(/:\w*:/gi, function(match)
	{
		return new Handlebars.SafeString('<i title="' + match + '" class="emot emot-' + match.replace(/:/gi, '') + '"></i>');
	});

	return fin;
}

var emots = [
	'adore',
	'afterboom',
	'ah',
	'amazed',
	'amazing',
	'anger',
	'angry',
	'badegg',
	'badsmelly',
	'badsmile',
	'baffle',
	'beatbrick',
	'beated',
	'beaten',
	'beatplaster',
	'beatshot',
	'beauty',
	'bigsmile',
	'bigsmile2',
	'blackheart',
	'boss',
	'burnjossstick',
	'byebye',
	'canny',
	'choler',
	'cold',
	'confident',
	'confuse',
	'cool',
	'cry',
	'cry2',
	'doubt',
	'dribble',
	'electricshock',
	'embarrassed',
	'exciting',
	'extremesexygirl',
	'eyesdroped',
	'feelgood',
	'girl',
	'go',
	'greedy',
	'grimace',
	'haha',
	'haha2',
	'happy',
	'hellboy',
	'horror',
	'hungry',
	'lookdown',
	'matrix',
	'misdoubt',
	'money',
	'nosebleed',
	'nothing',
	'nothingtosay',
	'oh',
	'ops',
	'pudency',
	'rap',
	'redheart',
	'sad',
	'scorn',
	'secretsmile',
	'sexygirl',
	'shame',
	'shame2',
	'shocked',
	'smile',
	'spiderman',
	'stilldreaming',
	'superman',
	'sure',
	'surrender',
	'sweat',
	'kiss',
	'ironman',
	'tire',
	'toosad',
	'unhappy',
	'victory',
	'waaaht',
	'what',
	'what2'
];