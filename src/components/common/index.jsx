import { memo } from 'react'
export { Select } from './Select'
export { FileUpload } from './FileUpload'

export const Button = memo(({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  ...props
}) => {
  const baseStyles = 'btn-press font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer'

  const variants = {
    primary:   'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-sm hover:shadow-md hover:shadow-primary-200 dark:hover:shadow-none',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500 shadow-sm hover:shadow-md',
    accent:    'bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-500 shadow-sm hover:shadow-md',
    outline:   'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500',
    danger:    'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow-md',
    ghost:     'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = 'Button'

export const Input = memo(({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
          focus:border-primary-500 focus:ring-primary-500 focus:ring-2 focus:ring-offset-0
          dark:bg-gray-800 dark:text-gray-100
          transition-all duration-200
          hover:border-primary-400 dark:hover:border-primary-500
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
})
Input.displayName = 'Input'

export const Card = memo(({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6
        border border-transparent hover:border-gray-100 dark:hover:border-gray-700
        transition-all duration-300
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})
Card.displayName = 'Card'

export const Badge = memo(({ children, variant = 'default' }) => {
  const variants = {
    default:  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
    primary:  'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100',
    success:  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    warning:  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    danger:   'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    info:     'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  }

  const statusVariants = {
    available:   'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    in_use:      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    retired:     'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    pending:     'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-100',
    completed:   'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  }

  const styles = statusVariants[variant] || variants[variant] || variants.default

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${styles}`}>
      {children}
    </span>
  )
})
Badge.displayName = 'Badge'

export const Modal = memo(({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`modal-content bg-white dark:bg-gray-800 rounded-2xl shadow-2xl ${sizes[size]} w-full`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full
              text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition-all duration-200 text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
})
Modal.displayName = 'Modal'

export const LoadingSkeleton = memo(() => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-16 shimmer rounded-xl" />
      ))}
    </div>
  )
})
LoadingSkeleton.displayName = 'LoadingSkeleton'

export const Table = memo(({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700/60 border-b border-gray-200 dark:border-gray-600">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id ?? idx}
                className="table-row-hover hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-all"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {row[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-sm space-x-3 flex">
                  <button
                    onClick={() => onEdit && onEdit(row)}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300
                      font-medium transition-all duration-150 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(row)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300
                      font-medium transition-all duration-150 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
})
Table.displayName = 'Table'

export const Toast = memo(({ message, type = 'info', onClose }) => {
  const types = {
    success: 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-200',
    error:   'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-200',
    warning: 'bg-accent-50 border-accent-500 text-accent-800 dark:bg-accent-900/20 dark:border-accent-700 dark:text-accent-200',
    info:    'bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-200',
  }

  return (
    <div
      className={`animate-slideDown fixed bottom-4 right-4 p-4 border-l-4 rounded-xl shadow-xl max-w-sm ${types[type]}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <p>{message}</p>
        <button onClick={onClose} className="ml-4 font-bold hover:opacity-70 transition-opacity">×</button>
      </div>
    </div>
  )
})
Toast.displayName = 'Toast'
