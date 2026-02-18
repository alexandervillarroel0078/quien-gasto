from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # ============================
    # 📌 BASE DE DATOS
    # ============================
    DB_USER: str = Field(..., env="DB_USER")
    DB_PASSWORD: str = Field(..., env="DB_PASSWORD")
    DB_HOST: str = Field(..., env="DB_HOST")
    DB_PORT: int = Field(..., env="DB_PORT")
    DB_NAME: str = Field(..., env="DB_NAME")

    # ============================
    # 🔐 CONFIGURACIONES DE SEGURIDAD
    # ============================
    SECRET_KEY: str = Field(..., env="SECRET_KEY")

    # ============================
    # ⚙️ ENTORNO
    # ============================
    ENVIRONMENT: str = Field("development", env="ENVIRONMENT")

settings = Settings()
