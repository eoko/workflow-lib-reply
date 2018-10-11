const replyService = require('../../services/service');

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
		throw new Error('Missing data campaign id');
	}

	if(!body) {
		throw new Error('Missing body');
	}

	let people = null;

	if (body.reply_id) {
		people = await replyService.api(wfData.api_key).send('GET', `/v1/people?id=${body.reply_id}`);
	} else if(body.email) {
		people = await replyService.api(wfData.api_key).send('GET', `/v1/people?email=${encodeURIComponent(body.email)}`);
	} else {
		throw new Error('Missing email or reply_id');
	}

	job.progress(50);

	await replyService.api(wfData.api_key).send('POST', `/v1/actions/removepersonfromcampaignbyid`, {
		campaignId: parseInt(wfData.campaign_id, 10),
		email: people.email,
	});
	job.progress(100);
};