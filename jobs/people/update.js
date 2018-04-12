const replyService = require('../../services/service');
const get = require('lodash.get');

module.exports = async(job) => {

  const {
    body,
    workflow: {
      data: wfData
    }
  } = job.data;

  checkData(wfData, body);

  const peopleData = {
    email: body.email
  };

  if(body.source){
    peopleData.source = body.source;
  }

  if(body.link) {
    peopleData.link = body.link
  }

  if(wfData.mapping) {
    Object.keys(wfData.mapping).map((val) => {
      if(val !== 'custom_fields') {
        peopleData[val] = get(body, wfData.mapping[val], '');
      }
    });

    if(wfData.mapping.custom_fields) {
      peopleData.customFields = [];
      wfData.mapping.custom_fields.forEach(function (element) {
        let keyReply = element.key;
        let variable = element.value;
        if(body[variable]) {
          peopleData.customFields.push({key: keyReply, value: body[variable]});
        }
      });
    }
  }

  job.progress(30);

  await replyService.api(wfData.api_key).send('GET', `/v1/people?email=${encodeURIComponent(body.email)}`);
  job.progress(60);

  await replyService.api(wfData.api_key).send('POST', '/v1/people', peopleData);
  job.progress(100);
};

function checkData(wfData, body) {
  if(!wfData || !wfData.api_key) {
    throw new Error('Missing data api_key');
  }

  if(!body || !body.email) {
    throw new Error('Missing email in body');
  }
}