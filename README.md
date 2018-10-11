# Workflow Reply

##### Reply Wrapper for [bull-workflow-manager](https://github.com/eoko/bull-workflow-manager)

### Campaign

* **Add** ($wf-reply/campaign/add)

*Add people to one campaign*

  - Workflow data : 
    - api_key (Reply API Key)
    - campaign_id (Id of Reply Campaign)
  - Post data : 
    - email (Email of member) or reply_id (Id of Reply member)

* **Remove** ($wf-reply/campaign/remove)
  
*Remove people from one campaign*

  - Workflow data : 
    - api_key (Reply API Key)
    - campaign_id (Id of Reply Campaign)
  - Post data : 
    - email (Email of member) or reply_id (Id of Reply member)
    
* **Remove All** ($wf-reply/campaign/removeAll)
  
*Remove people from all campaign*

  - Workflow data : 
    - api_key (Reply API Key)
  - Post data : 
    - email (Email of member) or reply_id (Id of Reply member)