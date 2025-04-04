export const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
    }).format(amount);