import {ResultPage} from "./home_Page/ResultPage.jsx";
import {setSettings} from "../code/Settings.js";
import { log } from '../frameClass/prettyLog.ts';
// import {luoXHP} from "../EasterEgg/luoXH.js"
// import {logop} from "../EasterEgg/logo.js"
setSettings('buile_time', document.querySelector('#build-time').content.toString(),true)
export  function HomePage(){

    // logop()
    log.info('JOEY DREW STUDIOS', 'Every great story begins in mystery. Although things may be dark at the start, the truth will illuminate your way. Don\'t be afraid of who you are. Fear only what you may become, and banish it away.');
    return(
        <>
            <div id={'HomePage'}>
                <ResultPage></ResultPage>
            </div>
        </>
    )
}