#!/usr/bin/env python3
"""
Python Шпаргалка — необязательный локальный лаунчер.

Сайт полностью статический и работает без этого файла: можно просто открыть
index.html или включить GitHub Pages. Лаунчер лишь поднимает локальный сервер
и открывает браузер.

    python3 cheatsheet.py            # macOS / Linux: сервер + браузер
    py cheatsheet.py                 # Windows: сервер + браузер
    python3 cheatsheet.py --port 8080
    python3 cheatsheet.py --static   # просто открыть файл без сервера
"""

import argparse
import threading
import time
import webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HOST = "127.0.0.1"
DEFAULT_PORT = 8765

here = Path(__file__).resolve().parent


def open_browser(url: str, delay: float = 0.4) -> None:
    threading.Timer(delay, webbrowser.open, args=(url,)).start()


def serve(port: int) -> None:
    Handler = partial(SimpleHTTPRequestHandler, directory=str(here))
    server = ThreadingHTTPServer((HOST, port), Handler)

    url = f"http://{HOST}:{port}/index.html"
    print(f"🐍 Python Шпаргалка запущена: {url}")
    print("   Ctrl+C — остановить сервер")
    open_browser(url)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Сервер остановлен")
        server.shutdown()


def static() -> None:
    file = here / "index.html"
    if not file.exists():
        raise SystemExit(f"Не найден {file}. Запусти из папки проекта.")
    print(f"🐍 Открываю: file://{file}")
    webbrowser.open(f"file://{file}")


def main() -> None:
    ap = argparse.ArgumentParser(description="Python Шпаргалка — лаунчер")
    ap.add_argument("--port", type=int, default=DEFAULT_PORT, help=f"порт (по умолчанию {DEFAULT_PORT})")
    ap.add_argument("--static", action="store_true", help="открыть файл напрямую, без сервера")
    args = ap.parse_args()

    if args.static:
        static()
    else:
        serve(args.port)


if __name__ == "__main__":
    main()
