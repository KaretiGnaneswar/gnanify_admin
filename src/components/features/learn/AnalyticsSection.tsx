import { useMemo } from 'react'
import { FiBarChart2, FiBook, FiFileText, FiLayers } from 'react-icons/fi'
import type { Category } from '../../../services/learn'

interface AnalyticsSectionProps {
  categories: Category[]
  loading?: boolean
}

export default function AnalyticsSection({ categories, loading }: AnalyticsSectionProps) {
  const totals = useMemo(() => {
    let subjects = 0
    let topics = 0
    let subtopics = 0
    categories.forEach((category) => {
      const categorySubjects = category.subjects || []
      subjects += categorySubjects.length
      categorySubjects.forEach((subject) => {
        const subjectTopics = subject.topics || []
        topics += subjectTopics.length
        subjectTopics.forEach((topic) => {
          subtopics += topic.subtopics?.length || 0
        })
      })
    })
    return {
      categories: categories.length,
      subjects,
      topics,
      subtopics,
    }
  }, [categories])

  const categoryRows = useMemo(
    () =>
      categories.map((category) => {
        const subjectCount = category.subjects?.length || 0
        const topicCount = category.subjects?.reduce((acc, subject) => acc + (subject.topics?.length || 0), 0) || 0
        const subtopicCount = category.subjects?.reduce(
          (acc, subject) =>
            acc + (subject.topics?.reduce((innerAcc, topic) => innerAcc + (topic.subtopics?.length || 0), 0) || 0),
          0
        ) || 0
        return {
          id: category.id,
          name: category.name,
          subjects: subjectCount,
          topics: topicCount,
          subtopics: subtopicCount,
        }
      }),
    [categories]
  )

  const topSubjects = useMemo(() => {
    return categories
      .flatMap((category) => (category.subjects || []).map((subject) => ({
        id: subject.id,
        name: subject.name,
        category: category.name,
        topics: subject.topics?.length || 0,
        subtopics:
          subject.topics?.reduce((acc, topic) => acc + (topic.subtopics?.length || 0), 0) || 0,
      })))
      .sort((a, b) => b.subtopics - a.subtopics || b.topics - a.topics)
      .slice(0, 5)
  }, [categories])

  const topTopics = useMemo(() => {
    return categories
      .flatMap((category) =>
        (category.subjects || []).flatMap((subject) =>
          (subject.topics || []).map((topic) => ({
            id: topic.id,
            title: topic.title,
            subject: subject.name,
            category: category.name,
            subtopics: topic.subtopics?.length || 0,
          }))
        )
      )
      .sort((a, b) => b.subtopics - a.subtopics)
      .slice(0, 5)
  }, [categories])

  const hasData = categories.length > 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard icon={<FiLayers className="w-5 h-5" />} title="Categories" value={totals.categories} />
        <SummaryCard icon={<FiBook className="w-5 h-5" />} title="Subjects" value={totals.subjects} />
        <SummaryCard icon={<FiBarChart2 className="w-5 h-5" />} title="Topics" value={totals.topics} />
        <SummaryCard icon={<FiFileText className="w-5 h-5" />} title="Subtopics" value={totals.subtopics} />
      </div>

      {!loading && !hasData && (
        <div className="card">
          <div className="card-body text-sm text-gray-500">No learn content yet. Create categories, subjects, topics, and subtopics to see analytics.</div>
        </div>
      )}

      {hasData && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-lg font-semibold">Category Overview</div>
                  <div className="text-xs text-gray-500">Distribution of content across categories</div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                      <th className="py-2">Category</th>
                      <th className="py-2">Subjects</th>
                      <th className="py-2">Topics</th>
                      <th className="py-2">Subtopics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categoryRows.map((row) => (
                      <tr key={row.id}>
                        <td className="py-2 font-medium text-gray-800">{row.name}</td>
                        <td className="py-2">{row.subjects}</td>
                        <td className="py-2">{row.topics}</td>
                        <td className="py-2">{row.subtopics}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-semibold">Subjects with Most Coverage</div>
                    <div className="text-xs text-gray-500">Top subjects by subtopic count</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {topSubjects.map((subject) => (
                    <li key={subject.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                      <div className="text-sm font-medium text-gray-800">{subject.name}</div>
                      <div className="text-xs text-gray-500">{subject.category}</div>
                      <div className="mt-1 text-xs text-gray-500">{subject.topics} topics • {subject.subtopics} subtopics</div>
                    </li>
                  ))}
                  {topSubjects.length === 0 && <li className="text-sm text-gray-500">No subjects yet.</li>}
                </ul>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-semibold">Topics with Deep Coverage</div>
                    <div className="text-xs text-gray-500">Top topics by subtopics</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {topTopics.map((topic) => (
                    <li key={topic.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                      <div className="text-sm font-medium text-gray-800">{topic.title}</div>
                      <div className="text-xs text-gray-500">{topic.subject} • {topic.category}</div>
                      <div className="mt-1 text-xs text-gray-500">{topic.subtopics} subtopics</div>
                    </li>
                  ))}
                  {topTopics.length === 0 && <li className="text-sm text-gray-500">No topics yet.</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface SummaryCardProps {
  icon: React.ReactNode
  title: string
  value: number
}

function SummaryCard({ icon, title, value }: SummaryCardProps) {
  return (
    <div className="card">
      <div className="card-body flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-semibold text-gray-900">{value}</div>
        </div>
        <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">{icon}</div>
      </div>
    </div>
  )
}
