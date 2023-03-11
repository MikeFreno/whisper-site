import whisper
import textwrap
import sys

def whisper_execution(file_content):

    model = whisper.load_model("base")
    result = model.transcribe(file_content, fp16=False, language="English")
    wrapped_text = textwrap.fill(result["text"], width=80, break_long_words=False)
    sys.stdout.write(wrapped_text)


if __name__ == '__main__':
    file_content = sys.stdin.read()
    whisper_execution(file_content)