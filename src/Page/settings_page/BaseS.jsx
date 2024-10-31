import {OldBaseSettingsPage} from "./OldBaseSettings.jsx";
import {NewBaseSettingsPage} from "./NewBaseSettings.jsx";
import {getSettings} from "../../code/Settings.js";

export default function BaseSPage(){
    function check_settings(){
        if(getSettings('new_settings_page') === 'true'){
            return(
                <NewBaseSettingsPage/>
            )
        }else{
            return(
                <OldBaseSettingsPage/>
            )
        }
    }
    return(
        <>
            {check_settings()}
        </>
    )
}