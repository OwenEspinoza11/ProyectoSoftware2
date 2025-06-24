from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pyodbc
from flask import Blueprint
import time

app = Flask(__name__, static_folder='static', static_url_path='/static')

#app = Flask(__name__)
CORS(app)

# Conexión a SQL Server
server = r'OWEN_LAPTOP'
database = 'IsraelGym'
connection_string = (
    f'DRIVER={{ODBC Driver 17 for SQL Server}};'
    f'SERVER={server};'
    f'DATABASE={database};'
    f'Trusted_Connection=yes;'
)

login_bp = Blueprint('login', __name__)

def get_db_connection():
    return pyodbc.connect(connection_string)

@login_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    usuario = data.get('Usuario')
    contrasena = data.get('Password')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT U.IdUsuario, U.Usuario, U.EstadoUsuario, R.NombreRol
        FROM Usuario U
        JOIN Rol R ON U.idRol = R.idRol
        WHERE U.Usuario = ? AND U.Password = ?
    """, (usuario, contrasena))

    user = cursor.fetchone()
    conn.close()

    if user:
        # Acceso por índice, no por atributo
        if user[2].strip().upper() == 'ACTIVO':
            return jsonify({
                'mensaje': 'Login exitoso',
                'usuario': user[1],
                'rol': user[3],
                'estado': user[2],
                'id': user[0]
            })
        else:
            return jsonify({'mensaje': 'Usuario inactivo'}), 403
    else:
        return jsonify({'mensaje': 'Credenciales incorrectas'}), 401
