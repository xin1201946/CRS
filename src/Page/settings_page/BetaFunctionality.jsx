import {Banner, Button, Toast, Typography} from "@douyinfe/semi-ui";
import {sendSystemToast} from "../../code/SystemToast.js";

export function BetaFunctionalityPage() {
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
            <Banner fullMode={false} type="danger" bordered icon={null} closeIcon={null}
                    title={<div style={{ fontWeight: 600, fontSize: '14px', lineHeight: '20px' }}>⚠ Warning</div>}
                    description={<Text>You have entered the Functional Testing Page area. If you entered by mistake, please close this page immediately and your system settings will remain unchanged. If you choose to continue, please note that <b>any action may result in data loss. </b> </Text>}
            /><br/>
            <Button onClick={testStoast}>Send System Notify</Button>
        </>
    )
}