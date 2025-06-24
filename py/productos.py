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

productos_bp = Blueprint('productos', __name__)

def get_db_connection():
    return pyodbc.connect(connection_string)

@productos_bp.route('/productos', methods=['GET'])
def obtener_productos():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT idProducto, idCategoria, idProveedor, NombreProducto, descripcionProducto,
               precioProducto, Costoproducto, estadoProducto, cantidadProducto, fechaIngresoProducto
        FROM Producto
    """)
    productos = [
        {
            'idProducto': row[0],
            'idCategoria': row[1],
            'idProveedor': row[2],
            'NombreProducto': row[3],
            'descripcionProducto': row[4],
            'precioProducto': row[5],
            'Costoproducto': row[6],
            'estadoProducto': row[7],
            'cantidadProducto': row[8],
            'fechaIngresoProducto': row[9].strftime('%Y-%m-%d') if row[9] else ''
        }
        for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(productos)

@productos_bp.route('/productos/<int:id>', methods=['GET'])
def obtener_producto(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT idProducto, idCategoria, idProveedor, NombreProducto, descripcionProducto,
               precioProducto, Costoproducto, estadoProducto, cantidadProducto, fechaIngresoProducto
        FROM Producto WHERE idProducto = ?
    """, (id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        producto = {
            'idProducto': row[0],
            'idCategoria': row[1],
            'idProveedor': row[2],
            'NombreProducto': row[3],
            'descripcionProducto': row[4],
            'precioProducto': row[5],
            'Costoproducto': row[6],
            'estadoProducto': row[7],
            'cantidadProducto': row[8],
            'fechaIngresoProducto': row[9].strftime('%Y-%m-%d') if row[9] else ''
        }
        return jsonify(producto)
    else:
        return jsonify({'mensaje': 'Producto no encontrado'}), 404

@productos_bp.route('/productos', methods=['POST'])
def agregar_producto():
    data = request.form
    idCategoria = data.get('idCategoria')
    idProveedor = data.get('idProveedor')
    nombre = data.get('NombreProducto')
    descripcion = data.get('descripcionProducto')
    precio = data.get('precioProducto')
    costo = data.get('Costoproducto')
    estado = data.get('estadoProducto')
    cantidad = data.get('cantidadProducto')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO Producto (idCategoria, idProveedor, NombreProducto, descripcionProducto,
                              precioProducto, Costoproducto, estadoProducto, cantidadProducto)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (idCategoria, idProveedor, nombre, descripcion, precio, costo, estado, cantidad))
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Producto agregado correctamente'})

@productos_bp.route('/productos/<int:id>', methods=['PUT'])
def actualizar_producto(id):
    data = request.form
    idCategoria = data.get('idCategoria')
    idProveedor = data.get('idProveedor')
    nombre = data.get('NombreProducto')
    descripcion = data.get('descripcionProducto')
    precio = data.get('precioProducto')
    costo = data.get('Costoproducto')
    estado = data.get('estadoProducto')
    cantidad = data.get('cantidadProducto')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE Producto SET idCategoria=?, idProveedor=?, NombreProducto=?, descripcionProducto=?,
                            precioProducto=?, Costoproducto=?, estadoProducto=?, cantidadProducto=?
        WHERE idProducto=?
    """, (idCategoria, idProveedor, nombre, descripcion, precio, costo, estado, cantidad, id))
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'mensaje': 'Producto no encontrado'}), 404
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Producto actualizado correctamente'})

@productos_bp.route('/productos/<int:id>', methods=['DELETE'])
def eliminar_producto(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Producto WHERE idProducto = ?", (id,))
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'mensaje': 'Producto no encontrado'}), 404
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Producto eliminado correctamente'})

# Endpoints para combobox de proveedores y categorías

@productos_bp.route('/proveedores', methods=['GET'])
def obtener_proveedores():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT idProveedor, nombreProveedor FROM Proveedor WHERE estadoProveedor = 'ACTIVO'")
    proveedores = [
        {'idProveedor': row[0], 'nombreProveedor': row[1]}
        for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(proveedores)

@productos_bp.route('/categorias', methods=['GET'])
def obtener_categorias():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT idCategoria, nombreCategoria FROM CategoriaProducto WHERE estadoCategoria = 'ACTIVO'")
    categorias = [
        {'idCategoria': row[0], 'nombreCategoria': row[1]}
        for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(categorias)