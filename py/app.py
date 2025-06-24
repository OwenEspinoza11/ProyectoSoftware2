from flask import Flask
from flask_cors import CORS
from roles import roles_bp
from login import login_bp
from usuarios import usuarios_bp
from colaborador import colaborador_bp
from clientes import clientes_bp
from categorias import categorias_bp
from proveedores import proveedores_bp
from productos import productos_bp


#AQUI SE CARGAN TODOS LOS BLUEPRINTS EN EL DASHBOARD HTML


app = Flask(__name__)
CORS(app)

app.register_blueprint(roles_bp, url_prefix='/api')
app.register_blueprint(login_bp)
app.register_blueprint(usuarios_bp, url_prefix='/api')
app.register_blueprint(colaborador_bp, url_prefix='/api')
app.register_blueprint(clientes_bp, url_prefix='/api')
app.register_blueprint(categorias_bp, url_prefix='/api')
app.register_blueprint(proveedores_bp, url_prefix='/api')
app.register_blueprint(productos_bp, url_prefix='/api')


@app.route('/ping')
def ping():
    return "pong"

@app.route('/api/prueba')
def api_prueba():
    return "Prueba directa"

@app.route('/')
def home():
    return "Home"

if __name__ == '__main__':
    app.run(debug=True)