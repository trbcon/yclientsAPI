import { conversationManager } from '../logic/conversation.manager.js'

export const sendToAI = async (chatId, message) => {
  const session = conversationManager.get(chatId)
  const history = session.history

  history.push({ role: 'user', content: message })

  const payload = {
    model: process.env.OPENROUTER_MODEL,
    messages: history,
    temperature: 0.2,
    max_tokens: 800
  }

  const response = await fetch(`${process.env.OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const data = await response.json()
  const content = data.choices[0].message.content.trim()

  history.push({ role: 'assistant', content })

  return content
}
