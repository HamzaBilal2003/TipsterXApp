function formatAmount(amount: number | string): string {
    return Number(amount).toLocaleString("en-US");
}

export default formatAmount;
