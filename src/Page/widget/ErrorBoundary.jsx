import React, { Component } from 'react';

class ErrorBoundary extends Component {
    state = {
        hasError: false
    };

    static getDerivedStateFromError(error) {
        // 更新 state 以便下次渲染可以显示备用 UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // 你可以将错误日志上报给服务器
        console.error("Error caught by Error Boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // 渲染备用 UI
            return null; // 不渲染任何内容
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
