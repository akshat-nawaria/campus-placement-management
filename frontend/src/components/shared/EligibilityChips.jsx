export default function EligibilityChips({ criteria }) {
  if (!criteria) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {criteria.minCgpa > 0 && (
        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
          <span className="material-symbols-outlined text-sm mr-1">school</span>
          Min CGPA: {criteria.minCgpa}
        </span>
      )}
      {criteria.allowedBranches?.length > 0 && (
        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium">
          <span className="material-symbols-outlined text-sm mr-1">account_tree</span>
          {criteria.allowedBranches.join(', ')}
        </span>
      )}
      <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
        criteria.allowBacklogs ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}>
        <span className="material-symbols-outlined text-sm mr-1">
          {criteria.allowBacklogs ? 'check_circle' : 'cancel'}
        </span>
        Backlogs {criteria.allowBacklogs ? 'Allowed' : 'Not Allowed'}
      </span>
      {criteria.targetBatchYear && (
        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-teal-50 text-teal-700 text-xs font-medium">
          <span className="material-symbols-outlined text-sm mr-1">calendar_month</span>
          Batch {criteria.targetBatchYear}
        </span>
      )}
    </div>
  );
}
