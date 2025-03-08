// @ts-ignore
import React from 'react';
import { Terminal } from './Terminal/Terminal';
import { Command } from './Terminal/termianlInterface';
import { useTerminalStore } from './Terminal/TerminalStore';
import {getSettings} from '../../code/Settings'

const commands: Command[] = [
  {
    key: "info",
    group: "system",
    usage: "info",
    description: "Show Terminal information",
  },
  {
    key: "help",
    group: "system",
    usage: "help [command]",
    description: "Show available commands or help for a specific command",
    command_description: "Display help information for commands.\nUsage:\n  help - Show all available commands\n  help <command> - Show detailed help for a specific command"
  },
  {
    key:"echo",
    group:"system",
    usage:"echo [something text]",
    description: "Display help information for echo "
  },
  {
    key:"sqLite",
    group:"server",
    usage:"sqLite",
    description: "You can enter SQL statements only when you enter the sqLite end point. After entering, enter --help to view the supported commands.",
  },
  {
    key:"sl",
    group:"server",
    usage:"sl <command>",
    description: "This is for entering SQL commands.",
  },
  {
    key:"exit",
    group:"server",
    usage:"exit",
    description: "exit sql command.",
  },
  {
    key:"blacklist",
    group:"server",
    usage:"blacklist [command]",
    description:"SQL commands that control users are prohibited.\nEnter blackList --help to view blacklist help."
  },
  // {
  //   key: "greet",
  //   group: "program",
  //   usage: "greet",
  //   description: "Start the greeting program",
  //   command_description: "Interactive greeting program that asks for your name and displays a welcome message."
  // },
  // {
  //   key: "fail",
  //   group: "demo",
  //   usage: "fail",
  //   description: "Simulate error result",
  //   command_description: "This command simulates a failure scenario and returns an error message."
  // },
  // {
  //   key: "json",
  //   group: "demo",
  //   usage: "json",
  //   description: "Display JSON result",
  //   command_description: "Shows a sample JSON output with different data types and nested structures."
  // },
  // {
  //   key: "code",
  //   group: "demo",
  //   usage: "code",
  //   description: "Display code result",
  //   command_description: "Displays a code snippet with syntax highlighting."
  // },
  // {
  //   key: "table",
  //   group: "demo",
  //   usage: "table",
  //   description: "Display table result",
  //   command_description: "Shows data in a formatted table structure."
  // },
  // {
  //   key: "html",
  //   group: "demo",
  //   usage: "html",
  //   description: "Display custom HTML result",
  //   command_description: "Renders custom HTML content with ANSI color support."
  // },
  {
    key: "ask",
    group: "system",
    usage: "ask <prompt>",
    description: "Ask for user input",
    command_description: "Prompts the user for input and returns the entered value.",
    example: [
      {
        cmd: "ask What is your name?",
        des: "Prompts for the user's name"
      }
    ]
  },
  {
    key: "set",
    group: "system",
    usage: "set <name> <value>",
    description: "Set a variable value",
    command_description: "Creates or updates a variable with the specified value.",
    example: [
      {
        cmd: "set name John",
        des: "Sets the 'name' variable to 'John'"
      }
    ]
  },
  {
    key: "get",
    group: "system",
    usage: "get <name>",
    description: "Get a variable value",
    command_description: "Retrieves the value of a stored variable.",
    example: [
      {
        cmd: "get name",
        des: "Gets the value of the 'name' variable"
      }
    ]
  },
  {
    key: "context",
    group: "system",
    usage: "context <ctx>",
    description: "Change context",
    command_description: "Changes the terminal context/prompt path.",
    example: [
      {
        cmd: "context /react/terminal/dev",
        des: "Change context to '/react/terminal/dev'"
      }
    ]
  },
  {
    key:"open",
    group:"bash",
    usage:"open <url>",
    description:"Create a new window and open the URL"
  }
];

