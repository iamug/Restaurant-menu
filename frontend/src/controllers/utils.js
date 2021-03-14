export const formatAmount = (amount = 0) => {
  return (
    "NGN " +
    parseFloat(amount)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  );
};
