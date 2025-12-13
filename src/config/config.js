import dotenv from 'dotenv';

dotenv.config();

function required(name) {
  if (!process.env[name]) {
    throw new Error(`❌ ENV ${name} is required`);
  }
  return process.env[name];
}

export const config = {
  env: process.env.NODE_ENV || 'development',

  telegram: {
    token: required('TG_TOKEN'),
  },

  openrouter: {
    apiKey: required('OPENROUTER_API_KEY'),
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'openai/gpt-4o-mini',
  },

  yclients: {
    apiToken: required('YCLIENTS_TOKEN'),
    baseUrl: 'https://api.yclients.com/api/v1',
  },
};
