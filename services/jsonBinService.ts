import { API } from "../constants";
import { AdminProject, Transaction } from "../types";

export interface CloudData {
  projects: AdminProject[];
  transactions: Transaction[];
  lastUpdated: string;
}

/**
 * Fetch data dari JSONBin cloud.
 */
export const fetchBin = async (
  binId: string,
  apiKey: string
): Promise<CloudData | null> => {
  const response = await fetch(`${API.JSONBIN_BASE}/${binId}`, {
    method: "GET",
    headers: { "X-Master-Key": apiKey },
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data.record || null;
};

/**
 * Update data di JSONBin cloud.
 */
export const updateBin = async (
  binId: string,
  apiKey: string,
  payload: CloudData
): Promise<boolean> => {
  const response = await fetch(`${API.JSONBIN_BASE}/${binId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  return response.ok;
};

/**
 * Buat Bin baru di JSONBin. Return Bin ID baru.
 */
export const createBin = async (
  apiKey: string,
  payload: CloudData
): Promise<string> => {
  const response = await fetch(API.JSONBIN_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": apiKey,
      "X-Bin-Name": API.JSONBIN_BIN_NAME,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to create bin");
  }

  const data = await response.json();
  return data.metadata.id;
};
