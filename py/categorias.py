#no esta funcionando este archivo, no se ha podido conectar a la base de datos

from flask import Blueprint, jsonify, request
import pyodbc

print("Importando categorias.py")

server = r'OWEN_LAPTOP'
database = 'IsraelGym'
connection_string = (
    f'DRIVER={{ODBC Driver 17 for SQL Server}};'
    f'SERVER={server};'
    f'DATABASE={database};'
    f'Trusted_Connection=yes;'
)

categorias_bp = Blueprint('categorias', __name__)

def get_db_connection():
    return pyodbc.connect(connection_string)

@categorias_bp.route('/api/categorias', methods=['GET'])
def obtener_categorias():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT idCategoria, nombreCategoria FROM CategoriaProducto")
    categorias = [{'idCategoria': row[0], 'nombreCategoria': row[1]} for row in cursor.fetchall()]
    conn.close()
    return jsonify(categorias)

@categorias_bp.route('/api/categorias', methods=['POST'])
def agregar_categoria():
    data = request.get_json()
    nombre = data.get('nombreCategoria')
    if not nombre:
        return jsonify({'mensaje': 'Nombre de categoría requerido'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO CategoriaProducto (nombreCategoria) VALUES (?)", (nombre,))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Categoría agregada correctamente'})

@categorias_bp.route('/api/categorias/<int:id>', methods=['PUT'])
def actualizar_categoria(id):
    data = request.get_json()
    nombre = data.get('nombreCategoria')
    if not nombre:
        return jsonify({'mensaje': 'Nombre de categoría requerido'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE CategoriaProducto SET nombreCategoria = ? WHERE idCategoria = ?", (nombre, id))
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'mensaje': 'Categoría no encontrada'}), 404
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Categoría actualizada correctamente'})

@categorias_bp.route('/api/categorias/<int:id>', methods=['DELETE'])
def eliminar_categoria(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM CategoriaProducto WHERE idCategoria = ?", (id,))
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'mensaje': 'Categoría no encontrada'}), 404
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Categoría eliminada correctamente'})

# Ruta de prueba opcional
@categorias_bp.route('/api/categorias/test', methods=['GET'])
def test_categorias():
    return "Funciona"