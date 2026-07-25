# **Proyecto 1 - Backend**
Creación de un backend con node conectado a mongo atlas y almacenando imagenes en cloudinary.

---

## Objetivo
- Iniciar un servidor en el lado backend al que se accede mediante una dirección localhost.
- El servidor conectará con una base de datos externa al equipo, en nuestro caso hemos usado Mongo Atlas.
- El servidor conectará con un storage de almacenamiento para guardar las imágenes, generando una url pública.
- Mediante control basado en roles, se limitará el acceso a distintas funcionalidades, garantizando la seguridad de acceso a los endpoints mediante los middlewares dedicados a ello.
- Los datos se referenciarán mediante el id del Objeto.

---

## Dependencias usadas
-  Nodemon (Para el desarrollo)
-  Mongoose (Base de datos)
-  Express (Enrutador y ejecución del server)
-  Dotenv (Habilita acceso a las variables de entorno del file .env)
-  Bcrypt (Codifica o compara contraseñas)
--- 

## Configuración
- Se establece el dns del servicio en *1.1.1.1* (Cloudflare) y *8.8.8.8* (Google) para evitar conflictos de conexión con la base de datos en Mongo Atlas.

---

## Instrucciones
1. Abrir una shell y situarse en la raíz del proyecto
2. Ejecutar el siguiente script para poblar la base de datos
> npm run seeds
3. Para iniciar el servidor lanzar desde la consola el siguiente script:
> npm run start

---

## Acceso a endpoints
### *Géneros:*
  Solo un administrador puede encargarse de realizar operaciones referentes al CRUD en los generos

1. Añadir un género: 

    Envío mediante POST a ....
```javascript
body
{
    name: "Punk" 
}
```

### Detalles
 - Como excepción de entrega académica se deja fuera de **gitignore** el fichero **env** con las variables de enntorno usadas en el proyecto.