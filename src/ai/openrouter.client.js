import fetch from 'node-fetch'
import { conversationManager } from '../logic/conversation.manager.js'

const API_KEY = process.env.OPENROUTER_API_KEY
const BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
const MODEL = process.env.OPENROUTER_MODEL

if (!API_KEY) {
  throw new Error('OPENROUTER_API_KEY is missing')
}

if (!MODEL) {
  throw new Error('OPENROUTER_MODEL is missing')
}

export async function sendToAI(chatId, message) {
  let history = conversationManager.get(chatId)

  // 🔒 ЖЕЛЕЗНАЯ ЗАЩИТА
  if (!Array.isArray(history)) {
    history = []
  }

  const messages = [
    { role: 'system', content: 'Ты дружелюбный Telegram-бот.' },
    ...history,
    { role: 'user', content: message }
  ]

  let response
  let data

  try {
    response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost',
        'X-Title': 'Telegram Bot'
      },
      body: JSON.stringify({
        model: MODEL,
        messages
      })
    })
  } catch (err) {
    console.error('OpenRouter fetch error:', err)
    return '⚠️ Не удалось подключиться к AI'
  }

  try {
    data = await response.json()
  } catch (err) {
    console.error('OpenRouter JSON parse error')
    return '⚠️ Некорректный ответ от AI'
  }

  if (!response.ok) {
    console.error('OpenRouter HTTP error:', response.status, data)
    return '⚠️ Ошибка AI сервиса'
  }

  if (!data?.choices || !Array.isArray(data.choices) || !data.choices.length) {
    console.error('OpenRouter invalid response:', data)
    return '⚠️ Пустой ответ от AI'
  }

  const content = data.choices[0]?.message?.content?.trim()

  if (!content) {
    console.error('OpenRouter empty content:', data)
    return '⚠️ AI вернул пустой ответ'
  }

  // сохраняем историю ТОЛЬКО ПОСЛЕ успешного ответа
  conversationManager.addMessage(chatId, 'user', message)
  conversationManager.addMessage(chatId, 'assistant', content)

  return content
}
