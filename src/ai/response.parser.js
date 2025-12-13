export function parseLLMResponse(raw) {
  try {
    // raw can be { choices: [{ message: { content } }] }
    const content = raw?.choices?.[0]?.message?.content;

    if (!content) throw new Error('No content in LLM response');

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.warn('LLM response is not valid JSON, returning raw content');
      parsed = { intent: 'small_talk', data: { message: content } };
    }

    return parsed;
  } catch (err) {
    console.error('Failed to parse LLM response:', err);
    return { intent: 'small_talk', data: { message: 'Я тебя понял 😎' } };
  }
}
