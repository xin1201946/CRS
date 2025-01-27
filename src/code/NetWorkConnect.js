import {add_log} from "./log.js";
import {getAPI} from "./server_api_settings.js";
import {getSettings} from "./Settings.js";

export default async function checkNetwork(serverIP=getSettings('server_ip')) {
   let result;
   try {
       const response = await fetch(serverIP+getAPI('test'));
       result = (response.status === 200);
       add_log('checkServerConnect','successfully',(response.status === 200).toString());
       // eslint-disable-next-line no-unused-vars
   } catch (error) {
       add_log('checkServerConnect','error','Server not found');
       result = false;
   }
   return result;
}