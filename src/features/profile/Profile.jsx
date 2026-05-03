import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Input, FileUpload } from '../../components/common'
import { Save, Lock, Upload } from 'lucide-react'
import { changePassword } from '../../utils/api'

export const Profile = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
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
    role: user?.role || '',
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [loadingPassword, setLoadingPassword] = useState(false)

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

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!passwordData.oldPassword) {
      setPasswordError('Current password is required')
      return
    }

    if (!passwordData.newPassword) {
      setPasswordError('New password is required')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    try {
      setLoadingPassword(true)
      await changePassword(passwordData.oldPassword, passwordData.newPassword)
      setPasswordSuccess('Password changed successfully!')
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => {
        setShowChangePassword(false)
        setPasswordSuccess('')
      }, 2000)
    } catch (error) {
      setPasswordError(error.message || 'Failed to change password')
    } finally {
      setLoadingPassword(false)
    }
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
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-40 h-40 rounded-full object-cover border-4 border-primary-500 shadow-lg"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center text-6xl shadow-lg">
                    👤
                  </div>
                )}
              </div>
              <FileUpload
                label="Update Profile Picture"
                accept="image/*"
                maxSize={2 * 1024 * 1024}
                preview={profileImage}
                onUpload={async (file) => {
                  handleImageChange(file)
                }}
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {user?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{user?.email}</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100 rounded-full text-sm font-medium">
                  {roleLabels[user?.role]} Role
                </span>
                {user?.department && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full text-sm font-medium">
                    {user?.department}
                  </span>
                )}
              </div>
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

          {showChangePassword ? (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Change Your Password</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Enter your current password and choose a new one</p>
              </div>

              {passwordError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-300 text-sm">{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-700 dark:text-green-300 text-sm">{passwordSuccess}</p>
                </div>
              )}

              <Input
                label="Current Password"
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                placeholder="Enter your current password"
              />
              <Input
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                placeholder="Enter new password (min 8 characters)"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                placeholder="Confirm your new password"
              />

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={loadingPassword}
                >
                  <Lock size={18} className="ltr:mr-2 rtl:ml-2" />
                  {loadingPassword ? 'Changing...' : 'Change Password'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowChangePassword(false)
                    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
                    setPasswordError('')
                    setPasswordSuccess('')
                  }}
                  disabled={loadingPassword}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : isEditing ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
              <Input
                label="Username"
                value={formData.userName}
                onChange={(e) => setFormData({...formData, userName: e.target.value})}
                disabled
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
                disabled
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
              <div className="flex gap-3">
                <Button onClick={() => setIsEditing(true)} className="flex-1">
                  Edit Profile
                </Button>
                <Button 
                  onClick={() => setShowChangePassword(true)}
                  variant="secondary"
                  className="flex-1"
                >
                  <Lock size={18} className="ltr:mr-2 rtl:ml-2" />
                  Change Password
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </Layout>
  )
}
