import { t } from 'i18next';
import LoadingIndicator from './ui/loadingIndicator';

export const LoadingState = ({
    loadingMessageKey,
    initializingKey,
}: {
    loadingMessageKey: string;
    initializingKey: string;
}) => {
    return (
        <div className="flex flex-col py-24 items-center justify-center gap-4">
            <LoadingIndicator className="w-12 h-12 text-aaDark" />
            <h1 className="text-md text-center text-aaDark">
                {loadingMessageKey ? t(loadingMessageKey) : t(initializingKey)}
            </h1>
        </div>
    );
};
