interface EvalResult {
  id: string;
  input: string;
  output: string;
  expected: string;
  score: number;
  inputFingerPrint: string;
  evalGroupId: string;
  createdAt: string;
}

interface EvalDrawerProps {
  isOpen: boolean;
  results: EvalResult[];
  selectedResultIndex: number;
  onClose: () => void;
  onSelectResult: (index: number) => void;
  evalName: string;
  evalScore: number;
}

export function EvalDrawer({ 
  isOpen, 
  results, 
  selectedResultIndex, 
  onClose, 
  onSelectResult,
  evalName,
  evalScore
}: EvalDrawerProps) {
  if (!isOpen || results.length === 0) return null;

  const selectedResult = results[selectedResultIndex];
  if (!selectedResult) return null;

  const getScoreIcon = (score: number) => {
    if (score === 1) return (
      <svg className="size-3 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m8 14 4-4 4 4"/>
      </svg>
    );
    return (
      <svg className="size-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m10 8 4 4-4 4"/>
      </svg>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed top-0 right-0 z-20 h-screen border-l bg-white overflow-auto transition-all ease-linear shadow-lg duration-300 w-full sm:w-[500px] md:w-[600px] lg:w-[800px]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="p-4 flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-10 w-10"
            >
              <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M9 3v18"/>
                <path d="m16 15-3-3 3-3"/>
              </svg>
            </button>
            <div>
              <span className="text-blue-600 block font-semibold mb-1">Trace</span>
              <nav>
                <div className="flex flex-wrap items-center gap-1.5 break-words text-sm text-gray-500">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="flex items-center space-x-2">
                      <span>{(evalScore * 100).toFixed(0)}%</span>
                      {getScoreIcon(evalScore)}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-300 mx-1"></div>
                  <div className="inline-flex items-center gap-1.5">0ms</div>
                  <div className="w-px h-4 bg-gray-300 mx-1"></div>
                  <div className="inline-flex items-center gap-1.5">
                    <span>{formatDate(selectedResult.createdAt)}</span>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="flex flex-row h-full">
            {/* Results Navigation Sidebar */}
            <div className="w-44 flex flex-col gap-3 flex-shrink-0 p-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => onSelectResult(index)}
                  className={`px-2 py-2 text-left rounded transition-colors ${
                    selectedResultIndex === index 
                      ? 'bg-gray-200' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between space-x-3">
                    <span className="block text-sm font-medium text-gray-600">
                      Test {index + 1}
                    </span>
                    <span className="text-xs text-gray-600">0ms</span>
                  </div>
                  <div className="relative w-full">
                    <div className="w-full rounded-full h-1 bg-gray-300"></div>
                    <div 
                      className={`absolute top-0 rounded-full h-1 ${
                        result.score === 1 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ left: '0%', width: '100%' }}
                    />
                  </div>
                </button>
              ))}
              
              {results.length === 0 && (
                <span className="text-xs block text-gray-500 text-center text-balance">
                  No test results available.
                </span>
              )}
            </div>

            {/* Detail Content */}
            <div className="flex-grow border-l p-4">
              <div className="text-sm">
                {/* Input Section */}
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      <h2 className="font-medium text-base text-gray-600">Input</h2>
                      <p className="text-gray-500 text-xs mt-1">The input passed to the task.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(selectedResult.input)}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-10 w-10 text-gray-500 hover:text-gray-700"
                      >
                        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-gray-600">
                  <div className="prose prose-sm">
                    <p>{JSON.parse(selectedResult.input)}</p>
                  </div>
                </div>

                <div className="h-px w-full bg-gray-200 mt-6 mb-4"></div>

                {/* Expected Section */}
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      <h2 className="font-medium text-base text-gray-600">Expected</h2>
                      <p className="text-gray-500 text-xs mt-1">A description of the expected output of the task.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(selectedResult.expected)}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-10 w-10 text-gray-500 hover:text-gray-700"
                      >
                        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-gray-600">
                  <div className="prose prose-sm">
                    <p>{JSON.parse(selectedResult.expected)}</p>
                  </div>
                </div>

                <div className="h-px w-full bg-gray-200 mt-6 mb-4"></div>

                {/* Output Section */}
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      <h2 className="font-medium text-base text-gray-600">Output</h2>
                      <p className="text-gray-500 text-xs mt-1">The output of the task.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(selectedResult.output)}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-10 w-10 text-gray-500 hover:text-gray-700"
                      >
                        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-gray-600">
                  <div className="prose prose-sm">
                    <p>{JSON.parse(selectedResult.output)}</p>
                  </div>
                </div>

                <div className="h-px w-full bg-gray-200 mt-6 mb-4"></div>

                {/* Score Section */}
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      <h2 className="font-medium text-base text-gray-600">Score</h2>
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-gray-600">
                  <span className="flex items-center space-x-2">
                    <span>{(selectedResult.score * 100).toFixed(0)}%</span>
                    {getScoreIcon(selectedResult.score)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}