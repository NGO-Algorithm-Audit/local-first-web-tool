import Navigation from '@/components/Navigation';
import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createRootRoute({
    component: () => (
        <div className="flex flex-col lg:flex-row h-screen w-full bg-aaLight overflow-x-hidden">
            <Navigation />
            <div className="flex flex-1 flex-col bg-white overflow-x-hidden">
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
