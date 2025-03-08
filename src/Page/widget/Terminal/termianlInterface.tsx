export interface Command {
    key: string;
    group: string;
    usage: string;
    description: string;
    command_description?: string;
    example?: Array<{
        cmd: string;
        des: string;
    }>;
}

export interface TerminalMessage {
    type?: 'normal' | 'json' | 'code' | 'table' | 'html' | 'input';
    class?: 'success' | 'error' | 'system' | 'info' | 'warning';
    content: any;
    tag?: string;
    inputPrompt?: string;
    onInput?: (value: string) => void;
}

export interface TableContent {
    head: string[];
    rows: string[][];
}

export interface TerminalVariables {
    [key: string]: string;
}