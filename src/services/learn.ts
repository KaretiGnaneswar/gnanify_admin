import api from './index'

const base = '/learn'

export type Comment = {
  id: string
  user_name: string
  text: string
  likes: number
  dislikes: number
  created_at: string
}

export type Subtopic = {
  id: string
  title: string
  content: string
  likes: number
  dislikes: number
  comments: Comment[]
  created_at: string
  topic_id?: string
  topic_title?: string
  updated_at?: string
  updated_by_name?: string | null
}

export type Topic = {
  id: string
  title: string
  slug: string
  description?: string
  subtopics: Subtopic[]
  subject_id?: string
  subject_name?: string
  created_at?: string
  updated_at?: string
  updated_by_name?: string | null
}

export type Subject = {
  id: string
  name: string
  slug: string
  description?: string
  topics: Topic[]
  category_id?: string
  category_name?: string
  created_at?: string
  updated_at?: string
  updated_by_name?: string | null
}

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  subjects: Subject[]
  created_at?: string
  updated_at?: string
  updated_by_name?: string | null
}

const getList = <T>(path: string) => api.get(`${base}/${path}/`).then(r => r.data as T)
const create = <T>(path: string, data: any) => api.post(`${base}/${path}/`, data).then(r => r.data as T)
const update = <T>(path: string, id: string, data: any) => api.patch(`${base}/${path}/${id}/`, data).then(r => r.data as T)
const remove = (path: string, id: string) => api.delete(`${base}/${path}/${id}/`).then(r => r.data)

export const categoriesService = {
  list: () => getList<Category[]>("categories"),
  create: (data: Partial<Category>) => create<Category>("categories", data),
  update: (id: string, data: Partial<Category>) => update<Category>("categories", id, data),
  remove: (id: string) => remove("categories", id),
}

export const subjectsService = {
  list: () => getList<Subject[]>("subjects"),
  create: (data: Partial<Subject>) => create<Subject>("subjects", data),
  update: (id: string, data: Partial<Subject>) => update<Subject>("subjects", id, data),
  remove: (id: string) => remove("subjects", id),
}

export const topicsService = {
  list: () => getList<Topic[]>("topics"),
  create: (data: Partial<Topic>) => create<Topic>("topics", data),
  update: (id: string, data: Partial<Topic>) => update<Topic>("topics", id, data),
  remove: (id: string) => remove("topics", id),
}

export const subtopicsService = {
  list: () => getList<Subtopic[]>("subtopics"),
  create: (data: Partial<Subtopic>) => create<Subtopic>("subtopics", data),
  update: (id: string, data: Partial<Subtopic>) => update<Subtopic>("subtopics", id, data),
  remove: (id: string) => remove("subtopics", id),
}

export const commentsService = {
  create: (data: Partial<Comment>) => create<Comment>("comments", data),
  update: (id: string, data: Partial<Comment>) => update<Comment>("comments", id, data),
  remove: (id: string) => remove("comments", id),
}
