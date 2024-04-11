const convertDateTime = (storedDateString) => {
  // const storedDateString = "2024-01-30T14:19:54+0000";
  const storedDate = new Date(storedDateString);

  const year = storedDate.getFullYear();
  const month = String(storedDate.getMonth() + 1).padStart(2, "0");
  const day = String(storedDate.getDate()).padStart(2, "0");
  const hour = String(storedDate.getHours() % 12 || 12).padStart(2, "0");
  const minute = String(storedDate.getMinutes()).padStart(2, "0");
  const period = storedDate.getHours() < 12 ? "AM" : "PM";

  const localDateString = `${year}-${month}-${day} ${hour}:${minute} ${period}`;

  return localDateString;
};

export default convertDateTime;
