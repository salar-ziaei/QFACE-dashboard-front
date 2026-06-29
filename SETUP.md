# QFACE React Frontend — Setup

## 1. Build
```bash
cd frontend
npm install
npm run build
# Output goes to ../qface_react_dist/
```

## 2. Copy built files
```bash
cp -r ../qface_react_dist/* static/react/
```
Create `static/react/` folder first if it doesn't exist.

## 3. Add to main_server.py

### Imports (top)
```python
import httpx
from fastapi.responses import Response as FastAPIResponse
from fastapi.staticfiles import StaticFiles
```

### After app creation
```python
# Serve React app
import os
if os.path.exists("static/react"):
    app.mount("/app", StaticFiles(directory="static/react", html=True), name="react")
```

### Add stream proxy (so React can access camera stream through port 8080)
```python
@app.get("/api/proxy/stream")
async def proxy_stream(request: Request):
    user = current_user(request)
    if not user:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    # Stream proxy — forward MJPEG from camera server
    import httpx
    async def stream_gen():
        async with httpx.AsyncClient() as client:
            async with client.stream("GET", f"{Config.CAMERA_BASE}/video_feed",
                                     headers={"X-Internal-Key": INTERNAL_KEY},
                                     timeout=None) as r:
                async for chunk in r.aiter_bytes(1024):
                    yield chunk
    return StreamingResponse(stream_gen(),
        media_type="multipart/x-mixed-replace;boundary=frame")
```

### Add to existing imports at top
```python
from fastapi.responses import StreamingResponse
```

## 4. Access dashboard
- Old Jinja2 dashboard: http://localhost:8080/dashboard
- New React dashboard:  http://localhost:8080/app

## 5. Development (hot reload)
```bash
cd frontend
npm run dev
# Vite proxies /api to localhost:8080
# Access at http://localhost:5173
```
