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

	if(!wfData || !wfData.campaign_id) {
		throw new Error('Missing data campaign_id');
	}

	if(!body || !body.email) {
		throw new Error('Missing email in body');
	}

	try {
		await replyService.api(wfData.api_key).send('GET', `/v1/people?email=${encodeURIComponent(body.email)}`);
		job.progress(35);

		await replyService.api(wfData.api_key).send('POST', '/v1/actions/removepersonfromallcampaigns', {
			'email': body.email
		});
		job.progress(75);

		await replyService.api(wfData.api_key).send('POST', '/v1/actions/pushtocampaign', {
			'campaignId': wfData.campaign_id,
			'email': body.email,
		});
		job.progress(100);

	} catch(err) {
		if(err.statusCode === 404) {
			await replyService.api(wfData.api_key).send('POST', '/v1/actions/addandpushtocampaign', {
				'campaignId': wfData.campaign_id,
				'email': body.email,
				'firstName': body.email,
			});
			job.progress(100);
		} else {
			throw err;
		}
	}
};