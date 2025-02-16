import {Banner, Button, Card, Space, Toast, Typography} from "@douyinfe/semi-ui";
import {send_notify, sendSystemToast} from "../../code/SystemToast.jsx";
import {clear_log} from "../../code/log.js";
import {clearLocalStorage, getSettings, setSettings} from "../../code/Settings.js";
import {v4 as uuidv4} from 'uuid';

function BetaFunctionalityPage() {
    const {Text} = Typography;
    const testStoast=()=>{
        var result= sendSystemToast('Hi','This is SystemNotify')
        if (result){
            Toast.info('Done')
        }else{
            Toast.warning('Error')
        }
    }
    return (
        <>
            <Banner
                fullMode={false}
                type="danger"
                bordered
                icon={null}
                closeIcon={null}
                title={<div style={{fontWeight: 600, fontSize: '14px', lineHeight: '20px'}}>⚠ Warning</div>}
                description={
                    <Text>
                        You are now on the Developer Testing Page. All features on this page are for testing purposes only.
                        If you entered here by mistake, you can safely close this page now.
                        However, if you choose to continue, please note: <b>actions here are irreversible</b>,
                        <b>no confirmation will be asked</b>, and <b>no feedback will be provided</b>.
                        Some actions may result in <b>data being completely cleared!!!</b>
                    </Text>
                }
            />
            <br/>
            <Card title={"System Notify"}>
               <Space vertical={true}>
                   <Button onClick={()=>{send_notify('Hi','This is Nomal Notify Without color',null,3,'info')}}>Send Nomal Notify</Button>
                   <Button onClick={()=>{send_notify('Hi','This is Notify With Light color',null,3,'error',true,'light')}}>Send Light Notify</Button>
                   <Button onClick={testStoast}>Send System Notify</Button>
               </Space>
            </Card>
            <br/>
            <Card title={"log operation"}>
                <Button onClick={clear_log}>Clear ALL Logs</Button>
            </Card>
            <br/>
            <Card title={"Data Storage"}>
                <Button onClick={clearLocalStorage}>Clear ALL Data</Button>
            </Card>
            <br/>
            <Card title={"UUID"}>
                <Text>
                    Your UUID is {getSettings('uuid')}
                </Text>
                <Button onClick={()=>{const uuid = uuidv4();setSettings("uuid",uuid);}}>New UUID</Button>
            </Card>
        </>
    )
}
export default BetaFunctionalityPage;