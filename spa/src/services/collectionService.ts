import apiClient from '../api/client';
import type { Collection, CollectionResponse } from '../models/Collection';

export const getCollections = async (): Promise<CollectionResponse[]> => {
  const response = await apiClient.get<CollectionResponse[]>('/collections/');
  return response.data;
};

export const createCollection = async (collection: Collection): Promise<CollectionResponse> => {
  const response = await apiClient.post<CollectionResponse>('/collections/', collection);
  return response.data;
};

export const getCollection = async (id: number): Promise<CollectionResponse> => {
  const response = await apiClient.get<CollectionResponse>(`/collections/${id}`);
  return response.data;
};

export const updateCollection = async (id: number, collection: Partial<Collection>): Promise<CollectionResponse> => {
  const response = await apiClient.put<CollectionResponse>(`/collections/${id}`, collection);
  return response.data;
};

export const deleteCollection = async (id: number): Promise<void> => {
  await apiClient.delete(`/collections/${id}`);
};
