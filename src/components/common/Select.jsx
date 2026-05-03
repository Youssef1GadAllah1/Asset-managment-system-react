export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  disabled = false,
  badge,
  icon,
  size = 'md',
  placeholder = 'Select an option',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-4 py-4 text-base'
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <div className="flex items-center gap-2">
            <span>{icon && <span className="mr-1">{icon}</span>}{label}</span>
            {badge && (
              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                {badge}
              </span>
            )}
          </div>
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full ${sizeClasses[size]} border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 transition-colors hover:border-gray-400 dark:hover:border-gray-500 appearance-none bg-no-repeat bg-right disabled:opacity-50 disabled:cursor-not-allowed pr-10 ${
          error ? 'border-red-500 focus:border-red-500' : ''
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M1 4l5 5 5-5z'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 12px center'
        }}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.id || option.value} value={option.id || option.value}>
            {option.icon && `${option.icon} `}{option.label || option.name}
            {option.department && ` (${option.department})`}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
