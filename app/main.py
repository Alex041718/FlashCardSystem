from typing import Union, List
import os
import sqlite3

from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI()
router = APIRouter()

def get_db():
    db = sqlite3.connect("db.db", check_same_thread=False)
    db.row_factory = sqlite3.Row # Return results as dict-like objects
    try:
        yield db
    finally:
        db.close()

### Models

class Collection(BaseModel):
    name: str
    isFavorite: Union[bool, None] = None
    color: Union[str, None] = None

class CollectionResponse(Collection):
    id: int
    createdOn: Union[str, None] = None

class Card(BaseModel):
    entry: str
    value: str
    hint: Union[str, None] = None
    collectionId: int

class CardResponse(Card):
    id: int
    createdOn: Union[str, None] = None

### Collections Endpoints

@router.get("/collections/", tags=["Collections"])
def get_collections(db: sqlite3.Connection = Depends(get_db)):
    """Retrieve all collections."""
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Collections")
    collections = [dict(row) for row in cursor.fetchall()]
    return {"collections": collections}

@router.post("/collections/", tags=["Collections"])
def create_collection(collection: Collection, db: sqlite3.Connection = Depends(get_db)):
    """Create a new collection."""
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO Collections (name, isFavorite, color) VALUES (?, ?, ?)",
        (collection.name, collection.isFavorite, collection.color)
    )
    db.commit()
    new_id = cursor.lastrowid
    return {"id": new_id, "message": "Collection created successfully"}

@router.get("/collections/{collection_id}", tags=["Collections"])
def get_collection(collection_id: int, db: sqlite3.Connection = Depends(get_db)):
    """Retrieve a specific collection by ID."""
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Collections WHERE id = ?", (collection_id,))
    collection = cursor.fetchone()
    if collection is None:
        raise HTTPException(status_code=404, detail="Collection not found")
    return dict(collection)

@router.put("/collections/{collection_id}", tags=["Collections"])
def update_collection(collection_id: int, collection: Collection, db: sqlite3.Connection = Depends(get_db)):
    """Update an existing collection."""
    cursor = db.cursor()
    # Check if exists
    cursor.execute("SELECT id FROM Collections WHERE id = ?", (collection_id,))
    if cursor.fetchone() is None:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    cursor.execute(
        "UPDATE Collections SET name = ?, isFavorite = ?, color = ? WHERE id = ?",
        (collection.name, collection.isFavorite, collection.color, collection_id)
    )
    db.commit()
    return {"message": "Collection updated successfully"}

@router.delete("/collections/{collection_id}", tags=["Collections"])
def delete_collection(collection_id: int, db: sqlite3.Connection = Depends(get_db)):
    """Delete a collection."""
    cursor = db.cursor()
    cursor.execute("DELETE FROM Collections WHERE id = ?", (collection_id,))
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Collection not found")
    db.commit()
    return {"message": "Collection deleted successfully"}

@router.get("/collections/{collection_id}/cards/", tags=["Collections"])
def get_cards_by_collection(collection_id: int, db: sqlite3.Connection = Depends(get_db)):
    """Retrieve all cards in a specific collection."""
    cursor = db.cursor()
    # Verify collection exists (optional but good practice)
    cursor.execute("SELECT id FROM Collections WHERE id = ?", (collection_id,))
    if cursor.fetchone() is None:
        raise HTTPException(status_code=404, detail="Collection not found")

    cursor.execute("SELECT * FROM Cards WHERE collectionId=?", (collection_id,))
    cards = [dict(row) for row in cursor.fetchall()]
    return {"cards": cards}

### Cards Endpoints

@router.post("/cards/", tags=["Cards"])
def create_card(card: Card, db: sqlite3.Connection = Depends(get_db)):
    """Create a new card."""
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO Cards (entry, value, hint, collectionId) VALUES (?, ?, ?, ?)",
        (card.entry, card.value, card.hint, card.collectionId)
    )
    db.commit()
    new_id = cursor.lastrowid
    return {"id": new_id, "message": "Card created successfully"}

@router.get("/cards/{card_id}", tags=["Cards"])
def get_card(card_id: int, db: sqlite3.Connection = Depends(get_db)):
    """Retrieve a specific card by ID."""
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Cards WHERE id = ?", (card_id,))
    card = cursor.fetchone()
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return dict(card)

@router.put("/cards/{card_id}", tags=["Cards"])
def update_card(card_id: int, card: Card, db: sqlite3.Connection = Depends(get_db)):
    """Update an existing card."""
    cursor = db.cursor()
    cursor.execute("SELECT id FROM Cards WHERE id = ?", (card_id,))
    if cursor.fetchone() is None:
        raise HTTPException(status_code=404, detail="Card not found")

    cursor.execute(
        "UPDATE Cards SET entry = ?, value = ?, hint = ?, collectionId = ? WHERE id = ?",
        (card.entry, card.value, card.hint, card.collectionId, card_id)
    )
    db.commit()
    return {"message": "Card updated successfully"}

@router.delete("/cards/{card_id}", tags=["Cards"])
def delete_card(card_id: int, db: sqlite3.Connection = Depends(get_db)):
    """Delete a card."""
    cursor = db.cursor()
    cursor.execute("DELETE FROM Cards WHERE id = ?", (card_id,))
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Card not found")
    db.commit()
    return {"message": "Card deleted successfully"}

app.include_router(router, prefix="/api")

# Serve static files in production (when dist/ folder exists)
DIST_DIR = "dist"
if os.path.exists(DIST_DIR):
    # Mount static files (JS, CSS, images, etc.)
    app.mount("/assets", StaticFiles(directory=f"{DIST_DIR}/assets"), name="static")

    # Serve index.html for all other routes (SPA routing)
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve the React SPA for all non-API routes."""
        # Check if file exists in dist/
        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        # Otherwise, serve index.html (for client-side routing)
        return FileResponse(f"{DIST_DIR}/index.html")
