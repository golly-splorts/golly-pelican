import unittest
import urllib.parse
import requests
from .threaded_server import ThreadedServer


class ThreadedServerTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        ThreadedServer.start_serving()

    def test_threadedserver_get(self):
        base_url = ThreadedServer.get_base_url()
        print(base_url)
        endpoint = "/ping"
        url = urllib.parse.urljoin(base_url, endpoint)
        r = requests.get(url)
        self.assertEqual(r.status_code, 200)

    @classmethod
    def tearDownClass(cls):
        ThreadedServer.stop_serving()
