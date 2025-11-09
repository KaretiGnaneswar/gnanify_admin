export type LearnTab = 'categories' | 'subjects' | 'topics' | 'subtopics'

export type NewCategoryForm = {
  name: string
  slug: string
  description?: string
}

export type NewSubjectForm = {
  categoryId: string
  name: string
  slug: string
  description?: string
}

export type NewTopicForm = {
  subjectId: string
  title: string
  slug: string
  description?: string
}

export type NewSubtopicForm = {
  title: string
  content: string
}
