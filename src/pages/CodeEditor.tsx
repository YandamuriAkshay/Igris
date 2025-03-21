import React, { useState } from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState<string>('console.log("Hello, world!");');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    try {
      const response = await fetch('http://localhost:5002/api/code/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: 'javascript'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error executing code');
      }
      
      setOutput(data.output || 'No output');
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Code Editor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-secondary-light rounded-lg shadow-lg overflow-hidden">
          <div className="bg-secondary px-4 py-2 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Editor</h2>
          </div>
          <div className="p-4">
            <textarea
              className="w-full h-80 bg-secondary text-white font-mono text-sm p-3 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={code}
              onChange={handleCodeChange}
              spellCheck="false"
              placeholder="Write your code here..."
            />
            <div className="mt-4">
              <button
                className={`flex items-center px-4 py-2 rounded font-medium ${
                  isRunning
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark'
                } text-white transition-colors`}
                onClick={handleRunCode}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Running...
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4 mr-1" />
                    Run Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary-light rounded-lg shadow-lg overflow-hidden">
          <div className="bg-secondary px-4 py-2 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Output</h2>
          </div>
          <div className="p-4">
            <div className="bg-black text-white font-mono text-sm p-3 rounded h-80 overflow-auto whitespace-pre-wrap">
              {output || 'Code output will appear here...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor; 