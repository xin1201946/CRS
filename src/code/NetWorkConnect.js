import {add_log} from "./log.js";

export default async function checkNetwork(serverIP) {
   let result;
   try {
       const response = await fetch("http://"+serverIP+'/test');
       result = (response.status === 200);
       add_log('checkServerConnect','successfully',(response.status === 200).toString());
       // eslint-disable-next-line no-unused-vars
   } catch (error) {
       add_log('checkServerConnect','error','Server not found');
       result = false;
   }
   return result;
}