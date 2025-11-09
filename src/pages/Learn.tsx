import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  categoriesService,
  subjectsService,
  topicsService,
  subtopicsService,
} from '../services/learn'
import type { Category } from '../services/learn'
import LearnHeader from '../components/features/learn/LearnHeader'
import LearnTabs from '../components/features/learn/LearnTabs'
import HierarchyExplorer from '../components/features/learn/HierarchyModal'
import CategorySection from '../components/features/learn/CategorySection'
import SubjectSection from '../components/features/learn/SubjectSection'
import TopicSection from '../components/features/learn/TopicSection'
import SubtopicSection from '../components/features/learn/SubtopicSection'
import type {
  LearnTab,
  NewCategoryForm,
  NewSubjectForm,
  NewTopicForm,
  NewSubtopicForm,
} from '../components/features/learn/types'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertCircle } from 'react-icons/fi'

export default function Learn() {
  const [tab, setTab] = useState<LearnTab>('categories')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [newCategory, setNewCategory] = useState<NewCategoryForm>({ name: '', slug: '' })
  const [newSubject, setNewSubject] = useState<NewSubjectForm>({ categoryId: '', name: '', slug: '' })
  const [newTopic, setNewTopic] = useState<NewTopicForm>({ subjectId: '', title: '', slug: '' })
  const [newSubtopic, setNewSubtopic] = useState<NewSubtopicForm>({ title: '', content: '' })

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [selectedTopicId, setSelectedTopicId] = useState<string>('')

  const allSubjects = useMemo(() => categories.flatMap((cat) => cat.subjects || []), [categories])
  const allTopics = useMemo(() => allSubjects.flatMap((sub) => sub.topics || []), [allSubjects])
  const selectedCategory = useMemo(
    () => categories.find((cat) => cat.id === selectedCategoryId) || null,
    [categories, selectedCategoryId]
  )
  const subjectsForSelectedCategory = useMemo(
    () => (selectedCategory ? selectedCategory.subjects || [] : allSubjects),
    [selectedCategory, allSubjects]
  )
  const selectedSubject = useMemo(
    () => subjectsForSelectedCategory.find((sub) => sub.id === selectedSubjectId) || null,
    [subjectsForSelectedCategory, selectedSubjectId]
  )
  const topicsForSelectedSubject = useMemo(
    () => (selectedSubject ? selectedSubject.topics || [] : allTopics),
    [selectedSubject, allTopics]
  )
  const selectedTopic = useMemo(
    () => topicsForSelectedSubject.find((topic) => topic.id === selectedTopicId) || null,
    [topicsForSelectedSubject, selectedTopicId]
  )
  const selectedSubtopics = selectedTopic?.subtopics || []

  // ---------------------------
  // Error handler
  // ---------------------------
  const showErr = (error: unknown, fallback: string) => {
    const detail = (error as any)?.response?.data || (error as Error)?.message || fallback
    setError(typeof detail === 'string' ? detail : JSON.stringify(detail))
  }

  // ---------------------------
  // Fetch all categories
  // ---------------------------
  const refreshAll = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const cats = await categoriesService.list()
      setCategories(Array.isArray(cats) ? cats : [])
    } catch (error) {
      showErr(error, 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshAll()
  }, [refreshAll])

  // ---------------------------
  // CRUD Actions
  // ---------------------------
  const createCategory = async () => {
    if (!newCategory.name || !newCategory.slug) return showErr(null, 'Name & Slug required')
    try {
      await categoriesService.create(newCategory)
      setNewCategory({ name: '', slug: '' })
      refreshAll()
    } catch (err) {
      showErr(err, 'Failed to create category')
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return
    await categoriesService.remove(id)
    refreshAll()
  }

  const createSubject = async () => {
    if (!newSubject.categoryId) return showErr(null, 'Select a category')
    try {
      await subjectsService.create({
        name: newSubject.name,
        slug: newSubject.slug,
        description: newSubject.description,
        category_id: newSubject.categoryId,
      } as any)
      setNewSubject({ categoryId: '', name: '', slug: '' })
      refreshAll()
    } catch (err) {
      showErr(err, 'Failed to create subject')
    }
  }

  const deleteSubject = async (id: string) => {
    if (!confirm('Delete this subject?')) return
    await subjectsService.remove(id)
    refreshAll()
  }

  const createTopic = async () => {
    if (!newTopic.subjectId) return showErr(null, 'Select a subject')
    try {
      await topicsService.create({
        title: newTopic.title,
        slug: newTopic.slug,
        description: newTopic.description,
        subject_id: newTopic.subjectId,
      } as any)
      setNewTopic({ subjectId: '', title: '', slug: '' })
      refreshAll()
    } catch (err) {
      showErr(err, 'Failed to create topic')
    }
  }

  const deleteTopic = async (id: string) => {
    if (!confirm('Delete this topic?')) return
    await topicsService.remove(id)
    refreshAll()
  }

  const createSubtopic = async () => {
    if (!selectedTopicId) return showErr(null, 'Select a topic')
    try {
      await subtopicsService.create({
        title: newSubtopic.title,
        content: newSubtopic.content,
        topic_id: selectedTopicId,
      } as any)
      setNewSubtopic({ title: '', content: '' })
      refreshAll()
    } catch (err) {
      showErr(err, 'Failed to create subtopic')
    }
  }

  const deleteSubtopic = async (id: string) => {
    if (!confirm('Delete this subtopic?')) return
    await subtopicsService.remove(id)
    refreshAll()
  }

  const handleCategorySelect = (id: string) => {
    setSelectedCategoryId(id)
    setSelectedSubjectId('')
    setSelectedTopicId('')
  }

  const handleSubjectSelect = (id: string) => {
    setSelectedSubjectId(id)
    setSelectedTopicId('')
  }

  const handleTopicSelect = (id: string) => {
    setSelectedTopicId(id)
  }

  // ---------------------------
  // UI Layout
  // ---------------------------
  return (
    <div className="space-y-6">
      <LearnHeader onRefresh={refreshAll} />

      {error && <div className="bg-red-50 border-l-4 border-red-400 p-3 text-red-700">{error}</div>}

      <LearnTabs activeTab={tab} onChange={setTab} />

      <HierarchyExplorer categories={categories} />

      {tab === 'categories' && (
        <CategorySection
          categories={categories}
          newCategory={newCategory}
          onChange={(patch) => setNewCategory((prev) => ({ ...prev, ...patch }))}
          onCreate={createCategory}
          onDelete={deleteCategory}
        />
      )}

      {tab === 'subjects' && (
        <SubjectSection
          categories={categories}
          subjects={subjectsForSelectedCategory}
          selectedCategoryId={selectedCategoryId}
          newSubject={newSubject}
          onSelectCategory={handleCategorySelect}
          onChange={(patch) => setNewSubject((prev) => ({ ...prev, ...patch }))}
          onCreate={createSubject}
          onDelete={deleteSubject}
        />
      )}

      {tab === 'topics' && (
        <TopicSection
          categories={categories}
          subjects={subjectsForSelectedCategory}
          topics={topicsForSelectedSubject}
          selectedCategoryId={selectedCategoryId}
          selectedSubjectId={selectedSubjectId}
          newTopic={newTopic}
          onSelectCategory={handleCategorySelect}
          onSelectSubject={handleSubjectSelect}
          onChange={(patch) => setNewTopic((prev) => ({ ...prev, ...patch }))}
          onCreate={createTopic}
          onDelete={deleteTopic}
        />
      )}

      {tab === 'subtopics' && (
        <SubtopicSection
          categories={categories}
          subjects={subjectsForSelectedCategory}
          topics={topicsForSelectedSubject}
          selectedCategoryId={selectedCategoryId}
          selectedSubjectId={selectedSubjectId}
          selectedTopicId={selectedTopicId}
          selectedTopic={selectedTopic}
          subtopics={selectedSubtopics}
          newSubtopic={newSubtopic}
          onSelectCategory={handleCategorySelect}
          onSelectSubject={handleSubjectSelect}
          onSelectTopic={handleTopicSelect}
          onChange={(patch) => setNewSubtopic((prev) => ({ ...prev, ...patch }))}
          onCreate={createSubtopic}
          onDelete={deleteSubtopic}
        />
      )}

      {loading && <div className="text-sm text-gray-500">Loading...</div>}
    </div>
  )
}
