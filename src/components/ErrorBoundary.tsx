import { Component, ErrorInfo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundaryClass extends Component<
    {
        children?: ReactNode;
        t: (key: string) => string;
    },
    State
> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error: error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        const { t } = this.props;
        if (this.state.hasError) {
            return (
                <h1>
                    {t('error')} {this.state.error?.toString()}
                </h1>
            );
        }

        return this.props.children;
    }
}

// Wrapper component that provides translation function
const ErrorBoundary: React.FC<{
    children?: ReactNode;
}> = props => {
    const { t } = useTranslation();
    return <ErrorBoundaryClass {...props} t={t} />;
};

export default ErrorBoundary;
