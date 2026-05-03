import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Input } from '../../components/common'
import { Save, Upload } from 'lucide-react'

export const Profile = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem(`userProfileImage_${user?.id || user?.userName}`) || null
  )
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    userName: user?.userName || user?.username || '',
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    jobTitle: user?.jobTitle || '',
    email: user?.email || '',
    password: user?.password || '',
    role: user?.role || '',
  })

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target.result
        setProfileImage(imageData)
        localStorage.setItem(`userProfileImage_${user?.id || user?.userName}`, imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleImageChange(files[0])
    }
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleImageChange(files[0])
    }
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const roleLabels = {
    user: 'Regular User',
    asset_manager: 'Asset Manager',
    admin: 'Administrator',
  }

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {t('common.profile')}
        </h1>

        <Card className="mb-6">
          <div className="flex items-center space-x-6 mb-8">
            <div className="flex flex-col items-center">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl">
                  👤
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline"
              >
                Change Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100 rounded-full text-sm font-medium">
                {roleLabels[user?.role]}
              </span>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mb-6 p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
              isDragging
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <Upload size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              Drag and drop your profile image here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline font-medium"
              >
                click to select
              </button>
            </p>
          </div>

          {isEditing ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
              <Input
                label="Username"
                value={formData.userName}
                onChange={(e) => setFormData({...formData, userName: e.target.value})}
              />
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <Input
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
              <Input
                label="Job Title"
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
              />
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Role</p>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {formData.role}
                </p>
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  <Save size={18} className="ltr:mr-2 rtl:ml-2" />
                  {t('common.save')}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Username</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {formData.userName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {formData.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {formData.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone Number</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {formData.phoneNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Job Title</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {formData.jobTitle}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {formData.role}
                  </p>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </>
          )}
        </Card>
      </div>
    </Layout>
  )
}
