import { config } from '../config/config.js';

async function makeRequest(endpoint, options = {}, usePartnerOnly = false) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.yclients.v2+json',
    'Authorization': usePartnerOnly
      ? `Bearer ${config.yclients.partnerToken}`
      : `Bearer ${config.yclients.partnerToken}, User ${config.yclients.userToken}`
  };

  const res = await fetch(`${config.yclients.baseUrl}${endpoint}`, { headers, ...options });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

export async function getStaff() {
  return makeRequest(`/staff/${config.yclients.companyId}`);
}

export async function getServices() {
  return makeRequest(`/services/${config.yclients.companyId}`);
}

export async function getAvailableSlots(staffId = null, date = null, days = 7) {
  const from = date || new Date().toISOString().split('T')[0];
  const to = new Date(new Date(from).getTime() + days * 86400000).toISOString().split('T')[0];
  const staffList = await getStaff();
  const filtered = staffId
    ? staffList.data.filter(s => s.id === staffId)
    : staffList.data;

  let result = [];
  for (const s of filtered) {
    const seances = await makeRequest(`/book_staff_seances/${config.yclients.companyId}/${s.id}?from=${from}&to=${to}`);
    if (Array.isArray(seances.data?.days)) {
      seances.data.days.forEach(day => {
        const freeSlots = day.seances
          .filter(slot => slot.busy === false || slot.busy === undefined)
          .map(slot => slot.time);
        if (freeSlots.length) {
          result.push({
            staff_id: s.id,
            staff_name: s.name,
            date: day.date,
            slots: freeSlots
          });
        }
      });
    }
  }
  return { success: true, available_slots: result };
}

export async function createBooking(bookingData) {
  return makeRequest(`/book_record/${config.yclients.companyId}`, {
    method: 'POST',
    body: JSON.stringify(bookingData)
  });
}
