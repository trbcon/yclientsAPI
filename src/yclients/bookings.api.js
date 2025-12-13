import { config } from '../config/config.js';

export async function createBooking(bookingData) {
  try {
    const endpoint = `${config.yclients.baseUrl}/book_record/${config.yclients.companyId}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.yclients.userToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.yclients.v2+json'
      },
      body: JSON.stringify(bookingData)
    });

    const json = await response.json();

    if (!response.ok) {
      console.error('YCLIENTS API Error:', json);
      throw new Error(JSON.stringify(json));
    }

    return json; 

  } catch (err) {
    console.error('Failed to create booking:', err);
    throw err;
  }
}
