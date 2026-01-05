// 取得指定日期所在週的星期一
export const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
  return new Date(date.setDate(diff));
};

// 格式化日期為 YYYY-MM-DD (作為 Map 的 key)
export const formatDateKey = (date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// 產生週範圍字串 (例如: 2024/01/01 ~ 01/07)
export const getDateRangeStr = (mondayDate) => {
  const sundayDate = new Date(mondayDate);
  sundayDate.setDate(mondayDate.getDate() + 6);
  
  const format = (d) => {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return { y, m, day };
  };

  const start = format(mondayDate);
  const end = format(sundayDate);

  // 如果跨年，顯示完整年份；否則結束日期省略年份
  const endStr = start.y === end.y 
    ? `${end.m}/${end.day}` 
    : `${end.y}/${end.m}/${end.day}`;

  return `${start.y}/${start.m}/${start.day} ~ ${endStr}`;
};
