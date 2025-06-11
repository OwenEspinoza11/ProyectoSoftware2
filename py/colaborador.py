from flask import Blueprint, jsonify
import pyodbc

server = r'OWEN_LAPTOP'
database = 'IsraelGym'
connection_string = (
    f'DRIVER={{ODBC Driver 17 for SQL Server}};'
    f'SERVER={server};'
    f'DATABASE={database};'
    f'Trusted_Connection=yes;'
)

colaborador_bp = Blueprint('colaborador', __name__)

def get_db_connection():
    return pyodbc.connect(connection_string)

@colaborador_bp.route('/usuarios/activos', methods=['GET'])
def obtener_usuarios_activos():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT IdUsuario, Usuario FROM Usuario WHERE EstadoUsuario = 'ACTIVO'")
    usuarios = [
        {'idUsuario': row[0], 'nombreUsuario': row[1]}
        for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(usuarios)

@colaborador_bp.route('/colaboradores', methods=['GET'])
def obtener_colaboradores():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT C.idColaborador, C.idUsuario, U.Usuario, C.primerNombreColab, C.segundoNombreColab,
               C.primerApellidoColab, C.segundoApellidoColab, C.telefColab, C.emailColab,
               C.direccionColab, C.fechaIngreso, C.cargoColab
        FROM Colaborador C
        JOIN Usuario U ON C.idUsuario = U.idUsuario
    """)
    colaboradores = [
        {
            'idColaborador': row[0],
            'idUsuario': row[1],
            'nombreUsuario': row[2],
            'primerNombreColab': row[3],
            'segundoNombreColab': row[4],
            'primerApellidoColab': row[5],
            'segundoApellidoColab': row[6],
            'telefColab': row[7],
            'emailColab': row[8],
            'direccionColab': row[9],
            'fechaIngreso': row[10].strftime('%Y-%m-%d') if row[10] else '',
            'cargoColab': row[11]
        }
        for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(colaboradores)