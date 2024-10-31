export default async function checkNetwork(serverIP) {
   let result;
   try {
       const response = await fetch("http://"+serverIP+'/test');
       result = (response.status === 200);
       // eslint-disable-next-line no-unused-vars
   } catch (error) {
       result = false;
   }
   return result;
}