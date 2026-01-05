export const parseICS = (content) => {
  const events = {};
  const lines = content.split(/\r\n|\n|\r/);
  let inEvent = false;
  let currentDate = null;
  let currentSummary = null;

  lines.forEach(line => {
    if (line.startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      currentDate = null;
      currentSummary = null;
    } else if (line.startsWith('END:VEVENT')) {
      if (inEvent && currentDate && currentSummary) {
        if (!events[currentDate]) events[currentDate] = [];
        events[currentDate].push(currentSummary);
      }
      inEvent = false;
    } else if (inEvent) {
      if (line.startsWith('DTSTART')) {
        const parts = line.split(':');
        if (parts.length > 1) {
          let dateStr = parts[1].trim(); 
          if (dateStr.length >= 8) {
            const y = dateStr.substring(0, 4);
            const m = dateStr.substring(4, 6);
            const d = dateStr.substring(6, 8);
            currentDate = `${y}-${m}-${d}`;
          }
        }
      } else if (line.startsWith('SUMMARY')) {
        const parts = line.split(':');
        if (parts.length > 1) {
          currentSummary = parts.slice(1).join(':').trim();
        }
      }
    }
  });
  return events;
};