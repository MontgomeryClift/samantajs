import mysql.connector
from mysql.connector import errorcode
from flask import Flask, abort, request
import json

app = Flask(__name__)


## Acceso base de datos MEGATRON
config = {
   'user': 'root',
   'password': 'm3g4tr0n',
   'host': '192.168.13.53',
   'database': 'bigdata'
}


## ROUTING WEB SERVICE
@app.route('/rules/<rule>/<int:articulo>/', methods=['GET',])
def rules(articulo=None, rule=None, limit=None):

    get_limit = request.args.get('limit')

    ## Validacion de limite (int)
    if(get_limit):
        try:
            get_limit = int(get_limit)
        except:
            ## El límite no es un entero
            abort(404, 'limit has to be a integer')

    try:
        cnx = mysql.connector.connect(**config)
    except mysql.connector.Error as err:
        print(err)

    cursor = cnx.cursor()

    ## regla para el carrito
    if rule == 'cesta':
        cursor.execute("""SELECT sugerido FROM rules_cesta WHERE principal=%s""", (articulo,))
        sugeridos = [int(str(item[0]).split('.')[0]) for item in cursor.fetchall()]
    ## regla para la navegacion
    elif rule == 'nav':
        cursor.execute("""SELECT sugerido FROM rules_nav WHERE principal=%s""", (articulo,))
        sugeridos = [int(str(item[0]).split('.')[0]) for item in cursor.fetchall()]
    ## no existe la regla
    else:
        abort(404, 'url request malformed or the rule does not exist')

    ## no hay referencias para ese ID_articulo
    if len(sugeridos) == 0:
        sugeridos = [0,  'no results']

    cursor.close()
    cnx.close()

    if(get_limit):
        sugeridosLimited = sugeridos[0:get_limit]
    else:
        sugeridosLimited = sugeridos

    return json.dumps(sugeridosLimited, ensure_ascii=False)


if __name__ == '__main__':
    app.run('0.0.0.0', 8088, debug=True)
