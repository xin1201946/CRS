import './App.css'
import initializeSettings from './code/QuickLoadingService.js'

// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef } from 'react';
import {Header1} from './Header/Header.jsx'
import {HomePage} from "./Page/Home.jsx";

const mql = window.matchMedia('(prefers-color-scheme: dark)');

function matchMode(e) {

   const body = document.body;
   if (e.matches) {
       if (!body.hasAttribute('theme-mode')) {
           body.setAttribute('theme-mode', 'dark');
       }
   } else {
       if (body.hasAttribute('theme-mode')) {
           body.removeAttribute('theme-mode');
       }
   }
}

    // 使用 addEventListener 替代 addListener
mql.addEventListener('change', matchMode);
function App()
{
    initializeSettings()
    React.useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const body = document.body;
        if (mql.matches) {
       if (!body.hasAttribute('theme-mode')) {
           body.setAttribute('theme-mode', 'dark');
       }
   } else {
            if (body.hasAttribute('theme-mode')) {
               body.removeAttribute('theme-mode');
            }
        }
    }, []);
    return (
        <>
            <Header1></Header1>
            <HomePage></HomePage>
        </>
    );
}

export default App