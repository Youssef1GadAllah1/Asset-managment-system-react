import { useState, useRef } from 'react'

export const FileUpload = ({
  label,
  onUpload,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  preview,
  error,
  disabled = false,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(preview)
  const [uploadError, setUploadError] = useState(error)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize) {
      setUploadError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    // Validate file type
    if (accept !== '*' && !file.type.startsWith(accept.split('/')[0])) {
      setUploadError(`File type must be ${accept}`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload
    setUploading(true)
    setUploadError(null)
    try {
      await onUpload(file)
    } catch (err) {
      setUploadError(err.message || 'Upload failed')
      setPreviewUrl(preview)
    } finally {
      setUploading(false)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-4">
        {previewUrl && (
          <div className="relative w-24 h-24 flex-shrink-0">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-24 h-24 rounded-lg object-cover border-2 border-gray-300 dark:border-gray-600"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex-1">
          <button
            type="button"
            onClick={handleClick}
            disabled={disabled || uploading}
            className="px-4 py-2 border-2 border-dashed border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg hover:border-primary-600 dark:hover:border-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Choose File'}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Max size: {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        </div>
      </div>

      {uploadError && (
        <p className="mt-2 text-sm text-red-500">{uploadError}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="hidden"
      />
    </div>
  )
}
