import { EvalGroupWithLatestRun } from '../core/eval.ts';
import { useScoreColors } from '../hooks/useScoreColors.tsx';

interface SidebarProps {
  evalGroups: EvalGroupWithLatestRun[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
  onShowVersions: (name: string) => void;
}

export function Sidebar({ evalGroups, selectedGroupId, onSelectGroup, onShowVersions }: SidebarProps) {
  const { getScoreColor, getScoreIcon } = useScoreColors();

  const overallScore = evalGroups.length > 0 
    ? evalGroups.reduce((acc, group) => acc + group.avgScore, 0) / evalGroups.length 
    : 0;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5" viewBox="0 0 54 68" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path fill="currentColor" d="M0 .002V29.1l7.481 4.681L0 38.447v28.977l53.82-33.697L0 .002Zm4.92 41.139 21.003-13.175L4.921 14.75V8.817l30.51 19.136-30.51 18.909V41.14Zm-.053 17.376v-5.828l.134-.08 35.031-21.776 4.6 2.88L4.868 58.517Zm0-32.111v-5.908l11.895 7.468-4.707 2.947-7.188-4.507Z"/>
          </svg>
          <span className="text-lg font-medium tracking-tight">Free Eval</span>
        </div>
        
        {/* Overall Summary */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Summary</p>
          <div className="flex items-center space-x-2 text-gray-600 font-medium text-2xl">
            <span>{(overallScore).toFixed(0)}%</span>
            {getScoreIcon(overallScore)}
          </div>
        </div>
      </div>

      {/* Evals List */}
      <div className="p-4">
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500">Evals</p>
        </div>
        
        <div className="space-y-1">
          {evalGroups.map((group) => (
            <div key={group.id} className="relative group">
              <button
                onClick={() => onSelectGroup(group.id)}
                className={`flex flex-col w-full text-left px-2 py-2 rounded text-sm transition-colors ${
                  selectedGroupId === group.id
                    ? 'bg-gray-200 text-gray-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium truncate">{group.name}</span>
                  <div className="flex items-center space-x-1">
                    <span className={getScoreColor(group.avgScore)}>
                      {(group.avgScore).toFixed(0)}%
                    </span>
                    {getScoreIcon(group.avgScore)}
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{group.model}</span>
                  <span>{group.totalRuns} runs</span>
                </div>
              </button>
              
              {/* Version history button */}
              {selectedGroupId === group.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowVersions(group.name);
                  }}
                  className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-300 rounded"
                >
                  <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="19" cy="12" r="1"/>
                    <circle cx="5" cy="12" r="1"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        
        {evalGroups.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No evaluations found</p>
            <p className="text-xs text-gray-400 mt-1">Run your first evaluation</p>
          </div>
        )}
      </div>
    </div>
  );
}