import json
import os
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer


try:
    HOST = os.environ["GOLLY_PELICAN_TEST_MOCKAPI_HOST"]
    PORT = int(os.environ["GOLLY_PELICAN_TEST_MOCKAPI_PORT"])
except KeyError:
    raise Exception(
        "Error: you must define GOLLY_PELICAN_TEST_MOCKAPI_{HOST,PORT}. Try running source environment.test"
    )
except ValueError:
    raise Exception(
        "Error: you must provide an integer for GOLLY_PELICAN_TEST_MOCKAPI_PORT. Try running source environment.test"
    )


class ThreadedServer(BaseHTTPRequestHandler):
    _server = None
    _thread = None

    @staticmethod
    def get_addr_port():
        return HOST, PORT

    @staticmethod
    def get_base_url():
        addr, port = ThreadedServer.get_addr_port()
        base_url = f"http://{addr}:{port}"
        return base_url

    @classmethod
    def start_serving(cls):
        # Get the bind address and port
        cls._addr, cls._port = cls.get_addr_port()

        # Create an HTTP server
        cls._server = HTTPServer((cls._addr, cls._port), cls)

        # Create a thread to run the server
        cls._thread = threading.Thread(target=cls._server.serve_forever)

        # Start the server
        cls._thread.start()

    @classmethod
    def stop_serving(cls):
        # Shut down the server
        if cls._server is not None:
            cls._server.shutdown()

        # Let the thread rejoin the worker pool
        cls._thread.join(timeout=10)
        assert not cls._thread.is_alive()

    def _serialize(self, d):
        return bytes(json.dumps(d), "utf-8")

    def prq(self, path):
        if path == "/ping":
            return {"ping": "pong"}

    def do_GET(self):
        try:
            response = self.prq(self.path)
            self._set_headers()
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(serialize(response))
        except Exception:
            self.send_response(400)

    def _set_headers(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()

    def log_request(self, *args, **kwargs):
        """If this method is empty, it stops logging messages from being sent to the console"""
        pass
