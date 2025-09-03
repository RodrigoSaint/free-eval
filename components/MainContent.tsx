import { useState } from "preact/hooks";
import { EvalDrawer } from "./EvalDrawer.tsx";

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

interface EvalGroupDetails {
  id: string;
  name: string;
  model: string;
  version: number;
  createdAt: string;
  results: EvalResult[];
  avgScore: number;
  totalTests: number;
}

interface MainContentProps {
  groupDetails: EvalGroupDetails | null;
  onShowVersions: (name: string) => void;
  loading?: boolean;
}

export function MainContent({ groupDetails, onShowVersions, loading }: MainContentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);

  const handleRowClick = (index: number) => {
    setSelectedResultIndex(index);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleSelectResult = (index: number) => {
    setSelectedResultIndex(index);
  };
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">Loading...</div>
          <p className="text-gray-400">Fetching evaluation details</p>
        </div>
      </div>
    );
  }

  if (!groupDetails) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">Select an evaluation</div>
          <p className="text-gray-400">Choose an evaluation from the sidebar to view details</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score === 1) return 'text-green-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score === 1) return (
      <svg className="size-3 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m8 14 4-4 4 4"/>
      </svg>
    );
    return (
      <svg className="size-3 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m16 14-4-4-4 4"/>
      </svg>
    );
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M9 3v18"/>
              </svg>
            </button>
            <div className="h-4 w-px bg-gray-300"></div>
            <nav>
              <span className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                {groupDetails.name}
              </span>
            </nav>
          </div>
          
          <button
            onClick={() => onShowVersions(groupDetails.name)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            View History
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Title and Stats */}
        <div className="mb-10">
          <h1 className="text-2xl font-medium text-gray-700 mb-2 tracking-tight">
            {groupDetails.name}
          </h1>
          
          <div className="flex items-center text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>{(groupDetails.avgScore * 100).toFixed(0)}%</span>
              {getScoreIcon(groupDetails.avgScore)}
            </div>
            <div className="h-4 w-px bg-gray-300 mx-4"></div>
            <span>{groupDetails.model}</span>
            <div className="h-4 w-px bg-gray-300 mx-4"></div>
            <span>v{groupDetails.version}</span>
            <div className="h-4 w-px bg-gray-300 mx-4"></div>
            <span>{formatDate(groupDetails.createdAt)}</span>
          </div>
        </div>

        {/* History Chart Placeholder */}
        <div className="mb-10">
          <h2 className="mb-4 font-medium text-lg text-gray-600">History</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"/>
                <path d="m19 9-5 5-4-4-3 3"/>
              </svg>
              <p className="text-sm">History chart coming soon</p>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div>
          <h2 className="mb-4 font-medium text-lg text-gray-600">Results</h2>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Input</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Output</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {groupDetails.results.map((result, index) => (
                  <tr 
                    key={result.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(index)}
                  >
                    <td className="px-4 py-4 max-w-xs">
                      <div className="text-sm text-gray-900 break-words">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {JSON.parse(result.input)}
                        </code>
                      </div>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <div className="text-sm text-gray-900 break-words">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {JSON.parse(result.output)}
                        </code>
                      </div>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <div className="text-sm text-gray-900 break-words">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {JSON.parse(result.expected)}
                        </code>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-l border-gray-200">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${getScoreColor(result.score)}`}>
                          {(result.score * 100).toFixed(0)}%
                        </span>
                        {getScoreIcon(result.score)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {groupDetails.results.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="text-gray-400">
                <p className="text-sm">No results found</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Eval Drawer */}
      {groupDetails && (
        <EvalDrawer
          isOpen={drawerOpen}
          results={groupDetails.results}
          selectedResultIndex={selectedResultIndex}
          onClose={handleCloseDrawer}
          onSelectResult={handleSelectResult}
          evalName={groupDetails.name}
          evalScore={groupDetails.avgScore}
        />
      )}
    </div>
  );
}