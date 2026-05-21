export const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export const generateOrderId = () => {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PED-${randomPart}`;
};
