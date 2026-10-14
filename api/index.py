"""Vercel Serverless Function entrypoint for VoxCortex AI backend."""
import os
import sys
from pathlib import Path

# Add the backend directory to sys.path so app modules import properly
backend_dir = Path(__file__).resolve().parent.parent / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Set Vercel marker for /tmp storage directory
os.environ.setdefault("VERCEL", "1")

from app.main import app

__all__ = ["app"]
