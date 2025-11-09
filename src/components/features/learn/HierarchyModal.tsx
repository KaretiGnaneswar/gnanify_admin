import { FiChevronLeft } from 'react-icons/fi'
import { useState } from 'react'
import HierarchyTable, { HierarchyTableRow } from './HierarchyTable'
import type { Category } from '../../../services/learn'
import type { LearnTab } from './types'

interface HierarchyExplorerProps {
  categories: Category[]
  onEdit?: (type: LearnTab, id: string) => void
  onDelete?: (type: LearnTab, id: string) => void
}

export default function HierarchyExplorer({ categories, onEdit, onDelete }: HierarchyExplorerProps) {
  const [level, setLevel] = useState<LearnTab>('categories')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || null
  const selectedSubject = selectedCategory?.subjects?.find(s => s.id === selectedSubjectId) || null
  const selectedTopic = selectedSubject?.topics?.find(t => t.id === selectedTopicId) || null

  const handleBack = () => {
    if (level === 'subtopics') { setLevel('topics'); setSelectedTopicId(null) }
    else if (level === 'topics') { setLevel('subjects'); setSelectedSubjectId(null) }
    else if (level === 'subjects') { setLevel('categories'); setSelectedCategoryId(null) }
  }

  const buildCategoryRows = (): HierarchyTableRow[] =>
    categories.map(cat => ({
      key: cat.id,
      cells: [cat.name, cat.slug, String(cat.subjects?.length ?? 0)],
      onSelect: () => { setSelectedCategoryId(cat.id); setLevel('subjects') },
    }))

  const buildSubjectRows = (): HierarchyTableRow[] =>
    (selectedCategory?.subjects || []).map(sub => ({
      key: sub.id,
      cells: [sub.name, sub.slug, String(sub.topics?.length ?? 0)],
      onSelect: () => { setSelectedSubjectId(sub.id); setLevel('topics') },
    }))

  const buildTopicRows = (): HierarchyTableRow[] =>
    (selectedSubject?.topics || []).map(topic => ({
      key: topic.id,
      cells: [topic.title, topic.slug, String(topic.subtopics?.length ?? 0)],
      onSelect: () => { setSelectedTopicId(topic.id); setLevel('subtopics') },
    }))

  const buildSubtopicRows = (): HierarchyTableRow[] =>
    (selectedTopic?.subtopics || []).map(sub => ({
      key: sub.id,
      cells: [sub.title, String(sub.likes ?? 0), String(sub.dislikes ?? 0)],
    }))

  const currentData = (() => {
    switch (level) {
      case 'subjects': return { title: `Subjects in ${selectedCategory?.name}`, cols: ['Name', 'Slug', 'Topics'], rows: buildSubjectRows() }
      case 'topics': return { title: `Topics in ${selectedSubject?.name}`, cols: ['Title', 'Slug', 'Subtopics'], rows: buildTopicRows() }
      case 'subtopics': return { title: `Subtopics in ${selectedTopic?.title}`, cols: ['Title', 'Likes', 'Dislikes'], rows: buildSubtopicRows() }
      default: return { title: 'Categories', cols: ['Name', 'Slug', 'Subjects'], rows: buildCategoryRows() }
    }
  })()

  const handleEdit = onEdit ? (id: string) => onEdit(level, id) : undefined
  const handleDelete = onDelete ? (id: string) => onDelete(level, id) : undefined

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70 rounded-t-2xl">
        <div className="flex items-center gap-2">
          {level !== 'categories' && (
            <button onClick={handleBack} className="p-1 text-gray-600 hover:text-blue-600">
              <FiChevronLeft className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{currentData.title}</h2>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">Select rows to drill down</span>
      </div>

      <div className="p-6 overflow-x-auto">
        <HierarchyTable
          title={currentData.title}
          columns={[...currentData.cols, 'Actions']}
          rows={currentData.rows.map(r => ({
            ...r,
            cells: [
              ...r.cells,
              'actions',
            ],
          }))}
          selectedKey={
            level === 'categories' ? selectedCategoryId || '' :
            level === 'subjects' ? selectedSubjectId || '' :
            level === 'topics' ? selectedTopicId || '' : ''
          }
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
