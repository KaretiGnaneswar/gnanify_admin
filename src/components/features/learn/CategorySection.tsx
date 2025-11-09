import { FiPlus, FiTrash2 } from 'react-icons/fi'
import type { Category } from '../../../services/learn'
import type { NewCategoryForm } from './types'

interface CategorySectionProps {
  categories: Category[]
  newCategory: NewCategoryForm
  onChange: (patch: Partial<NewCategoryForm>) => void
  onCreate: () => void
  onDelete: (id: string) => void
}

export default function CategorySection({ categories, newCategory, onChange, onCreate, onDelete }: CategorySectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card md:col-span-1">
        <h3 className="font-semibold mb-3">Create Category (root)</h3>
        <div className="space-y-3">
          <input className="input-field" placeholder="Name" value={newCategory.name} onChange={(e) => onChange({ name: e.target.value })} />
          <input className="input-field" placeholder="Slug" value={newCategory.slug} onChange={(e) => onChange({ slug: e.target.value })} />
          <textarea className="input-field" placeholder="Description" value={newCategory.description || ''} onChange={(e) => onChange({ description: e.target.value })} />
          <button className="btn-primary w-full" onClick={onCreate}>
            <FiPlus className="inline w-4 h-4 mr-1" /> Create Category
          </button>
        </div>
      </div>
      <div className="card md:col-span-2">
        <h3 className="font-semibold mb-3">Existing Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="border rounded p-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{cat.name}</div>
                  <div className="text-xs text-gray-500">{cat.slug}</div>
                  <div className="text-sm text-gray-600 mt-1">{cat.description || 'No description'}</div>
                  <div className="text-xs text-gray-400 mt-2">Subjects: {cat.subjects?.length || 0}</div>
                </div>
                <button className="btn-danger" onClick={() => onDelete(cat.id)}>
                  <FiTrash2 className="inline w-4 h-4 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && <div className="text-sm text-gray-500">No categories yet</div>}
        </div>
      </div>
    </div>
  )
}
