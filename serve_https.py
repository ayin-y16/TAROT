import http.server
import ssl
import os

PORT = 8743
ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

handler = http.server.SimpleHTTPRequestHandler
httpd = http.server.ThreadingHTTPServer(('0.0.0.0', PORT), handler)
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain(os.path.join('certs', 'cert.pem'), os.path.join('certs', 'key.pem'))
httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
print(f'Serving HTTPS on https://0.0.0.0:{PORT} (root: {ROOT})')
httpd.serve_forever()
