import { useEffect, useState } from "preact/hooks";
import { useScoreColors } from "../hooks/useScoreColors.tsx";
import { EvalDrawer } from "./EvalDrawer.tsx";
import SimpleChart from "../islands/SimpleChart.tsx";
import TimeChart from "../islands/TimeChart.tsx";
import {
  ChartDataPoint,
  EvalGroupDetails,
  ScoreProgressPoint as DurationProgressData,
  ScoreProgressPoint as ScoreProgressData,
} from "../core/eval.ts";

interface MainContentProps {
  groupDetails: EvalGroupDetails | null;
  onShowVersions: (name: string) => void;
  loading?: boolean;
}

export function MainContent(
  { groupDetails, onShowVersions, loading }: MainContentProps,
) {
  const { getScoreColor, getScoreIcon } = useScoreColors(groupDetails?.threshold);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [scoreProgress, setScoreProgress] = useState<ScoreProgressData[]>([]);
  const [durationProgressData, setDurationProgressData] = useState<
    DurationProgressData[]
  >();

  // Fetch chart data when groupDetails changes
  useEffect(() => {
    if (groupDetails) {
      fetchChartData(groupDetails.name);
    }
  }, [groupDetails]);

  const fetchChartData = async (evalName: string) => {
    setChartLoading(true);
    try {
      const response = await fetch(
        `/api/eval-chart/${encodeURIComponent(evalName)}`,
      );
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  };

  const fetchScoreProgress = async (fingerprint: string) => {
    try {
      const response = await fetch(
        `/api/score-progress/${encodeURIComponent(fingerprint)}`,
      );
      const data = await response.json();
      setScoreProgress(data);
      setDurationProgressData(data);
    } catch (error) {
      console.error("Error fetching score progress:", error);
      setScoreProgress([]);
    }
  };

  const handleRowClick = (index: number) => {
    setSelectedResultIndex(index);
    setDrawerOpen(true);

    if (groupDetails?.results[index]) {
      fetchScoreProgress(groupDetails.results[index].inputFingerPrint);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleSelectResult = (index: number) => {
    setSelectedResultIndex(index);

    if (groupDetails?.results[index]) {
      fetchScoreProgress(groupDetails.results[index].inputFingerPrint);
    }
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
          <p className="text-gray-400">
            Choose an evaluation from the sidebar to view details
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-1 hover:bg-gray-100 rounded">
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 3v18" />
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
          <div className="mb-2">
            <h1 className="text-2xl font-medium text-gray-700 tracking-tight">
              {groupDetails.name}
            </h1>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className={getScoreColor(groupDetails.avgScore)}>{groupDetails.avgScore.toFixed(0)}%</span>
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

        {groupDetails.genericPrompt && (
          <div className="mb-5">
            <h2 className="mb-2 font-medium text-lg text-gray-600">
              Prompt
            </h2>
            <div className="bg-gray-100 px-2 py-1 rounded">
              <code className="text-sm text-gray-500 tracking-tight">
                {groupDetails.genericPrompt}
              </code>
            </div>
          </div>
        )}

        {/* History Chart */}
        <div className="mb-10">
          {chartLoading
            ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <div className="text-gray-400">
                  <p className="text-sm">Loading chart data...</p>
                </div>
              </div>
            )
            : (
              <div className="flex gap-4">
                <div className="flex-1">
                  <h2 className="mb-2 font-medium text-lg text-gray-600">
                    Score
                  </h2>
                  <SimpleChart data={chartData} />
                </div>

                <div className="flex-1">
                  <h2 className="mb-2 font-medium text-lg text-gray-600">
                    Duration
                  </h2>
                  <TimeChart data={chartData} />
                </div>
              </div>
            )}
        </div>

        {/* Results Table */}
        <div>
          <h2 className="mb-4 font-medium text-lg text-gray-600">Results</h2>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Input
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Output
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                    Duration
                  </th>
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
                          {JSON.stringify(result.input)}
                        </code>
                      </div>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <div className="text-sm text-gray-900 break-words">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {JSON.stringify(result.output)}
                        </code>
                      </div>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <div className="text-sm text-gray-900 break-words">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {result.expected && JSON.stringify(result.expected)}
                        </code>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-l border-gray-200">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm ${getScoreColor(result.score)}`}
                        >
                          {result.score.toFixed(0)}%
                        </span>
                        {getScoreIcon(result.score)}
                      </div>
                    </td>
                    <td className="px-4 py-4 border-l border-gray-200">
                      <div className="text-sm text-gray-900 break-words">
                        {result.duration} ms
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
          scoreProgress={scoreProgress}
          durationProgress={durationProgressData}
        />
      )}
    </div>
  );
}
