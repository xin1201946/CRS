import {useEffect, useState} from "react";
import './resultpage_css.css'
import {Step1} from "./Step1.jsx";
import {HomePage} from "./HomePage.jsx";
import {Console} from "./Console.jsx"
import {on,off} from "../../code/PageEventEmitter.js";

export function ResultPage(){

    const [page, setPage] = useState('home');

    useEffect(() => {
        const handleChangePage = (newPage) => {
            setPage(newPage);
        };

        on('changePage', handleChangePage);

        return () => {
            off('changePage', handleChangePage);
        };

    }, []);

    return (
        <>
            <div id={'container'}>
                <div id={'returnpage'}>
                    {page === 'home' ? <HomePage/> : page === 'console' ? <Console/> : <Step1/>}
                </div>
            </div>
        </>
    )
}