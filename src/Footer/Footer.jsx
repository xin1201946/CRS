import './footer.css'
import React, {useState} from "react";
import {isHalloweenPeriod} from "../code/is_wsj.js";
import {getSettings} from "../code/Settings.js";
import {changeFont} from "../Theme/style-font.js"
export  function FooterPage() {
    const [HWString, setHWString] = useState('');
    const [HWOString, setHWOString] = useState('');
    React.useEffect(() => {
    const isHalloween = isHalloweenPeriod();
    if(isHalloween && (getSettings('is_wsj') ==='true')){
        setHWString('Halloween Theme' );
        setHWOString('Trick or treat');
        changeFont('HalloweenEN');
    }
    }, []);
    return(
        <>
            <p id={'footerP'}>
                {HWString}
            </p>
            <p id={'footerP'} style={{fontFamily:"var(--Default-font)"}} >
                {HWOString}
            </p>
        </>
    )
}