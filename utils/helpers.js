module.exports = {
  format_date: (date) => {
    const newDate = new Date(date);
    const month = newDate.getMonth() + 1; // months are zero-indexed (0-11)
    const day = newDate.getDate();
    const year = newDate.getFullYear();

    const hours = newDate.getHours().toString().padStart(2, "0"); // Pad with 0 for single-digit hours
    const minutes = newDate.getMinutes().toString().padStart(2, "0"); // Pad with 0 for single-digit minutes
    const seconds = newDate.getSeconds().toString().padStart(2, "0"); // Pad with 0 for single-digit seconds

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  },
};
