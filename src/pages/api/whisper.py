import whisper
import textwrap
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs


class WhisperRequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Get the content length and read the request payload
        # parsed_url = urlparse(self.path)
        # query_params = parse_qs(parsed_url.query)
        # file_name = query_params.get("file_name")[0]
        file_name = "testing.mp3"
        print(file_name)
        # Decode the request payload from bytes to string

        file_path = f"src/uploads/testing.mp3"

        model = whisper.load_model("base")
        result = model.transcribe(file_path, fp16=False, language="English")
        wrapped_text = textwrap.fill(result["text"], width=80, break_long_words=False)
        response_data = f'{{"result": "{wrapped_text}"}}'

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(response_data.encode("utf-8"))
