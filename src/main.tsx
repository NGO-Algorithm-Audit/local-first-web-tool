import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Navigation from './routes/Index';
import BiasDetection from './routes/BiasDetection';
import SyntheticDataGeneration from './routes/SyntheticData';
import './i18n';

// Render the app
const rootElement = document.getElementById('root')!;
const routeName = rootElement?.getAttribute('data-route');

if (!rootElement?.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);

    const dynamicRoutes = () => {
        switch (routeName) {
            case 'bias-detection':
                return <BiasDetection />;
            case 'synthetic-data':
                return <SyntheticDataGeneration />;
            default:
                return <Navigation />;
        }
    };

    root.render(<StrictMode>{dynamicRoutes()}</StrictMode>);
}
