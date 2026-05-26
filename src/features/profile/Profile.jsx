import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Button, Input } from '../../components/common'
import { Save, Lock, Upload, Camera, CheckCircle, AlertCircle } from 'lucide-react'
import { changePassword, uploadProfileImage } from '../../utils/api'

export const Profile = () => {
  const { user, updateUser } = useAuth()
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [profileImage, setProfileImage] = useState(user?.profile_image || null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
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

  const handleImageChange = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({ type: 'error', message: 'Image must be under 5MB' })
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target.result
      setProfileImage(base64)
      setUploadStatus({ type: 'loading', message: 'Saving...' })
      try {
        await uploadProfileImage(user.id, base64)
        updateUser({ profile_image: base64 })
        setUploadStatus({ type: 'success', message: 'Profile picture saved!' })
        setTimeout(() => setUploadStatus(null), 3000)
      } catch (err) {
        setUploadStatus({ type: 'error', message: 'Failed to save image' })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false) }
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) handleImageChange(files[0])
  }

  const handleSave = () => setIsEditing(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')
    if (!passwordData.oldPassword) return setPasswordError('Current password is required')
    if (!passwordData.newPassword) return setPasswordError('New password is required')
    if (passwordData.newPassword.length < 8) return setPasswordError('New password must be at least 8 characters')
    if (passwordData.newPassword !== passwordData.confirmPassword) return setPasswordError('Passwords do not match')

    try {
      setLoadingPassword(true)
      await changePassword(passwordData.oldPassword, passwordData.newPassword)
      setPasswordSuccess('Password changed successfully!')
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => { setShowChangePassword(false); setPasswordSuccess('') }, 2000)
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

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {t('common.profile')}
        </h1>

        <Card className="mb-6">
          {/* Profile picture section */}
          <div className="flex flex-col items-center gap-4 pb-8 mb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="relative group">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary-500 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Camera size={28} className="text-white" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files[0])}
            />

            {/* Upload status */}
            {uploadStatus && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                uploadStatus.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                uploadStatus.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {uploadStatus.type === 'success' ? <CheckCircle size={16} /> :
                 uploadStatus.type === 'error' ? <AlertCircle size={16} /> : null}
                {uploadStatus.message}
              </div>
            )}

            {/* Drag & drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full max-w-sm p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Upload size={24} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-primary-600 dark:text-primary-400">Click to upload</span> or drag & drop
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user?.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100 rounded-full text-sm font-medium">
                {roleLabels[user?.role]} Role
              </span>
            </div>
          </div>

          {showChangePassword ? (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Change Your Password</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Enter your current password and choose a new one</p>
              </div>
              {passwordError && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"><p className="text-red-700 dark:text-red-300 text-sm">{passwordError}</p></div>}
              {passwordSuccess && <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"><p className="text-green-700 dark:text-green-300 text-sm">{passwordSuccess}</p></div>}
              <Input label="Current Password" type="password" value={passwordData.oldPassword} onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})} placeholder="Enter your current password" />
              <Input label="New Password" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} placeholder="Min 8 characters" />
              <Input label="Confirm New Password" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} placeholder="Confirm new password" />
              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={loadingPassword}>
                  <Lock size={18} className="ltr:mr-2 rtl:ml-2" />
                  {loadingPassword ? 'Changing...' : 'Change Password'}
                </Button>
                <Button type="button" variant="secondary" className="flex-1" onClick={() => { setShowChangePassword(false); setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' }); setPasswordError(''); setPasswordSuccess('') }} disabled={loadingPassword}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : isEditing ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-6">
              <Input label="Username" value={formData.userName} onChange={(e) => setFormData({...formData, userName: e.target.value})} disabled />
              <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled />
              <Input label="Phone Number" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
              <Input label="Job Title" value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} />
              <div className="flex gap-3">
                <Button type="submit" className="flex-1"><Save size={18} className="ltr:mr-2 rtl:ml-2" />{t('common.save')}</Button>
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsEditing(false)}>{t('common.cancel')}</Button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {[
                  { label: 'Username', value: formData.userName },
                  { label: 'Full Name', value: formData.name },
                  { label: 'Email', value: formData.email },
                  { label: 'Phone Number', value: formData.phoneNumber },
                  { label: 'Job Title', value: formData.jobTitle },
                  { label: 'Role', value: formData.role },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">{value || '—'}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setIsEditing(true)} className="flex-1">Edit Profile</Button>
                <Button onClick={() => setShowChangePassword(true)} variant="secondary" className="flex-1">
                  <Lock size={18} className="ltr:mr-2 rtl:ml-2" />Change Password
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </Layout>
  )
}
