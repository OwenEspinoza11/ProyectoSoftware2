#ESTE NO DA TODAVIA 

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

clientes_bp = Blueprint('clientes', __name__)

def get_db_connection():
    return pyodbc.connect(connection_string)

@clientes_bp.route('/clientes', methods=['GET'])
def obtener_clientes():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT idCliente, primerNomCliente, segundoNomCliente, primerApeCliente, segApeCliente,
               telefCliente, emailCliente, direccionCliente, Estado, fechaRegistro
        FROM Cliente
    """)
    clientes = [
        {
            'idCliente': row[0],
            'primerNomCliente': row[1],
            'segundoNomCliente': row[2],
            'primerApeCliente': row[3],
            'segApeCliente': row[4],
            'telefCliente': row[5],
            'emailCliente': row[6],
            'direccionCliente': row[7],
            'Estado': row[8],
            'fechaRegistro': row[9].strftime('%Y-%m-%d') if row[9] else ''
        }
        for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(clientes)

@clientes_bp.route('/clientes/<int:id>', methods=['GET'])
def obtener_cliente(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT idCliente, primerNomCliente, segundoNomCliente, primerApeCliente, segApeCliente,
               telefCliente, emailCliente, direccionCliente, Estado, fechaRegistro
        FROM Cliente WHERE idCliente = ?
    """, (id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        cliente = {
            'idCliente': row[0],
            'primerNomCliente': row[1],
            'segundoNomCliente': row[2],
            'primerApeCliente': row[3],
            'segApeCliente': row[4],
            'telefCliente': row[5],
            'emailCliente': row[6],
            'direccionCliente': row[7],
            'Estado': row[8],
            'fechaRegistro': row[9].strftime('%Y-%m-%d') if row[9] else ''
        }
        return jsonify(cliente)
    else:
        return jsonify({'mensaje': 'Cliente no encontrado'}), 404

@clientes_bp.route('/clientes', methods=['POST'])
def agregar_cliente():
    data = request.form
    primerNom = data.get('primerNomCliente')
    segundoNom = data.get('segundoNomCliente')
    primerApe = data.get('primerApeCliente')
    segundoApe = data.get('segApeCliente')
    telef = data.get('telefCliente')
    email = data.get('emailCliente')
    direccion = data.get('direccionCliente')
    estado = data.get('Estado')
    if estado not in ['A', 'I']:
        estado = 'A' if estado == 'ACTIVO' else 'I'
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO Cliente (primerNomCliente, segundoNomCliente, primerApeCliente, segApeCliente,
                             telefCliente, emailCliente, direccionCliente, Estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (primerNom, segundoNom, primerApe, segundoApe, telef, email, direccion, estado))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Cliente agregado correctamente'})

@clientes_bp.route('/clientes/<int:id>', methods=['PUT'])
def actualizar_cliente(id):
    data = request.form
    primerNom = data.get('primerNomCliente')
    segundoNom = data.get('segundoNomCliente')
    primerApe = data.get('primerApeCliente')
    segundoApe = data.get('segApeCliente')
    telef = data.get('telefCliente')
    email = data.get('emailCliente')
    direccion = data.get('direccionCliente')
    estado = data.get('Estado')
    if estado not in ['A', 'I']:
        estado = 'A' if estado == 'ACTIVO' else 'I'
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE Cliente SET primerNomCliente=?, segundoNomCliente=?, primerApeCliente=?, segApeCliente=?,
                           telefCliente=?, emailCliente=?, direccionCliente=?, Estado=?
        WHERE idCliente=?
    """, (primerNom, segundoNom, primerApe, segundoApe, telef, email, direccion, estado, id))
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'mensaje': 'Cliente no encontrado'}), 404
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Cliente actualizado correctamente'})

@clientes_bp.route('/clientes/<int:id>', methods=['DELETE'])
def eliminar_cliente(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Cliente WHERE idCliente = ?", (id,))
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'mensaje': 'Cliente no encontrado'}), 404
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Cliente eliminado correctamente'})