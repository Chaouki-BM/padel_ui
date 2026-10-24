import {
  asNumber,
  asRecord,
  asString,
  unwrapList,
  unwrapOne,
} from "@/lib/api-unwrap";
import { apiFetch } from "@/services/api";

export type WalletTx = {
  id: string;
  type: string;
  amount: number;
  tokens: number;
  createdAt: string;
  label: string;
};

export type WalletSummary = {
  balance: number;
  transactions: WalletTx[];
};

export type TokenPurchaseResult = {
  paymentId: string | null;
  status: string;
};

function mapTx(rawUnknown: unknown): WalletTx {
  const raw = asRecord(rawUnknown);
  return {
    id: asString(raw.id),
    type: asString(raw.type, asString(raw.kind, "TX")),
    amount: asNumber(raw.amount, 0),
    tokens: asNumber(raw.tokens, asNumber(raw.quantity, 0)),
    createdAt: asString(raw.createdAt),
    label: asString(raw.label, asString(raw.description, asString(raw.type, "Mouvement"))),
  };
}

export async function getWallet(): Promise<WalletSummary> {
  const payload = await apiFetch<unknown>("/me/wallet");
  const raw = asRecord(unwrapOne(payload));
  const txs = Array.isArray(raw.transactions)
    ? raw.transactions
    : Array.isArray(raw.items)
      ? raw.items
      : unwrapList(payload);
  return {
    balance: asNumber(raw.balance, asNumber(raw.tokens, 0)),
    transactions: txs.map(mapTx),
  };
}

export async function purchaseTokens(
  tokens: number,
): Promise<TokenPurchaseResult> {
  const payload = await apiFetch<unknown>("/me/wallet/purchases", {
    method: "POST",
    body: JSON.stringify({ tokens }),
  });
  const raw = asRecord(unwrapOne(payload));
  return {
    paymentId:
      raw.paymentId === null || raw.paymentId === undefined
        ? null
        : asString(raw.paymentId),
    status: asString(raw.status, "PENDING"),
  };
}
