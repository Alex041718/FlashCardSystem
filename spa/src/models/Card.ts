export interface Card {
    entry: string;
    value: string;
    hint?: string | null;
    collectionId: number;
}

export interface CardResponse extends Card {
    id: number;
    createdOn?: string | null;
}
