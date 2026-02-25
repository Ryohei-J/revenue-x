const FRANKFURTER_URL =
  "https://api.frankfurter.dev/v1/latest?base=USD&symbols=JPY";

export type ExchangeRateResult = {
  rate: number;
  date: string;
};

export async function fetchUSDJPYRate(): Promise<ExchangeRateResult> {
  const res = await fetch(FRANKFURTER_URL);
  if (!res.ok) throw new Error(`Exchange rate fetch failed: ${res.status}`);
  const data = await res.json();
  return {
    rate: data.rates.JPY as number,
    date: data.date as string,
  };
}
