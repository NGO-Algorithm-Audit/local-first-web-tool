# Algorithm Audit AI Tooling

A web-based tool for bias detection and synthetic data generation. This project runs entirely in the browser using Pyodide for Python computations.

## Features

-   **Bias Detection**: Analyze datasets for potential biases in AI systems
-   **Synthetic Data Generation**: Create synthetic datasets while preserving privacy
-   **Browser-based Computation**: Utilizes Pyodide for running Python code directly in the browser
-   **Interactive Visualizations**: Includes various charts and visualizations for data analysis
-   **Multilingual Support**: Available in English and Dutch

## Prerequisites

-   Node.js (v16 or higher)
-   npm (v8 or higher)

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd [your-repository-directory]
```

2. Install dependencies:

```bash
npm install
```

## Usage

### Development

Run the development server:

```bash
npm run dev
```

This will start the Vite development server, typically at `http://localhost:5173`

### Building for Production

Build the project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Code Formatting and Linting

Format code:

```bash
npm run format
```

Run linter:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

## Project Structure

-   `/src` - Source code
    -   `/assets` - Static assets and code examples
    -   `/components` - React components
    -   `/routes` - Page components
    -   `/lib` - Utility functions
    -   `/locales` - Translation files
-   `/public` - Static files and Python dependencies
    -   `/pyodide-0.27.3` - Pyodide distribution files
-   `/datasets` - Example datasets for testing

## Pyodide

The project uses Pyodide v0.27.3 for running Python code in the browser. To upgrade Pyodide:

-   upgrade pyoide in package.json
-   upgrade files in public/pyodide
    -   download from https://github.com/pyodide/pyodide/releases and extract the files
    -   download pyodide and pyodide-core
    -   place only the needed files from pyodide in the public/pyodide-[version] folder
    -   place all files from pyodide-core in the public/pyodide-[version] folder
    -   change the use-worker.ts file to point to the new version

## Development Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run preview` - Preview production build
-   `npm run format` - Format code using Prettier
-   `npm run lint` - Run ESLint
-   `npm run lint:fix` - Fix linting issues automatically

## License

This project is licensed under the terms specified in the LICENSE file.
