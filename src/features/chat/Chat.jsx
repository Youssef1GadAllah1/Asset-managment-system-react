import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Button } from '../../components/common'
import { getConversations, getMessages, sendMessage, getAllEmployees, createNotification } from '../../utils/api'
import { Send } from 'lucide-react'

const Avatar = ({ name, image, size = 'md' }) => {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm'

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${sizeClass} rounded-full object-cover shrink-0 border-2 border-primary-200 dark:border-primary-700`}
      />
    )
  }
  return (
    <div className={`${sizeClass} rounded-full bg-primary-600 flex items-center justify-center text-white font-bold shrink-0`}>
      {initials}
    </div>
  )
}

export const Chat = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [conversations, setConversations] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [conversationsData, employeesData] = await Promise.all([
          getConversations(user?.id),
          getAllEmployees()
        ])
        
        const otherUsers = (employeesData || []).filter(emp => emp.email !== user?.email)
        setAllUsers(otherUsers)
        
        const linkedConversations = (conversationsData || []).map(conv => {
          const fullUserData = otherUsers.find(u => u.id === conv.other_user_id)
          return {
            ...conv,
            participant: fullUserData,
            name: fullUserData?.name || 'Unknown',
            role: fullUserData?.role || 'User'
          }
        })
        
        setConversations(linkedConversations)
        if (linkedConversations.length > 0) {
          setSelectedChat(linkedConversations[0])
          await loadMessages(user?.id, linkedConversations[0].other_user_id)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async (userId, otherId) => {
    try {
      const data = await getMessages(userId, otherId)
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (message.trim() && selectedChat) {
      try {
        const otherUserId = selectedChat.other_user_id || selectedChat.id
        await sendMessage({
          sender_id: user?.id,
          receiver_id: otherUserId,
          message: message
        })
        
        await createNotification({
          user_id: otherUserId,
          type: 'message',
          message: `${user?.name} sent you a message: "${message}"`
        })
        
        setMessage('')
        await loadMessages(user?.id, otherUserId)
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }

  const handleSelectChat = async (chat) => {
    const selectedConv = conversations.find(c => c.other_user_id === chat.other_user_id)
    setSelectedChat(selectedConv || chat)
    const otherUserId = chat.other_user_id || chat.id
    await loadMessages(user?.id, otherUserId)
  }

  const handleSelectUser = async (selectedUser) => {
    const chatData = {
      id: selectedUser.id,
      other_user_id: selectedUser.id,
      participant: selectedUser
    }
    setSelectedChat(chatData)
    await loadMessages(user?.id, selectedUser.id)
    setSearchQuery('')
  }

  const filteredUsers = allUsers.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const otherParticipant = selectedChat?.participant || null
  const otherName = otherParticipant?.name || selectedChat?.name || 'Unknown'
  const otherRole = otherParticipant?.role || selectedChat?.role || 'User'
  const otherImage = otherParticipant?.profile_image || null

  if (loading) return <Layout><div className="p-6">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-6 h-[calc(100vh-100px)] flex gap-6 max-w-7xl mx-auto">
        {/* Contacts sidebar */}
        <div className="w-80 hidden lg:block">
          <Card className="h-full flex flex-col p-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                {t('sidebar.chat')}
              </h2>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className={`w-full p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                      selectedChat?.other_user_id === u.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar name={u.name} image={u.profile_image} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{u.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{u.role}</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No users found' : 'No users available'}
                </div>
              )}
            </div>
          </Card>
        </div>

        {selectedChat ? (
          <div className="flex-1 flex flex-col gap-0 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow bg-white dark:bg-gray-900">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <Avatar name={otherName} image={otherImage} size="md" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{otherName}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{otherRole}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length > 0 ? (
                messages.map(msg => {
                  const isOwn = msg.sender_id === user?.id
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <Avatar
                        name={isOwn ? user?.name : otherName}
                        image={isOwn ? (user?.profile_image || null) : otherImage}
                        size="sm"
                      />
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          isOwn
                            ? 'bg-primary-600 text-white rounded-br-sm'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <p className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex gap-3 items-center">
                <Avatar name={user?.name} image={user?.profile_image || null} size="sm" />
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:bg-gray-700 dark:text-gray-100 text-sm"
                />
                <Button onClick={handleSendMessage} className="flex items-center gap-2 px-4">
                  <Send size={17} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Select a user to start messaging</p>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  )
}
