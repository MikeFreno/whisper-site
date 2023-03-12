from sanic import Sanic
from sanic.response import json
import whisper
import textwrap
import sys

app = Sanic(__name__)


@app.post("/whisper")
async def whisper_endpoint(request):
    file_content = request.body.decode()
    model = whisper.load_model("base")
    result = model.transcribe(
        f"/src/uploads/{file_content}", fp16=False, language="English"
    )
    wrapped_text = textwrap.fill(result["text"], width=80, break_long_words=False)
    return json(body=wrapped_text, status=200)
