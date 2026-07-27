# **Proyecto 1 - Backend**
Creación de un backend con node conectado a mongo atlas y almacenando imagenes en cloudinary.

---

## Objetivo
- Iniciar un servidor en el lado backend al que se accede mediante una dirección localhost.
- El servidor conectará con una base de datos externa al equipo, en nuestro caso hemos usado Mongo Atlas.
- El servidor conectará con un storage de almacenamiento para guardar las imágenes, generando una url pública.
- Mediante control basado en roles, se limitará el acceso a distintas funcionalidades, garantizando la seguridad de acceso a los endpoints mediante los middlewares dedicados a ello.
- Los datos se referenciarán mediante el id del Objeto.
- Se hará uso de tokens de sesión para controlar el acceso a los usuarios
---

## Dependencias usadas
-  Nodemon (Para el desarrollo)
-  Mongoose (Base de datos)
-  Express (Enrutador y ejecución del server)
-  Dotenv (Habilita acceso a las variables de entorno del file .env)
-  Bcrypt (Codifica o compara contraseñas)
-  JsonWebToken (JWT para comprobar sesiones activas, roles, ...)
-  Multer (acceso a ficheros enviados)
-  Storage Cloudinary (Guardado de imagenes remoto)
  
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
- Para el acceso general de todos los endpoint, excepto para efectuar el login y registro de un usuario, es necesario enviar el token de sesión mediante headers.

```javascript
headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNjYxMmQxMWE1OWI5OGQyY2IzOTNhNSIsImlhdCI6MTc4NTA3NDU4NywiZXhwIjoxNzg1MTYwOTg3fQ.7ZyA18LgB-JVCfvNXCcrejCcfKP3BvmCeNp6oRSSpPs
```
<br>

### *Géneros:*
  Solo un administrador puede encargarse de realizar operaciones referentes a Create-Read-Update-Delete en los géneros

1. Añadir un género: 

    Envío mediante POST a http://localhost:2000/api/v1/genre/create

```javascript
body
{
    "name": "Punk" 
}
```
<br>

2. Eliminar un género: 

    Envío mediante DELETE a http://localhost:2000/api/v1/genre/

<br>

3. Mostrar todos géneros: 

    Envío mediante GET a http://localhost:2000/api/v1/genre/

<br>

4. Añadir un género: 

    Envío mediante PUT a http://localhost:2000/api/v1/genre/6a6612d11a59b98d2cb39391

```javascript
body
{
    "name": "Bachata" 
}
```
- El id debe corresponder al id del género a modificar
<br>
<br>

### *Usuarios:*
-  Un usuario puede registrarse y eliminar su cuenta. Solo un admin puede eliminar cualquier cuenta
-  Los usuarios pueden añadir, modificar o eliminar fotos de perfil

1. Login de usuario: 

    Envío mediante POST a  http://localhost:2000/api/v1/user/login 
```javascript
body
{
    "email": "Paco@test.com",
    "password": "Paco1234"
}
```
<br>

2. Registro de usuario: 

    Envío mediante POST a  http://localhost:2000/api/v1/user/create 
```javascript
body
{
  "name": "Juan",
  "lastname": "Pérez",
  "email": "Juan@test.com",
  "password": "Juan1234",
  "bornYear": 2002
}
```
<br>

3. Borrado de usuario: 
 
  - Solo un usuario admin tiene habilitado este endpoint que borra a cualquier usuario seleccionado

    Envío mediante DELETE a  http://localhost:2000/api/v1/user/ 
```javascript
body
{
  "email": "daniel@test.com"
}
```

  - Cualquier usurio eliminará su cuenta asociada al id del token enviado

    Envío mediante DELETE a  http://localhost:2000/api/v1/user/myself

<br>

4. Mostrar todos los usuarios: 

    Envío mediante GET a  http://localhost:2000/api/v1/user/ 

   - Se mostrarán los datos completos referenciados a otras colecciones también
  
  <br>


5. Modificar  datos de usuario: (añadir imagen de perfil, modificar cuenta o datos personales...)

    Envío mediante PUT a  http://localhost:2000/api/v1/user/ 
```javascript
FormData 
{
  "name": "Sara",
  "email": "Juan@test.com",
  "password": "Sara1234",
  "image": imagen seleccionada
}
```
- Nota: Recordar enviar siempre el jwt en authorization para validar el usuario

<br>


---
### *Canciones:*
 Solo un administrador puede encargarse de realizar operaciones referentes a Create-Update-Delete en los géneros.

Un usuario puede leer canciones.

1. Insertar canción nueva: 

    Envío mediante POST a  http://localhost:2000/api/v1/song/create 

```javascript
body
{
  "title": "Bohemian Rhapsody",
  "artists": "Queen",
  "genre": "Pop",
  "rating": 10,
  "durationSeconds": 354
}
```

### Detalles
- El usuario administrador por defecto para las pruebas es:
  >    email: "lucia@test.com,  password: "lucia123"
 - Como excepción de entrega académica se deja fuera de **gitignore** el fichero **env** con las variables de enntorno usadas en el proyecto.