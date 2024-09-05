import Navigation from '@/components/Navigation';
import { TooltipProvider } from '@/components/ui/tooltip';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
    component: () => (
        <div className="flex flex-col lg:flex-row h-screen w-full bg-aaLight overflow-x-hidden">
            <Navigation />
            <div className="flex flex-1 flex-col bg-white overflow-x-hidden">
                <Outlet />
            </div>
        </div>
    ),
});
