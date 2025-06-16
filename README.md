# AdoptmeBackendIII 
## 🐱​🐶​🐾​ AdoptMe API

### API que Gestiona Usuarios, Sesiones, Mascotas y Adopciones.

---------------------------------------------------------------

#### Para LOGS --->

##### Para Activar Modo Variables de Entorno: Producción / Desarrollo 

---> Producción 🧑‍🔧​
-Y que se genere Archivo errors.log en la Carpeta logs-, la App se ejecuta con:
$env:NODE_ENV="production"; node src/server.js

---> Desarrollo 🧑‍🚀​
-Sólo en Consola con Colores-:
$env:NODE_ENV="development"; node src/server.js

###### - En Consola PowerShell + Windows -

------------------------------------------

#### Archivo .gitignore --->

Carpeta /test
Archivo .env 
Deberían ser parte de .gitignore ---> Se Suben a Github para Corrección.

------------------------------------------------------------------------

## 🐳 Imagen Docker --->

Este Proyecto de BackendIII tiene una Imagen Docker que es Pública en DockerHub! ✨🪐

🔗 [Ver imagen en DockerHub](https://hub.docker.com/r/cszanella/adoptme-api)


🌐 Podés usar la Imagen Lista desde Docker Hub --->

```bash

docker pull cszanella/adoptme-api
docker run -e NODE_ENV=production -e MONGO_URI="mongodb+srv://corazon_de_chocolate:1455@cluster0.mulyi.mongodb.net/adoptme" -p 8080:8080 cszanella/adoptme-api


```

🌈 Archivos Docker Incluidos:

- `Dockerfile`: Define la Imagen del Contenedor.
- `.dockerignore`: Evita Copiar Archivos Innecesarios / Sensibles como `node_modules`, `.env`, `test`, etc. 

---------------------------------------------

​💻​ Para Correr la Imagen de Forma Local --->

🌈 El Archivo .env debe tener:

```bash

NODE_ENV=production
MONGO_URI=mongodb+srv://corazon_de_chocolate:1455@cluster0.mulyi.mongodb.net/adoptme
MONGO_URI_TEST=mongodb+srv://corazon_de_chocolate:1455@cluster0.mulyi.mongodb.net/adoptme_test

```


