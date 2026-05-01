export const Button = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer'
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
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
}

export const Input = ({ 
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
        className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100 transition-colors ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

export const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  }

  const statusVariants = {
    available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    in_use: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    retired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    pending: 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-100',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  }

  const styles = statusVariants[variant] || variants[variant] || variants.default

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${styles}`}>
      {children}
    </span>
  )
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${sizes[size]} w-full`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      ))}
    </div>
  )
}

export const Table = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {row[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-sm space-x-3 flex">
                  <button
                    onClick={() => onEdit && onEdit(row)}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(row)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
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
}

export const Toast = ({ message, type = 'info', onClose }) => {
  const types = {
    success: 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-200',
    error: 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-200',
    warning: 'bg-accent-50 border-accent-500 text-accent-800 dark:bg-accent-900/20 dark:border-accent-700 dark:text-accent-200',
    info: 'bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-200',
  }

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 border-l-4 rounded-lg shadow-lg max-w-sm ${types[type]}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <p>{message}</p>
        <button onClick={onClose} className="ml-4 font-bold">
          ×
        </button>
      </div>
    </div>
  )
}
