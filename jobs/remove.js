const replyService = require('../services/service');

module.exports = async(job) => {

	const {
		body,
		workflow: {
			data: wfData
		}
	} = job.data;

	if(!wfData || !wfData.api_key) {
		throw new Error('Missing data api_key');
	}

	if(!body || !body.email) {
		throw new Error('Missing email in body');
	}

	const people = await replyService.api(wfData.api_key).send('GET', `/v1/people?email=${encodeURIComponent(body.email)}`);
	job.progress(50);

	await replyService.api(wfData.api_key).send('DELETE', `/people/${people.id}`);
	job.progress(100);
};