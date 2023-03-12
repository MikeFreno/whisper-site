from sanic import Sanic
from sanic.response import json, text
import whisper
import textwrap
import os

app = Sanic()


@app.post("/api/whisper")
async def index(request):
    file_content = request.body.decode()
    model = whisper.load_model("base")
    result = model.transcribe(
        f"/src/uploads/{file_content}", fp16=False, language="English"
    )
    wrapped_text = textwrap.fill(result["text"], width=80, break_long_words=False)
    os.remove(f"/src/uploads/{file_content}")
    return json({wrapped_text})
