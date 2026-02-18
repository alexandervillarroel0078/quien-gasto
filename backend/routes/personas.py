from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.models import Persona
from schemas.persona import PersonaResponse

router = APIRouter(prefix="/personas", tags=["Personas"])

@router.get("/", response_model=list[PersonaResponse])
def listar(db: Session = Depends(get_db)):
    return db.query(Persona).filter(Persona.activo == True).all()
