import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createRootRoute({
    component: () => (
        <div id="printroot" className="flex flex-col w-full h-full bg-white">
            <Outlet />
        </div>
    ),
    notFoundComponent: () => {
        const navigate = useNavigate();

        useEffect(() => {
            // Redirect to the desired path, e.g., home page
            navigate({ to: '/' });
        }, [navigate]);

        return null;
    },
});
