const request = require('request-promise-native');

module.exports.api = (apikey) => {
	return endpointReply(apikey);
};

/**
 * @param apiKey
 * @returns {{send: (function(*=, *=, *=))}}
 */
const endpointReply = (apiKey) => {
	return {
		send: (method, endpoint, params) => {
			return sendRequest(method, endpoint, params, apiKey);
		}
	};
};

/**
 * Send request to reply
 * @param method
 * @param endpoint
 * @param params
 * @param apiKey
 * @returns {*}
 */
function sendRequest(method, endpoint, params, apiKey) {
	if (apiKey === null || apiKey === undefined) {
		throw new Error('Missing api key');
	}

	const options = {
		uri: `https://api.reply.io${endpoint}`,
		port: 443,
		method: method,
		pathname: '',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Api-Key': apiKey
		}
	};

	if (options.method === 'GET') {
		options['qs'] = params;
	} else {
		options['body'] = JSON.stringify(params);
	}

	return request(options).then((data) => {
		if (data) {
			return JSON.parse(data);
		} else {
			return null;
		}
	});
}