import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone

async def seed_database():
    """Adiciona presentes de exemplo ao banco de dados"""
    
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'test_database')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Verifica se já existem presentes
    existing_count = await db.gifts.count_documents({})
    if existing_count > 0:
        print(f"Banco já possui {existing_count} presente(s). Pulando seed.")
        return
    
    # Presentes de exemplo
    sample_gifts = [
        {
            "id": "gift-001",
            "name": "Jogo de Panelas Inox 5 Peças",
            "image_url": "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&h=800&fit=crop",
            "is_selected": False,
            "selected_by": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "gift-002",
            "name": "Jogo de Facas Profissionais",
            "image_url": "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&h=800&fit=crop",
            "is_selected": False,
            "selected_by": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "gift-003",
            "name": "Aparelho de Jantar 20 Peças",
            "image_url": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=800&fit=crop",
            "is_selected": False,
            "selected_by": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "gift-004",
            "name": "Liquidificador de Alta Potência",
            "image_url": "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&h=800&fit=crop",
            "is_selected": False,
            "selected_by": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "gift-005",
            "name": "Jogo de Taças de Cristal",
            "image_url": "https://images.unsplash.com/photo-1547328389-6655a71ea3d5?w=800&h=800&fit=crop",
            "is_selected": False,
            "selected_by": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": "gift-006",
            "name": "Cafeteira Elétrica",
            "image_url": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&h=800&fit=crop",
            "is_selected": False,
            "selected_by": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    # Insere os presentes
    result = await db.gifts.insert_many(sample_gifts)
    print(f"✓ {len(result.inserted_ids)} presentes de exemplo adicionados com sucesso!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
