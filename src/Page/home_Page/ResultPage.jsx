import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import "./resultpage_css.css"
import { Step1 } from "./Step1.jsx"
import { HomePage } from "./HomePage.jsx"
import { Console } from "./Console.jsx"
import { on, off } from "../../code/PageEventEmitter.js"
import { getSettings, setSettings } from "../../code/Settings.js"
import Chrome_ai_page from "../Chrome_ai_page.jsx"

export function ResultPage() {
    const [page, setPage] = useState("home")

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        setSettings("server_ip", urlParams.get("serverip") || getSettings("server_ip"))

        const handleChangePage = (newPage) => {
            setPage(newPage)
        }

        on("changePage", handleChangePage)

        return () => {
            off("changePage", handleChangePage)
        }
    }, [])

    const pageVariants = {
        initial: { opacity: 0, x: -20 },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: 20 },
    }

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.3,
    }

    const renderPage = () => {
        switch (page) {
            case "home":
                return <HomePage />
            case "console":
                return <Console />
            case "vision":
                return <Step1 />
            default:
                return <Chrome_ai_page />
        }
    }

    return (
        <div id={"container"}>
            <div id={"returnpage"} style={{ height: "100%" }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={page}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        style={{ height: "100%" }}
                    >
                        {renderPage()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

