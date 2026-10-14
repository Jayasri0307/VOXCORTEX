from fastapi import APIRouter
from app.config import settings
from app.models.schemas import StatsResponse, utcnow
from app.services.lyzr_service import lyzr_service
from app.services.qdrant_service import qdrant_service
from app.services.storage import storage

router = APIRouter(tags=["Health & Stats"])


@router.get("/health")
@router.get("/api/health")
@router.get("/api/memory/health")
def get_health():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "lyzr_configured": not bool(settings.missing_lyzr_vars()),
        "qdrant_configured": qdrant_service.is_configured(),
        "timestamp": utcnow()
    }


@router.get("/api/integrations/status")
def get_integrations_status():
    lyzr_missing = settings.missing_lyzr_vars()
    qdrant_missing = settings.missing_qdrant_vars()
    has_omi_secret = bool(settings.omi_secret_effective)
    
    return {
        "lyzr": {
            "configured": len(lyzr_missing) == 0,
            "status": "connected" if len(lyzr_missing) == 0 else "unconfigured",
            "missing_vars": lyzr_missing,
            "agents": {
                "manager": bool(settings.LYZR_MANAGER_AGENT_ID),
                "summarizer": bool(settings.LYZR_SUMMARIZER_AGENT_ID),
                "task_extractor": bool(settings.LYZR_TASK_AGENT_ID),
                "memory_assistant": bool(settings.LYZR_MEMORY_AGENT_ID)
            }
        },
        "qdrant": {
            "configured": qdrant_service.is_configured(),
            "status": "connected" if qdrant_service.is_configured() else "unconfigured",
            "collection": settings.QDRANT_COLLECTION,
            "vector_dimension": settings.EMBEDDING_DIMENSION
        },
        "omi": {
            "configured": True,
            "webhook_path": "/omi/conversation",
            "auth_enforced": has_omi_secret,
            "status": "ready"
        },
        "timestamp": utcnow()
    }


@router.get("/api/stats", response_model=StatsResponse)
def get_stats():
    mems = storage.list_memories(settings.DEFAULT_USER_ID)
    tasks = storage.list_tasks(settings.DEFAULT_USER_ID)
    execs = storage.list_executions(settings.DEFAULT_USER_ID, limit=200)

    pending = sum(1 for t in tasks if t.status != "completed")
    completed = sum(1 for t in tasks if t.status == "completed")
    q_answered = sum(1 for e in execs if e.workflow_type == "chat_query" and e.status == "completed")
    failed = sum(1 for e in execs if e.status == "failed")

    return StatsResponse(
        memories=len(mems),
        conversations=len(mems),
        tasks_total=len(tasks),
        tasks_pending=pending,
        tasks_completed=completed,
        questions_answered=q_answered,
        workflows_failed=failed
    )
