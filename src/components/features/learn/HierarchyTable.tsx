import { FiChevronRight, FiEdit2, FiTrash2 } from 'react-icons/fi'

export type HierarchyTableRow = {
  key: string
  cells: string[]
  onSelect?: () => void
}

interface HierarchyTableProps {
  title: string
  columns: string[]
  rows: HierarchyTableRow[]
  selectedKey?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function HierarchyTable({ title, columns, rows, selectedKey, onEdit, onDelete }: HierarchyTableProps) {
  return (
    <div className="border border-gray-200 rounded-2xl shadow-sm bg-white">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
        <h2 className="font-semibold text-gray-800 text-lg">{title}</h2>
        <span className="text-xs text-gray-500">{rows.length} {rows.length === 1 ? 'item' : 'items'}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={col} className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {rows.map(row => (
              <tr key={row.key} className={`hover:bg-gray-50 transition ${selectedKey === row.key ? 'bg-blue-50' : ''}`}>
                {row.cells.slice(0, -1).map((cell, idx) => (
                  <td key={`${row.key}-${idx}`} className="px-4 py-2 text-gray-700">
                    <div className="flex items-center gap-2">
                      {idx === 0 && row.onSelect && (
                        <button onClick={row.onSelect} className="p-1 text-gray-500 hover:text-blue-600" title="View children">
                          <FiChevronRight className="h-4 w-4" />
                        </button>
                      )}
                      <span>{cell}</span>
                    </div>
                  </td>
                ))}

                <td className="px-4 py-2 flex gap-3">
                  <button onClick={() => onEdit && onEdit(row.key)} className="text-blue-600 hover:text-blue-800">
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => onDelete && onDelete(row.key)} className="text-red-600 hover:text-red-800">
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500 text-xs">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
