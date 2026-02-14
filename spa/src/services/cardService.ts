import apiClient from '../api/client';
import type { Card, CardResponse } from '../models/Card';

export const getCardsByCollection = async (collectionId: number): Promise<CardResponse[]> => {
  const response = await apiClient.get<{ cards: CardResponse[] }>(`/collections/${collectionId}/cards/`);
  return response.data.cards;
};

export const createCard = async (card: Card): Promise<CardResponse> => {
  const response = await apiClient.post<CardResponse>('/cards/', card);
  return response.data;
};

export const getCard = async (id: number): Promise<CardResponse> => {
  const response = await apiClient.get<CardResponse>(`/cards/${id}`);
  return response.data;
};

export const updateCard = async (id: number, card: Partial<Card>): Promise<CardResponse> => {
  const response = await apiClient.put<CardResponse>(`/cards/${id}`, card);
  return response.data;
};

export const deleteCard = async (id: number): Promise<void> => {
  await apiClient.delete(`/cards/${id}`);
};
