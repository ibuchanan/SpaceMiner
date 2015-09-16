/*
if (Meteor.isServer) {
	let path = Npm.require('path');
	global.smPath = {
		clientPath(relativePath) {
			return path.resolve('../web.browser/app/' + relativePath);
		}
	};
} else {
	global.smPath = { clientPath: function() { return ''; } };
}
*/