const replyService = require('../services/service');

module.exports = async(job) => {

	const {
		body,
		workflow: {
			data: wfData
		}
	} = job.data;

	let sendData = {};
	if(!wfData || !wfData.api_key) {
		throw new Error('Missing data api_key');
	}

	if(!wfData || !wfData.campaign_id) {
		throw new Error('Missing data campaign_id');
	}
	sendData.campaignId = wfData.campaign_id;
	if(!body || !body.email) {
		throw new Error('Missing email in body');
	}
	sendData.email = body.email;
	sendData.firstname = body.email;
	if(body.source){
		sendData.source = body.source;
	}
	if(body.link) {
		sendData.link = body.link
	}
	if(wfData.mapping.custom_fields) {
		sendData.customFields = [];
		wfData.mapping.custom_fields.forEach(function (element) {
			let keyReply = element.key;
			let variable = element.value;
			if(body[variable]) {
				sendData.customFields.push({key: keyReply, value: body[variable]});
			}
		});
	}
	try {
		job.progress(10);
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
			job.progress(50);
			await replyService.api(wfData.api_key).send('POST', '/v1/actions/addandpushtocampaign', sendData);
			job.progress(100);

        } else {
			throw err;
		}
	}
};