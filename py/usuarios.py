from flask import Blueprint, jsonify, request
import pyodbc
from werkzeug.security import generate_password_hash

server = r'OWEN_LAPTOP'
database = 'IsraelGym'
connection_string = (
    f'DRIVER={{ODBC Driver 17 for SQL Server}};'
    f'SERVER={server};'
    f'DATABASE={database};'
    f'Trusted_Connection=yes;'
)

usuarios_bp = Blueprint('usuarios', __name__)

def get_db_connection():
    return pyodbc.connect(connection_string)

@usuarios_bp.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT U.IdUsuario, U.Usuario, U.Email, U.EstadoUsuario, U.FechaRegistro, R.NombreRol, R.IdRol
        FROM Usuario U
        JOIN Rol R ON U.IdRol = R.IdRol
    """)
    usuarios = [
        {
            'idUsuario': row[0],
            'nombreUsuario': row[1],
            'emailUsuario': row[2],
            'estadoUsuario': row[3],
            'fechaRegistro': row[4].strftime('%Y-%m-%d') if row[4] else '',
            'rol': row[5],      # nombre del rol
            'idRol': row[6]     # id del rol
        }
        for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(usuarios)

@usuarios_bp.route('/usuarios', methods=['POST'])
def agregar_usuario():
    data = request.get_json()
    nombre = data.get('nombreUsuario')
    email = data.get('emailUsuario')
    idRol = data.get('idRol')
    password = data.get('password')
    estado = data.get('estadoUsuario')  # <-- Nuevo

    if not nombre or not email or not idRol or not password or not estado:
        return jsonify({'mensaje': 'Todos los campos son requeridos'}), 400

    hashed_password = generate_password_hash(password)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO Usuario (Usuario, Email, IdRol, Password, EstadoUsuario) VALUES (?, ?, ?, ?, ?)",
        (nombre, email, idRol, hashed_password, estado)  # <-- Agrega estado
    )
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Usuario agregado correctamente'})

@usuarios_bp.route('/usuarios/<int:id>', methods=['PUT'])
def actualizar_usuario(id):
    data = request.get_json()
    nombre = data.get('nombreUsuario')
    email = data.get('emailUsuario')
    idRol = data.get('idRol')
    estado = data.get('estadoUsuario')  # <-- Nuevo

    if not nombre or not email or not idRol or not estado:
        return jsonify({'mensaje': 'Todos los campos son requeridos'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE Usuario SET Usuario = ?, Email = ?, IdRol = ?, EstadoUsuario = ? WHERE IdUsuario = ?",
        (nombre, email, idRol, estado, id)  # <-- Agrega estado
    )
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'mensaje': 'Usuario no encontrado'}), 404
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Usuario actualizado correctamente'})

@usuarios_bp.route('/usuarios/<int:id>', methods=['DELETE'])
def eliminar_usuario(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Usuario WHERE idUsuario = ?", (id,))
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'mensaje': 'Usuario no encontrado'}), 404
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Usuario eliminado correctamente'})

@usuarios_bp.route('/roles', methods=['GET'])
def obtener_roles():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT IdRol, NombreRol FROM Rol")
    roles = [
        {'idRol': row[0], 'nombreRol': row[1]}
        for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(roles)