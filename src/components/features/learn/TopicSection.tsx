import { FiPlus, FiTrash2 } from 'react-icons/fi'
import type { Category, Subject, Topic } from '../../../services/learn'
import type { NewTopicForm } from './types'

interface TopicSectionProps {
  categories: Category[]
  subjects: Subject[]
  topics: Topic[]
  selectedCategoryId: string
  selectedSubjectId: string
  newTopic: NewTopicForm
  onSelectCategory: (id: string) => void
  onSelectSubject: (id: string) => void
  onChange: (patch: Partial<NewTopicForm>) => void
  onCreate: () => void
  onDelete: (id: string) => void
}

export default function TopicSection({
  categories,
  subjects,
  topics,
  selectedCategoryId,
  selectedSubjectId,
  newTopic,
  onSelectCategory,
  onSelectSubject,
  onChange,
  onCreate,
  onDelete,
}: TopicSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card md:col-span-1">
        <h3 className="font-semibold mb-3">Create Topic</h3>
        <div className="space-y-3">
          <select className="input-field" value={newTopic.subjectId} onChange={(e) => onChange({ subjectId: e.target.value })}>
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
          <input className="input-field" placeholder="Topic Title" value={newTopic.title} onChange={(e) => onChange({ title: e.target.value })} />
          <input className="input-field" placeholder="Topic Slug" value={newTopic.slug} onChange={(e) => onChange({ slug: e.target.value })} />
          <textarea className="input-field" placeholder="Description" value={newTopic.description || ''} onChange={(e) => onChange({ description: e.target.value })} />
          <button className="btn-primary w-full" onClick={onCreate}>
            <FiPlus className="inline w-4 h-4 mr-1" /> Create Topic
          </button>
        </div>
      </div>
      <div className="card md:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Topics</h3>
          <div className="flex gap-2">
            <select
              className="input-field max-w-xs"
              value={selectedCategoryId}
              onChange={(e) => {
                onSelectCategory(e.target.value)
                onSelectSubject('')
              }}
            >
              <option value="">Filter by Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select className="input-field max-w-xs" value={selectedSubjectId} onChange={(e) => onSelectSubject(e.target.value)}>
              <option value="">Filter by Subject</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          {topics.map((topic) => (
            <div key={topic.id} className="flex items-start justify-between border rounded p-3">
              <div>
                <div className="font-medium">{topic.title}</div>
                <div className="text-xs text-gray-500">{topic.slug}</div>
                <div className="text-sm text-gray-600 mt-1">{topic.description || 'No description'}</div>
                <div className="text-xs text-gray-400 mt-2">Subtopics: {topic.subtopics?.length || 0}</div>
              </div>
              <button className="btn-danger" onClick={() => onDelete(topic.id)}>
                <FiTrash2 className="inline w-4 h-4 mr-1" /> Delete
              </button>
            </div>
          ))}
          {topics.length === 0 && <div className="text-sm text-gray-500">No topics found</div>}
        </div>
      </div>
    </div>
  )
}
