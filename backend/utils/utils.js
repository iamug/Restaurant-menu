const generateId = (start) => {
  const d = new Date();
  return (
    "" +
    start +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999))
  );
};

module.exports = { generateId };
