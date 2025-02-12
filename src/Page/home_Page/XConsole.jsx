"use client";

import { useRef, useEffect } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";

// eslint-disable-next-line react/prop-types
const Terminal = ({ onCommand, prompt = ">", promptInfo = () => "", initialMessage = "Welcome to the terminal!" }) => {
    const terminalRef = useRef(null);
    const terminal = useRef(null);
    const currentLine = useRef("");  // 使用 ref 来存储当前命令行
    const commandHistory = useRef([]);  // 使用 ref 来存储历史命令
    const historyIndex = useRef(-1);  // 使用 ref 来管理历史命令索引

    useEffect(() => {
        if (terminalRef.current) {
            const term = new XTerm({
                cursorBlink: true,
                fontSize: 14,
                fontFamily: 'Consolas, "Courier New", monospace',
                theme: {
                    background: "#1e1e1e",
                    foreground: "#d4d4d4",
                    cursor: "#ffffff",
                },
                allowTransparency: true,
            });

            const fitAddon = new FitAddon();
            const webLinksAddon = new WebLinksAddon();

            term.loadAddon(fitAddon);
            term.loadAddon(webLinksAddon);

            term.open(terminalRef.current);
            fitAddon.fit();

            terminal.current = term;

            const lines = initialMessage.split('\n');
            lines.forEach(line => term.writeln(line));

            writePrompt(term);

            const handleResize = () => fitAddon.fit();
            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
                term.dispose();
            };
        }
    }, [initialMessage]);

    useEffect(() => {
        const term = terminal.current;
        if (term) {
            term.onKey(({ key, domEvent }) => handleKeyPress(key, domEvent, term));
        }
    }, []);

    const handleKeyPress = (key, domEvent, term) => {
        const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

        if (domEvent.keyCode === 13) {
            // Enter key
            term.write("\r\n");
            commandHistory.current.push(currentLine.current);
            historyIndex.current = commandHistory.current.length - 1;  // Update history index
            handleCommand(currentLine.current);
            currentLine.current = "";
        } else if (domEvent.keyCode === 8) {
            // Backspace
            if (currentLine.current.length > 0) {
                term.write("\b \b");
                currentLine.current = currentLine.current.slice(0, -1);
            }
        } else if (domEvent.keyCode === 38) {
            // Up arrow key
            if (historyIndex.current > 0) {
                historyIndex.current--;
                currentLine.current = commandHistory.current[historyIndex.current];
                term.write("\r");
                term.write(currentLine.current);
            }
        } else if (domEvent.keyCode === 40) {
            // Down arrow key
            if (historyIndex.current < commandHistory.current.length - 1) {
                historyIndex.current++;
                currentLine.current = commandHistory.current[historyIndex.current];
                term.write("\r");
                term.write(currentLine.current);
            } else if (historyIndex.current === commandHistory.current.length - 1) {
                currentLine.current = "";
                term.write("\r");
            }
        } else if (domEvent.keyCode === 37 || domEvent.keyCode === 39) {
            // Left or right arrow key - Do nothing (disable)
            domEvent.preventDefault();
        } else if (printable) {
            term.write(key);
            currentLine.current += key;
        }
    };

    const writePrompt = (term) => {
        const info = promptInfo();
        if (info) term.write(info);
        term.write(prompt + " ");
    };

    const handleCommand = async (command) => {
        const term = terminal.current;
        if (term) {
            try {
                const result = await onCommand(command);
                if (Array.isArray(result)) {
                    result.forEach(line => term.writeln(line));
                } else {
                    term.writeln(result);
                }
                writePrompt(term);
            } catch (error) {
                term.writeln(`Error: ${error}`);
                writePrompt(term);
            }
        }
    };

    return (
        <div
            ref={terminalRef}
            style={{
                fontFamily: "Consolas, monospace",
                textAlign: "left",
                height: "400px",
                width: "100%",
                padding: "1rem",
                backgroundColor: "#1e1e1e",
                borderRadius: "8px",
            }}
        />
    );
};

export default Terminal;
