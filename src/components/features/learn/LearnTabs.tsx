import type { LearnTab } from './types'

interface LearnTabsProps {
  activeTab: LearnTab
  onChange: (tab: LearnTab) => void
}

const tabs: LearnTab[] = ['categories', 'subjects', 'topics', 'subtopics']

const LABELS: Record<LearnTab, string> = {
  categories: 'Categories',
  subjects: 'Subjects',
  topics: 'Topics',
  subtopics: 'Subtopics',
}

export default function LearnTabs({ activeTab, onChange }: LearnTabsProps) {
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`btn-secondary ${activeTab === tab ? '!bg-blue-100 !text-blue-700' : ''}`}
          onClick={() => onChange(tab)}
        >
          {LABELS[tab]}
        </button>
      ))}
    </div>
  )
}
