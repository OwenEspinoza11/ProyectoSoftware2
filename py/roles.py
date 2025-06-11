from flask import Blueprint, jsonify, request
import pyodbc

print("Importando roles.py")

server = r'OWEN_LAPTOP'
database = 'IsraelGym'
connection_string = (
    f'DRIVER={{ODBC Driver 17 for SQL Server}};'
    f'SERVER={server};'
    f'DATABASE={database};'
    f'Trusted_Connection=yes;'
)

roles_bp = Blueprint('roles', __name__)

def get_db_connection():
    return pyodbc.connect(connection_string)

@roles_bp.route('/roles', methods=['GET'])
def obtener_roles():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT idRol, NombreRol FROM Rol")
    roles = [{'idRol': row[0], 'NombreRol': row[1]} for row in cursor.fetchall()]
    conn.close()
    return jsonify(roles)

@roles_bp.route('/roles', methods=['POST'])
def agregar_rol():
    data = request.get_json()
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'mensaje': 'Nombre de rol requerido'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO Rol (NombreRol) VALUES (?)", (nombre,))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Rol agregado correctamente'})

@roles_bp.route('/roles/<int:id>', methods=['PUT'])
def actualizar_rol(id):
    data = request.get_json()
    nombre = data.get('nombre')
    if not nombre:
        return jsonify({'mensaje': 'Nombre de rol requerido'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE Rol SET NombreRol = ? WHERE idRol = ?", (nombre, id))
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'mensaje': 'Rol no encontrado'}), 404
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Rol actualizado correctamente'})

@roles_bp.route('/roles/<int:id>', methods=['DELETE'])
def eliminar_rol(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Rol WHERE idRol = ?", (id,))
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'mensaje': 'Rol no encontrado'}), 404
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Rol eliminado correctamente'})

# Ruta de prueba opcional
@roles_bp.route('/roles/test', methods=['GET'])
def test_roles():
    return "Funciona"