#//CARGA PERO NO GUARDA NO SÉ POR QUÉ

from flask import Blueprint, request, jsonify
import pyodbc

server = r'OWEN_LAPTOP'
database = 'IsraelGym'
connection_string = (
    f'DRIVER={{ODBC Driver 17 for SQL Server}};'
    f'SERVER={server};'
    f'DATABASE={database};'
    f'Trusted_Connection=yes;'
)

proveedores_bp = Blueprint('proveedores', __name__)

def get_db_connection():
    return pyodbc.connect(connection_string)

@proveedores_bp.route('/proveedores', methods=['GET'])
def obtener_proveedores():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT idProveedor, nombreProveedor, telefProveedor, direccProveedor
        FROM Proveedor
    """)
    proveedores = [
        {
            'idProveedor': row[0],
            'nombreProveedor': row[1],
            'telefProveedor': row[2],
            'direccProveedor': row[3]
        }
        for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(proveedores)

@proveedores_bp.route('/proveedores/<int:id>', methods=['GET'])
def obtener_proveedor(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT idProveedor, nombreProveedor, telefProveedor, direccProveedor
        FROM Proveedor WHERE idProveedor = ?
    """, (id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        proveedor = {
            'idProveedor': row[0],
            'nombreProveedor': row[1],
            'telefProveedor': row[2],
            'direccProveedor': row[3]
        }
        return jsonify(proveedor)
    else:
        return jsonify({'mensaje': 'Proveedor no encontrado'}), 404

@proveedores_bp.route('/proveedores', methods=['POST'])
def agregar_proveedor():
    data = request.json
    nombre = data.get('nombreProveedor')
    telefono = data.get('telefProveedor')
    direccion = data.get('direccProveedor')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO Proveedor (nombreProveedor, telefProveedor, direccProveedor)
        VALUES (?, ?, ?)
    """, (nombre, telefono, direccion))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Proveedor agregado correctamente'})

@proveedores_bp.route('/proveedores/<int:id>', methods=['PUT'])
def actualizar_proveedor(id):
    data = request.json
    nombre = data.get('nombreProveedor')
    telefono = data.get('telefProveedor')
    direccion = data.get('direccProveedor')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE Proveedor SET nombreProveedor=?, telefProveedor=?, direccProveedor=?
        WHERE idProveedor=?
    """, (nombre, telefono, direccion, id))
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'mensaje': 'Proveedor no encontrado'}), 404
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Proveedor actualizado correctamente'})

@proveedores_bp.route('/proveedores/<int:id>', methods=['DELETE'])
def eliminar_proveedor(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Proveedor WHERE idProveedor = ?", (id,))
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'mensaje': 'Proveedor no encontrado'}), 404
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Proveedor eliminado correctamente'})
