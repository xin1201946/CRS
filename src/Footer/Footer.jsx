import './footer.css'
import React, {useState} from "react";
export function FooterPage() {
    const [HWString, setHWString] = useState("");
    const [HWOString, setHWOString] = useState("");
    React.useEffect(() => {
        setHWString('' );
        setHWOString('');
    }, []);

    return (
        <>
            {HWString && (
                <p id="footerP">{HWString}</p>
            )}
            {HWOString && (
                <p id="footerP" style={{ fontFamily: 'var(--Default-font)' }}>
                    {HWOString}
                </p>
            )}
        </>
    )
}