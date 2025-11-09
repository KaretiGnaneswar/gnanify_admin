import { FiRefreshCcw } from 'react-icons/fi'

interface LearnHeaderProps {
  onRefresh: () => void
}

export default function LearnHeader({ onRefresh }: LearnHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Learn</h1>
        <p className="text-gray-600">Create Categories (root), Subjects, Topics, and manage Subtopics (lessons)</p>
      </div>
      <div className="flex gap-2">
        <button className="btn-secondary" onClick={onRefresh}>
          <FiRefreshCcw className="inline w-4 h-4 mr-1" /> Refresh
        </button>
      </div>
    </div>
  )
}
