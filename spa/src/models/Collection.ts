export interface Collection {
    name: string;
    isFavorite?: boolean | null;
    color?: string | null;
}

export interface CollectionResponse extends Collection {
    id: number;
    createdOn?: string | null;
}
