import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Layout } from '../../components/layout/Layout'
import { Card, Button } from '../../components/common'
import { getConversations, getMessages, sendMessage, getAllEmployees, createNotification } from '../../utils/api'
import { Send, Smile } from 'lucide-react'

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [conversationsData, employeesData] = await Promise.all([
          getConversations(user?.id),
          getAllEmployees()
        ])
        
        const otherUsers = (employeesData || []).filter(emp => emp.email !== user?.email)
        setAllUsers(otherUsers)
        
        // Link conversations with full user data
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

  if (loading) return <Layout><div className="p-6">Loading...</div></Layout>

  return (
    <Layout>
      <div className="p-6 h-[calc(100vh-100px)] flex gap-6 max-w-7xl mx-auto">
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
                      <span className="text-3xl">👤</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{u.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{u.role}</p>
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
          <div className="flex-1 flex flex-col gap-6">
            <Card className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">👤</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {selectedChat.participant?.name || selectedChat.name || 'Unknown'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedChat.participant?.role || selectedChat.role || 'User'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="flex-1 flex flex-col overflow-hidden p-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length > 0 ? (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          msg.sender_id === user?.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender_id === user?.id ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="flex items-center space-x-2"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </Card>
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
