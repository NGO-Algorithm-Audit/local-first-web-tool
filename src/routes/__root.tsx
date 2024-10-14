import Navigation from '@/components/Navigation';
import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createRootRoute({
    component: () => (
        <div
            id="printroot"
            className="flex flex-col lg:flex-row lg:h-screen w-full bg-aaLight"
        >
            <Navigation />
            <div className="flex flex-1 flex-col bg-white">
                <Outlet />
            </div>
        </div>
    ),
    notFoundComponent: () => {
        const navigate = useNavigate();

        useEffect(() => {
            // Redirect to the desired path, e.g., home page
            navigate({ to: '/bias-detection' });
        }, [navigate]);

        return null;
    },
});
