import { FiPlus, FiTrash2 } from 'react-icons/fi'
import type { Category, Subject } from '../../../services/learn'
import type { NewSubjectForm } from './types'

interface SubjectSectionProps {
  categories: Category[]
  subjects: Subject[]
  selectedCategoryId: string
  newSubject: NewSubjectForm
  onSelectCategory: (id: string) => void
  onChange: (patch: Partial<NewSubjectForm>) => void
  onCreate: () => void
  onDelete: (id: string) => void
}

export default function SubjectSection({
  categories,
  subjects,
  selectedCategoryId,
  newSubject,
  onSelectCategory,
  onChange,
  onCreate,
  onDelete,
}: SubjectSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card md:col-span-1">
        <h3 className="font-semibold mb-3">Create Subject</h3>
        <div className="space-y-3">
          <select className="input-field" value={newSubject.categoryId} onChange={(e) => onChange({ categoryId: e.target.value })}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input className="input-field" placeholder="Subject Name" value={newSubject.name} onChange={(e) => onChange({ name: e.target.value })} />
          <input className="input-field" placeholder="Subject Slug" value={newSubject.slug} onChange={(e) => onChange({ slug: e.target.value })} />
          <textarea className="input-field" placeholder="Description" value={newSubject.description || ''} onChange={(e) => onChange({ description: e.target.value })} />
          <button className="btn-primary w-full" onClick={onCreate}>
            <FiPlus className="inline w-4 h-4 mr-1" /> Create Subject
          </button>
        </div>
      </div>
      <div className="card md:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Subjects</h3>
          <select className="input-field max-w-xs" value={selectedCategoryId} onChange={(e) => onSelectCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          {subjects.map((sub) => (
            <div key={sub.id} className="flex items-start justify-between border rounded p-3">
              <div>
                <div className="font-medium">{sub.name}</div>
                <div className="text-xs text-gray-500">{sub.slug}</div>
                <div className="text-sm text-gray-600 mt-1">{sub.description || 'No description'}</div>
                <div className="text-xs text-gray-400 mt-2">Topics: {sub.topics?.length || 0}</div>
              </div>
              <button className="btn-danger" onClick={() => onDelete(sub.id)}>
                <FiTrash2 className="inline w-4 h-4 mr-1" /> Delete
              </button>
            </div>
          ))}
          {subjects.length === 0 && <div className="text-sm text-gray-500">No subjects found</div>}
        </div>
      </div>
    </div>
  )
}
