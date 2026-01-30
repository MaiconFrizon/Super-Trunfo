from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
import base64
import io
import csv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class Gift(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    image_url: str
    is_selected: bool = False
    selected_by: Optional[dict] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GiftCreate(BaseModel):
    name: str
    image_url: str

class GiftUpdate(BaseModel):
    name: Optional[str] = None
    image_url: Optional[str] = None

class GuestSelection(BaseModel):
    first_name: str
    last_name: str
    contact: str
    message: Optional[str] = None

class AdminLogin(BaseModel):
    password: str

class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ============ AUTH HELPERS ============

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============ ROUTES - PUBLIC ============

@api_router.get("/gifts", response_model=List[Gift])
async def get_gifts():
    """Get all gifts for guest view"""
    gifts = await db.gifts.find({}, {"_id": 0}).to_list(1000)
    
    for gift in gifts:
        if isinstance(gift.get('created_at'), str):
            gift['created_at'] = datetime.fromisoformat(gift['created_at'])
    
    return gifts

@api_router.post("/gifts/{gift_id}/select")
async def select_gift(gift_id: str, selection: GuestSelection):
    """Guest selects a gift"""
    # Check if gift exists and is available
    gift = await db.gifts.find_one({"id": gift_id}, {"_id": 0})
    
    if not gift:
        raise HTTPException(status_code=404, detail="Presente não encontrado")
    
    if gift.get('is_selected'):
        raise HTTPException(status_code=400, detail="Este presente já foi escolhido")
    
    # Update gift with selection
    selection_data = selection.model_dump()
    selection_data['selected_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.gifts.update_one(
        {"id": gift_id},
        {"$set": {
            "is_selected": True,
            "selected_by": selection_data
        }}
    )
    
    return {"message": "Presente selecionado com sucesso!"}

# ============ ROUTES - ADMIN ============

@api_router.post("/admin/login", response_model=AdminToken)
async def admin_login(credentials: AdminLogin):
    """Admin login"""
    # In production, this should check against a hashed password in DB
    # For now, using environment variable
    admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
    
    if credentials.password != admin_password:
        raise HTTPException(status_code=401, detail="Senha incorreta")
    
    token = create_access_token({"role": "admin"})
    return {"access_token": token}

@api_router.get("/admin/gifts", response_model=List[Gift])
async def admin_get_gifts(admin = Depends(verify_admin_token)):
    """Admin view all gifts"""
    gifts = await db.gifts.find({}, {"_id": 0}).to_list(1000)
    
    for gift in gifts:
        if isinstance(gift.get('created_at'), str):
            gift['created_at'] = datetime.fromisoformat(gift['created_at'])
    
    return gifts

@api_router.post("/admin/gifts", response_model=Gift)
async def admin_create_gift(gift_data: GiftCreate, admin = Depends(verify_admin_token)):
    """Admin creates a gift"""
    gift = Gift(**gift_data.model_dump())
    doc = gift.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.gifts.insert_one(doc)
    return gift

@api_router.put("/admin/gifts/{gift_id}", response_model=Gift)
async def admin_update_gift(gift_id: str, gift_data: GiftUpdate, admin = Depends(verify_admin_token)):
    """Admin updates a gift"""
    gift = await db.gifts.find_one({"id": gift_id}, {"_id": 0})
    
    if not gift:
        raise HTTPException(status_code=404, detail="Presente não encontrado")
    
    update_data = {k: v for k, v in gift_data.model_dump().items() if v is not None}
    
    if update_data:
        await db.gifts.update_one({"id": gift_id}, {"$set": update_data})
    
    updated_gift = await db.gifts.find_one({"id": gift_id}, {"_id": 0})
    if isinstance(updated_gift.get('created_at'), str):
        updated_gift['created_at'] = datetime.fromisoformat(updated_gift['created_at'])
    
    return Gift(**updated_gift)

@api_router.delete("/admin/gifts/{gift_id}")
async def admin_delete_gift(gift_id: str, admin = Depends(verify_admin_token)):
    """Admin deletes a gift"""
    result = await db.gifts.delete_one({"id": gift_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Presente não encontrado")
    
    return {"message": "Presente removido com sucesso"}

@api_router.get("/admin/export")
async def admin_export_data(admin = Depends(verify_admin_token)):
    """Export all data as CSV"""
    gifts = await db.gifts.find({}, {"_id": 0}).to_list(1000)
    
    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Headers
    writer.writerow(['Nome do Presente', 'Status', 'Escolhido por', 'Contato', 'Mensagem', 'Data de Seleção'])
    
    # Data
    for gift in gifts:
        if gift.get('is_selected') and gift.get('selected_by'):
            sel = gift['selected_by']
            writer.writerow([
                gift['name'],
                'Escolhido',
                f"{sel.get('first_name', '')} {sel.get('last_name', '')}",
                sel.get('contact', ''),
                sel.get('message', ''),
                sel.get('selected_at', '')
            ])
        else:
            writer.writerow([
                gift['name'],
                'Disponível',
                '',
                '',
                '',
                ''
            ])
    
    output.seek(0)
    
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode('utf-8-sig')),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=presentes.csv"}
    )

@api_router.post("/admin/upload")
async def upload_image(file: UploadFile = File(...), admin = Depends(verify_admin_token)):
    """Upload image and return base64 data URL"""
    # Read file content
    content = await file.read()
    
    # Convert to base64
    base64_data = base64.b64encode(content).decode('utf-8')
    
    # Determine mime type
    mime_type = file.content_type or 'image/jpeg'
    
    # Return data URL
    data_url = f"data:{mime_type};base64,{base64_data}"
    
    return {"url": data_url}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
