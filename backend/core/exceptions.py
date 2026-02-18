from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

def validation_exception_handler(request: Request, exc: RequestValidationError):
    first = exc.errors()[0]
    return JSONResponse(
        status_code=422,
        content={
            "error": first["msg"],
            "field": first["loc"][-1],  # nombre del campo
        },
    )

def http_exception_handler(request: Request, exc: HTTPException):
    if isinstance(exc.detail, dict):
        return JSONResponse(
            status_code=exc.status_code,
            content=exc.detail,
        )

    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail},
    )