function WebTerminal({sendCommand}) {
  const { setContext, setVariable, getVariable, addMessage } = useTerminalStore();
  // 定义初始化脚本
  const initScript = [
    "info",
    "exit"
  ];
  // Function to expand variables in a string
  const expandVariables = (text: string): string => {
    return text.replace(/\$(\w+)/g, (match, varName) => {
      const value = getVariable(varName);
      return value !== undefined ? value : match;
    });
  };
  const handleExecCmd = async (
      key: string,
      command: string,
      success: Function,
      failed: Function,
      pipeInput?: string // Add parameter for piped input
  ) => {
    command = expandVariables(command);
    if (key === "sqLite") {
      success({
        type:"normal",
        content: await sendCommand('sql')
      })
    } else if (key.startsWith("sl")) {
      const prompt = command.substring(3);
      success({
        type:"normal",
        content: await sendCommand(prompt)
      })
    }else if (key === "exit") {
      success({
        type:"normal",
        class: "info",
        content: await sendCommand(key)
      })
    } else if (key.startsWith("blacklist")) {
      success({
        type:"normal",
        class: "info",
        content: await sendCommand(command)
      })
    } else if (key.startsWith("echo")) {
      const text = command.substring(5) || pipeInput || '';
      success({
        type: "normal",
        class: "info",
        content: text.trim()
      });
    } else if (key === "json") {
      success({
        type: "json",
        class: "success",
        content: {
          k1: "welcome to react-web-terminal",
          k2: 120,
          k3: ["h", "e", "l", "l", "o"],
          k4: {k41: 2, k42: "200"},
        },
      });
    } else if (key === "context") {
      const newContext = command.split(" ")[1];
      if (!newContext) {
        failed("Usage: context <path>");
        return;
      }
      setContext(newContext);
      success({
        type: "normal",
        class: "success",
        content: "Context updated successfully",
      });
    }  else if (key === "ask") {
      const prompt = command.substring(4) || pipeInput;
      if (!prompt?.trim()) {
        failed("Usage: ask <prompt>");
        return;
      }
      success({
        type: "input",
        class: "info",
        inputPrompt: prompt,
        onInput: (value: string) => {
          addMessage({
            type: "normal",
            class: "success",
            content: `Input received: ${value}`
          });
        }
      });
    } else if (key === "set") {
      const [, name, ...valueParts] = command.split(" ");
      const value = valueParts.join(" ") || pipeInput;
      if (!name || !value) {
        failed("Usage: set <name> <value>");
        return;
      }
      setVariable(name, value);
      success({
        type: "normal",
        class: "success",
        content: `Variable '${name}' set to '${value}'`
      });
    } else if (key === "get") {
      const [, name] = command.split(" ");
      if (!name) {
        failed("Usage: get <name>");
        return;
      }
      const value = getVariable(name);
      if (value === undefined) {
        failed(`Variable '${name}' not found`);
      } else {
        success({
          type: "normal",
          class: "info",
          content: value
        });
      }
    }else if (key ==="open"){
      const prompt = command.substring(5);
        success({
          type: "input",
          class: "info",
          inputPrompt: "Should allow Terminal to open a webpage?[y/n]",
          onInput: (value: string) => {
            if (value.startsWith("y")) {
              addMessage({
                type:"normal",
                class:"success",
                content:"You have agreed to the Terminal request"
              })
              window.open(prompt.trim())
              return;
            }else{
              addMessage({
                type: "normal",
                class: "success",
                content: "You have rejected the Terminal request"
              });
              return;
            }
          }
        });
    }else if (key === "info"){
      success({
        type:"html",
        content:`
<div class="alert alert-info shadow-lg">
  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 w-6 h-6" fill="none"
    viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
  </svg>
  <span>CCRS Terminal Build[${getSettings("buile_time")}], Type <b>Help</b> to see all supported commands.</span>
</div>

<div class="card bg-base-200 shadow-md mt-4">
  <div class="card-body">
    <h2 class="card-title">This terminal supports:</h2>
    <ul class="space-y-2">
      <li class="flex items-center">
        <span class="badge badge-success badge-sm mr-2"></span> JSON formatting
      </li>
      <li class="flex items-center">
        <span class="badge badge-success badge-sm mr-2"></span> <a class="link">Clickable links</a>
      </li>
      <li class="flex items-center">
        <span class="badge badge-success badge-sm mr-2"></span> HTML support
      </li>
      <li class="flex items-center">
        <span class="badge badge-success badge-sm mr-2"></span> Basic command processing
      </li>
    </ul>
  </div>
</div>

        `
      })
    }
    // else if (key === "fail") {
    //       failed("Command execution failed: Simulated error result");
    // }else if (key === "code") {
    //   success({
    //     type: "code",
    //     content:
    //         'import React from "react"\n' +
    //         'import ReactDOM from "react-dom/client"\n' +
    //         'import App from "./App"\n' +
    //         'import "./index.css"\n' +
    //         '\n' +
    //         'ReactDOM.createRoot(document.getElementById("root")!).render(\n' +
    //         '  <React.StrictMode>\n' +
    //         '    <App />\n' +
    //         '  </React.StrictMode>,\n' +
    //         ')\n',
    //   });
    // } else if (key === "table") {
    //   success({
    //     type: "table",
    //     content: {
    //       head: ["Title 1", "Title 2", "Title 3", "Title 4"],
    //       rows: [
    //         ["Name 1", "Hello world", "This is test 1", "XXXXX"],
    //         ["Name 2", "Hello world", "This is test 2", "XXXXX"],
    //       ],
    //     },
    //   });
    // } else if (key === "html") {
    //   success({
    //     type: "html",
    //     content: `
    //       <div class="space-y-2">
    //         <div class="text-success">● Directory 1</div>
    //         <div class="text-success">● Directory 2</div>
    //         <div class="text-info">○ File 1</div>
    //         <div class="text-info">○ File 2</div>
    //       </div>
    //     `,
    //   });
    // }  else if (key === "greet") {
    //   success({
    //     type: "input",
    //     class: "info",
    //     inputPrompt: "What is your name?",
    //     onInput: (value: string) => {
    //       if (!value.trim()) {
    //         addMessage({
    //           type: "normal",
    //           class: "error",
    //           content: "Name cannot be empty!"
    //         });
    //         return;
    //       }
    //       addMessage({
    //         type: "normal",
    //         class: "success",
    //         content: `? Hello, ${value}! Welcome to the terminal!`
    //       });
    //     }
    //   });
    // }
    else {
      failed({
        type: "normal",
        class: "error",
        content: 'Unknown Command'
      })
    }
  };

  return (
      <Terminal commands={commands} onExecCmd={handleExecCmd} initScript={initScript} />
  );
}

export default WebTerminal;