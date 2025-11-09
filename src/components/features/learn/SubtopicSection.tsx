import { FiPlus, FiTrash2 } from 'react-icons/fi'
import type { Category, Subject, Topic, Subtopic } from '../../../services/learn'
import type { NewSubtopicForm } from './types'

interface SubtopicSectionProps {
  categories: Category[]
  subjects: Subject[]
  topics: Topic[]
  selectedCategoryId: string
  selectedSubjectId: string
  selectedTopicId: string
  selectedTopic?: Topic | null
  subtopics: Subtopic[]
  newSubtopic: NewSubtopicForm
  onSelectCategory: (id: string) => void
  onSelectSubject: (id: string) => void
  onSelectTopic: (id: string) => void
  onChange: (patch: Partial<NewSubtopicForm>) => void
  onCreate: () => void
  onDelete: (id: string) => void
}

export default function SubtopicSection({
  categories,
  subjects,
  topics,
  selectedCategoryId,
  selectedSubjectId,
  selectedTopicId,
  selectedTopic,
  subtopics,
  newSubtopic,
  onSelectCategory,
  onSelectSubject,
  onSelectTopic,
  onChange,
  onCreate,
  onDelete,
}: SubtopicSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card md:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Subtopics {selectedTopic ? `for ${selectedTopic.title}` : ''}</h3>
          <div className="flex gap-2">
            <select
              className="input-field max-w-xs"
              value={selectedCategoryId}
              onChange={(e) => onSelectCategory(e.target.value)}
            >
              <option value="">Filter by Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              className="input-field max-w-xs"
              value={selectedSubjectId}
              onChange={(e) => onSelectSubject(e.target.value)}
            >
              <option value="">Filter by Subject</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
            <select className="input-field max-w-xs" value={selectedTopicId} onChange={(e) => onSelectTopic(e.target.value)}>
              <option value="">Select Topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          {subtopics.map((sub) => (
            <div key={sub.id} className="flex items-start justify-between border rounded p-3">
              <div>
                <div className="font-medium">{sub.title}</div>
                <div className="text-xs text-gray-500">Created {new Date(sub.created_at).toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-1">{sub.content || 'No content'}</div>
              </div>
              <button className="btn-danger" onClick={() => onDelete(sub.id)}>
                <FiTrash2 className="inline w-4 h-4 mr-1" /> Delete
              </button>
            </div>
          ))}
          {selectedTopic && subtopics.length === 0 && <div className="text-sm text-gray-500">No subtopics yet</div>}
          {!selectedTopic && <div className="text-sm text-gray-500">Select a topic to view subtopics</div>}
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-3">Create Subtopic</h3>
        {!selectedTopic && <div className="text-sm text-gray-500 mb-2">Select a topic to add lessons</div>}
        <div className="space-y-3">
          <input className="input-field" placeholder="Title" value={newSubtopic.title} onChange={(e) => onChange({ title: e.target.value })} />
          <textarea className="input-field" placeholder="Content" value={newSubtopic.content} onChange={(e) => onChange({ content: e.target.value })} />
          <button disabled={!selectedTopic} className="btn-primary w-full disabled:opacity-50" onClick={onCreate}>
            <FiPlus className="inline w-4 h-4 mr-1" /> Create Subtopic
          </button>
        </div>
      </div>
    </div>
  )
}
