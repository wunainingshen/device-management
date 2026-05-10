import { defineStore } from 'pinia'
import axios from '../utils/axios'

export const useChatStore = defineStore('chat', {
  state: () => ({
    friends: [],
    friendRequests: [],
    blacklist: [],
    currentChat: null,
    messages: [],
    unreadCounts: {},
    ws: null,
    connected: false,
    _messageQueue: []
  }),

  actions: {
    async fetchFriends() {
      const res = await axios.get('/api/friend/list')
      if (res.data.code === 200) this.friends = res.data.data
    },

    async fetchRequests() {
      const res = await axios.get('/api/friend/requests')
      if (res.data.code === 200) this.friendRequests = res.data.data
    },

    async fetchBlacklist() {
      const res = await axios.get('/api/friend/blacklist')
      if (res.data.code === 200) this.blacklist = res.data.data
    },

    async sendFriendRequest(receiverId, remark) {
      const res = await axios.post('/api/friend/request', { receiverId, remark })
      if (res.data.code !== 200) throw new Error(res.data.message)
    },

    async handleRequest(requestId, accept) {
      await axios.post(`/api/friend/request/${requestId}/handle?accept=${accept}`)
      await this.fetchRequests()
      if (accept) await this.fetchFriends()
    },

    async deleteFriend(friendId) {
      await axios.delete(`/api/friend/${friendId}`)
      await this.fetchFriends()
    },

    async blockUser(blockedUserId) {
      await axios.post(`/api/friend/block/${blockedUserId}`)
      await this.fetchFriends()
      await this.fetchBlacklist()
    },

    async unblockUser(blockedUserId) {
      await axios.post(`/api/friend/unblock/${blockedUserId}`)
      await Promise.all([this.fetchBlacklist(), this.fetchFriends()])
    },

    async fetchConversation(friendId) {
      const res = await axios.get(`/api/chat/conversation/${friendId}`)
      if (res.data.code === 200) this.messages = res.data.data
    },

    async markAsRead(friendId) {
      try { await axios.post(`/api/chat/read/${friendId}`) }
      catch (e) { console.warn('markAsRead failed', e) }
      this.unreadCounts[friendId] = 0
    },

    async fetchUnreadCounts() {
      const res = await axios.get('/api/chat/unread-counts')
      if (res.data.code === 200) this.unreadCounts = res.data.data
    },

    connectWebSocket(userId) {
      if (this.ws && this.connected) return

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}/ws/chat?userId=${userId}`

      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        this.connected = true
        console.log('WebSocket connected')
        // 重连后刷新好友列表和未读计数，并发送队列中的消息
        this.fetchFriends()
        this.fetchUnreadCounts()
        this._flushQueue()
      }

      this.ws.onmessage = event => {
        const data = JSON.parse(event.data)
        this.handleWsMessage(data)
      }

      this.ws.onclose = () => {
        this.connected = false
        console.log('WebSocket disconnected')
        setTimeout(() => this.connectWebSocket(userId), 2000)
      }

      this.ws.onerror = error => {
        console.error('WebSocket error:', error)
      }
    },

    _flushQueue() {
      if (this._messageQueue.length > 0) {
        const queue = [...this._messageQueue]
        this._messageQueue = []
        queue.forEach(msg => this._doSend(msg))
      }
    },

    _doSend(msg) {
      if (this.ws && this.connected) {
        this.ws.send(JSON.stringify(msg))
        return true
      }
      return false
    },

    handleWsMessage(data) {
      switch (data.type) {
        case 'CHAT':
          if (data.senderId === this.getCurrentUserId()) return
          // 避免重复添加（可能通过 fetchConversation 已加载）
          const exist = this.messages.find(m => m.id === data.id)
          if (exist) return
          this.messages.push(data)
          if (this.currentChat && data.senderId === this.currentChat.friendId) {
            this.unreadCounts[data.senderId] = 0
            this.markAsRead(this.currentChat.friendId)
            this.sendReadReceipt(this.currentChat.friendId)
          } else {
            this.unreadCounts[data.senderId] = (this.unreadCounts[data.senderId] || 0) + 1
          }
          break
        case 'CHAT_ACK':
          const ackIdx = this.messages.findIndex(m => m._temp === true)
          if (ackIdx !== -1) {
            this.messages[ackIdx] = { ...data, isRead: data.isRead || false }
          } else {
            // 去重检查
            const exist = this.messages.find(m => m.id === data.id)
            if (!exist) this.messages.push(data)
          }
          break
        case 'MESSAGE_READ':
          this.messages.forEach(m => {
            if (m.senderId === this.getCurrentUserId() && m.receiverId === data.readBy) {
              m.isRead = true
            }
          })
          if (this.unreadCounts[data.readBy]) this.unreadCounts[data.readBy] = 0
          break
        case 'USER_STATUS':
          const friend = this.friends.find(f => f.friendId === data.userId)
          if (friend) {
            friend.isOnline = data.online
            friend.lastOnlineTime = data.online ? null : new Date().toISOString()
          }
          break
        case 'ERROR':
          console.warn('WS Error:', data.message)
          break
      }
    },

    getCurrentUserId() {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      return user?.id
    },

    sendMessage(receiverId, content) {
      const clientId = 'c' + Date.now() + '-' + Math.random().toString(36).substr(2, 6)
      const userId = this.getCurrentUserId()

      // 乐观更新：立即在本地显示消息（无论 WS 是否连接）
      const tempMsg = {
        id: clientId,
        _clientId: clientId,
        senderId: userId,
        receiverId: receiverId,
        content: content,
        sendTime: new Date().toISOString(),
        isRead: false,
        _temp: true
      }
      this.messages.push(tempMsg)

      const wsMsg = { type: 'CHAT', _clientId: clientId, receiverId, content }

      // 尝试发送，如果 WS 未连接则加入队列
      if (!this._doSend(wsMsg)) {
        this._messageQueue.push(wsMsg)
        console.log('WS not connected, message queued')
      }
    },

    sendTyping(receiverId, isTyping) {
      if (this.ws && this.connected) {
        this.ws.send(JSON.stringify({ type: 'TYPING', receiverId, isTyping }))
      }
    },

    sendReadReceipt(friendId) {
      if (this.ws && this.connected) {
        this.ws.send(JSON.stringify({ type: 'MARK_READ', friendId }))
      }
    },

    disconnectWebSocket() {
      if (this.ws) { this.ws.close(); this.ws = null; this.connected = false }
    }
  }
})
