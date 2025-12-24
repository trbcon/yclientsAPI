class ConversationManager {
  constructor() {
    this.sessions = new Map()
  }

  get(chatId) {
    if (!this.sessions.has(chatId)) {
      this.sessions.set(chatId, {
        ctx: null,
        history: [],
        state: {}
      })
    }
    return this.sessions.get(chatId)
  }

  setContext(chatId, ctx) {
    const session = this.get(chatId)
    session.ctx = ctx
  }

  addMessage(chatId, role, content) {
    const session = this.get(chatId)
    session.history.push({ role, content })

    if (session.history.length > 30) {
      session.history.shift()
    }
  }

  getHistory(chatId) {
    return this.get(chatId).history
  }

  getContext(chatId) {
    return this.get(chatId).ctx
  }

  clear(chatId) {
    this.sessions.delete(chatId)
  }
}

export const conversationManager = new ConversationManager()
