import { useEffect } from 'react'
import CodeEditor from './components/CodeEditor'
import { PythonProvider } from 'react-py'
import { demoCode } from './assets/demoExample'

function App() {
  const packages = {
    official: ['numpy', 'pandas', 'scikit-learn'],
    micropip: ['kmodes', 'requests', 'unsupervised-bias-detection']
  }

  useEffect(() => {
    navigator.serviceWorker
      .register('/react-py-sw.js')
      .then((registration) =>
        console.log(
          'Service Worker registration successful with scope: ',
          registration.scope
        )
      )
      .catch((err) => console.log('Service Worker registration failed: ', err))
  }, [])

  return (
    <PythonProvider packages={packages}>
      <h3 className='text-3xl mb-8'>Algorithm Audit AI Tooling</h3>
      <CodeEditor code={demoCode} />
    </PythonProvider>
  )
}

export default App
