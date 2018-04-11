const replyService = require('../services/service');

module.exports = async(job) => {

  const {
    body,
    workflow: {
      data: wfData
    }
  } = job.data;

  checkData(wfData, body);

  const sendData = {
    campaignId: wfData.campaign_id,
    email: body.email
	};

  const peopleData = {
    email: body.email
	};

  if(body.source){
    sendData.source = body.source;
  }

  if(body.link) {
    sendData.link = body.link
  }

  if(wfData.mapping) {
    Object.keys(wfData.mapping).map((val) => {
      if(val !== 'custom_fields') {
        peopleData[val] = body[wfData.mapping[val]];
      }
    });

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
  }

  try {
    job.progress(10);

    await replyService.api(wfData.api_key).send('GET', `/v1/people?email=${encodeURIComponent(body.email)}`);
    job.progress(32);

    await replyService.api(wfData.api_key).send('POST', '/v1/actions/removepersonfromallcampaigns', sendData);
    job.progress(54);

    await replyService.api(wfData.api_key).send('POST', '/v1/people', peopleData);
    job.progress(76);

    await replyService.api(wfData.api_key).send('POST', '/v1/actions/pushtocampaign', sendData);
    job.progress(100);

  } catch(err) {
    if(err.statusCode === 404) {
      job.progress(50);

      await replyService.api(wfData.api_key).send('POST', '/v1/actions/addandpushtocampaign', Object.assign(sendData, peopleData));
      job.progress(100);

    } else {
      throw err;
    }
  }
};

function checkData(wfData, body) {
  if(!wfData || !wfData.api_key) {
    throw new Error('Missing data api_key');
  }

  if(!wfData || !wfData.campaign_id) {
    throw new Error('Missing data campaign_id');
  }

  if(!body || !body.email) {
    throw new Error('Missing email in body');
  }
}