// @ts-ignore
import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';   
import { Command, TerminalMessage } from './termianlInterface';
import { useTerminalStore } from './TerminalStore';
// @ts-ignore
import Convert from 'ansi-to-html';

const convert = new Convert();

interface TerminalProps {
  commands: Command[];
  initScript?: string[];
  onExecCmd: (key: string, command: string, success: (result?: TerminalMessage) => void, failed: (message: string) => void, pipeInput?: string) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ commands, initScript, onExecCmd }) => {
  const [input, setInput] = useState('');
  const [waitingForInput, setWaitingForInput] = useState(false);
  const { messages, context, customContext, addMessage, setInitializing } = useTerminalStore();
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initRef = useRef(false);
  const [lastCommandResult, setLastCommandResult] = useState<string | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const updateSuggestions = (value: string) => {
    if (!value) {
      setSuggestions([]);
      return;
    }
    const matchingCommands = commands
        .map(cmd => cmd.key)
        .filter(key => key.startsWith(value.toLowerCase()))
        .sort();
    setSuggestions(matchingCommands);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    updateSuggestions(value.split(' ')[0]); // Only suggest for the first word
    setHistoryIndex(-1); // Reset history index when typing
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInput(suggestions[0]); // Complete with first suggestion
        setSuggestions([]); // Clear suggestions after completion
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
          setSuggestions([]); // Clear suggestions when browsing history
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const executeCommand = async (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    // Add command to history
    setCommandHistory(prev => [...prev, trimmedCommand]);
    setHistoryIndex(-1);
    setSuggestions([]);

    // Split commands by pipe
    const pipeCommands = trimmedCommand.split('|').map(cmd => cmd.trim());
    let pipeInput: string | null = null;

    for (const cmd of pipeCommands) {
      const [cmdName, ...args] = cmd.split(' ');

      if (cmdName === 'help') {
        if (args.length > 0) {
          const commandHelp = commands.find(c => c.key === args[0]);
          if (commandHelp) {
            addMessage({
              type: 'normal',
              class: 'info',
              content: `Command: ${commandHelp.key}
              Usage: ${commandHelp.usage}
              Description: ${commandHelp.command_description || commandHelp.description}
              ${commandHelp.example ? '\nExamples:\n' + commandHelp.example.map(e => `  ${e.cmd} - ${e.des}`).join('\n') : ''}`
            });
          } else {
            addMessage({
              type: 'normal',
              class: 'error',
              content: `Command "${args[0]}" not found. Type 'help' to see available commands.`
            });
          }
        } else {
          addMessage({
            type: 'table',
            content: {
              head: ['Command', 'Usage', 'Description', 'Group'],
              rows: commands.map(cmd => [
                cmd.key,
                cmd.usage,
                cmd.description,
                cmd.group
              ])
            }
          });
        }
        continue;
      }

      const commandObj = commands.find(c => c.key === cmdName);
      if (!commandObj) {
        addMessage({
          type: 'normal',
          class: 'error',
          content: `Command not found: '${cmdName}'. Type 'help' to see available commands.`
        });
        return;
      }

      await new Promise<void>((resolve) => {
        onExecCmd(
            commandObj.key,
            cmd,
            (result) => {
              if (result) {
                if (result.type === 'input') {
                  setWaitingForInput(true);
                  addMessage(result);
                } else {
                  addMessage(result);
                  if (typeof result.content === 'string') {
                    pipeInput = result.content;
                    setLastCommandResult(result.content);
                  }
                }
              }
              resolve();
            },
            (error) => {
              addMessage({
                type: 'normal',
                class: 'error',
                content: error
              });
              resolve();
            },
            pipeInput
        );
      });
    }
  };

  const handleCommand = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedInput = input.trim();

      if (!trimmedInput) {
        addMessage({ type: 'normal', content: '' });
        setInput('');
        return;
      }

      addMessage({ type: 'normal', content: `${context} $ ${trimmedInput}` });

      if (waitingForInput) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.onInput) {
          lastMessage.onInput(trimmedInput);
          setWaitingForInput(false);
        }
      } else {
        // Handle multiple commands
        const commands = trimmedInput.split('&&').map(cmd => cmd.trim());
        for (const cmd of commands) {
          await executeCommand(cmd);
        }
      }

      setInput('');
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const runInitScript = async () => {
      if (initScript && !initRef.current) {
        initRef.current = true;
        setInitializing(true);
        for (const cmd of initScript) {
          await executeCommand(cmd);
        }
        setInitializing(false);
      }
    };

    runInitScript();
  }, [initScript]);


  const renderMessage = (msg: TerminalMessage) => {
    const className = msg.class ? `text-${msg.class}` : '';

    switch (msg.type) {
      case 'json':
        return (
          <pre className={`${className} whitespace-pre-wrap`}>
            {JSON.stringify(msg.content, null, 2)}
          </pre>
        );
      case 'code':
        return (
          <pre className={`${className} bg-base-300 p-4 rounded`}>
            {msg.content}
          </pre>
        );
      case 'table':
        const { head, rows } = msg.content;
        return (
          <div className="overflow-x-auto">
            <table className="semi-table " style={{padding:"10px", width: "100%"}}>
              <thead className="semi-table-header">
                <tr >
                  {head.map((h: string, i: number) => (
                    <th style={{color:"--semi-color-tertiary"}} key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row: string[], i: number) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'input':
        return (
          <div className={className}>
            {msg.inputPrompt && <div className="mb-2">{msg.inputPrompt}</div>}
            <div className="text-info">Waiting for input...</div>
          </div>
        );
      case 'html':
        return (
          <div 
            dangerouslySetInnerHTML={{ 
              __html: convert.toHtml(msg.content) 
            }} 
          />
        );
      default:
        return (
          <div className={className}>
            {msg.tag && <span className="badge badge-sm mr-2">{msg.tag}</span>}
            {msg.content}
          </div>
        );
    }
  };

  return (
    <div className="card h-full flex flex-col" style={{textAlign: 'left',backgroundColor: 'var(--semi-color-bg-0)',userSelect: 'auto'}}>
      <div className="card-body p-0 flex flex-col h-full">
        <div className="p-2 flex items-center gap-2 rounded-t-xl flex-shrink-0">
            <TerminalIcon size={18} />
            <span className="font-mono text-sm">CCRS Terminal</span>
        </div>

        <div
              ref={terminalRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-sm"
              style={{ height: '100%', overflowY: 'auto', userSelect: 'text', cursor: 'default' }}
        >
            {messages.map((msg, idx) => (
                <div key={idx} className="mb-2">
                  {renderMessage(msg)}
                </div>
            ))}

          <div className="relative">
            <div className="flex items-center gap-2">
              {customContext || <span className="text-primary">{context} $</span>}
              <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    handleKeyDown(e);
                    handleCommand(e);
                  }}
                  className="flex-1 bg-transparent border-none outline-none"
                  autoFocus
              />
            </div>
            {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 z-10">
                  <div className="text-base-content opacity-50 bg-base-200 p-2 rounded shadow-lg">
                    {suggestions.join('  ')}
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};