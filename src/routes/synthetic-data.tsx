import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/synthetic-data')({
    component: Index,
});

function Index() {
    return (
        <div className="p-2">
            <h3>Coming soon!</h3>
        </div>
    );
}
