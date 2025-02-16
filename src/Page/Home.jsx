import {ResultPage} from "./home_Page/ResultPage.jsx";
import {setSettings} from "../code/Settings.js";

setSettings('buile_time', document.querySelector('#build-time').content.toString(),true)
function HomePage(){

    return(
        <>
            <div id={'HomePage'}>
                <ResultPage></ResultPage>
            </div>
        </>
    )
}

export default HomePage