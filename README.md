# API de la LaLiga 

Una API para gestionar equipos y jugadores de la liga española, con sistema de usuarios y permisos.

## Características

- Operaciones completas (crear, leer, actualizar, borrar) para equipos, jugadores y usuarios
- Sistema de login con tokens JWT
- Dos roles de usuario (normal y administrador)
- Relaciones entre datos (equipos-jugadores, usuarios-equipos favoritos)

## Cómo empezar

### Requisitos previos

- Tener Node.js instalado
- Cuenta en MongoDB Atlas (es gratis)

### Instalación

1. Clona el repositorio o descarga los archivos
2. Instala las dependencias:
   ```
   npm install
   ```
3. Crea un archivo `.env` en la carpeta principal con:
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://tuusuario:tucontraseña@tucluster.mongodb.net/THEPOWERMBA?retryWrites=true&w=majority
   JWT_SECRET=una_clave_secreta_para_tokens
   JWT_EXPIRE=30d
   ```
   Recuerda cambiar los datos de conexión por los tuyos y permitir conexiones desde cualquier IP (0.0.0.0/0) en MongoDB Atlas.

4. Carga los datos iniciales:
   ```
   npm run seed:import
   ```

### Ejecutar el servidor

```
npm start
```

Para desarrollo (con recarga automática):
```
npm run dev
```

## Endpoints de la API

### Autenticación

- `POST /api/v1/auth/register` - Registrar un usuario nuevo
  - Envía: `{ "name": "Tu Nombre", "email": "tu@email.com", "password": "123456" }`
- `POST /api/v1/auth/login` - Iniciar sesión
  - Envía: `{ "email": "tu@email.com", "password": "123456" }`
- `GET /api/v1/auth/me` - Ver tu perfil (necesita token)
- `PUT /api/v1/auth/updatedetails` - Actualizar tus datos (necesita token)
  - Envía: `{ "name": "Nuevo Nombre", "email": "nuevo@email.com", "favoriteTeam": "ID-del-equipo" }`
- `PUT /api/v1/auth/updatepassword` - Cambiar contraseña (necesita token)
  - Envía: `{ "currentPassword": "123456", "newPassword": "nueva123" }`

### Usuarios (Solo administradores)

- `GET /api/v1/users` - Ver todos los usuarios
- `GET /api/v1/users/:id` - Ver un usuario específico
- `PUT /api/v1/users/:id` - Modificar un usuario (incluido cambiar su rol)
  - Envía: `{ "name": "Nombre", "role": "admin" }`
- `DELETE /api/v1/users/:id` - Eliminar un usuario (admins pueden borrar a cualquiera, usuarios solo a sí mismos)

### Equipos

- `GET /api/v1/teams` - Ver todos los equipos
- `GET /api/v1/teams/:id` - Ver un equipo específico
- `POST /api/v1/teams` - Crear un equipo (solo admins)
  - Envía: `{ "name": "Nombre Equipo", "city": "Ciudad", "founded": 1899, "stadium": "Nombre Estadio" }`
- `PUT /api/v1/teams/:id` - Actualizar equipo (solo admins)
- `DELETE /api/v1/teams/:id` - Eliminar equipo (solo admins)

### Jugadores

- `GET /api/v1/players` - Ver todos los jugadores
- `GET /api/v1/teams/:teamId/players` - Ver jugadores de un equipo específico
- `GET /api/v1/players/:id` - Ver un jugador específico
- `POST /api/v1/teams/:teamId/players` - Añadir un jugador a un equipo (solo admins)
  - Envía: `{ "name": "Nombre Jugador", "position": "Forward", "nationality": "Spanish", "age": 25 }`
- `PUT /api/v1/players/:id` - Actualizar jugador (solo admins)
- `DELETE /api/v1/players/:id` - Eliminar jugador (solo admins)

## Roles y permisos

### Usuario normal
- Puede ver equipos y jugadores
- Puede registrarse e iniciar sesión
- Puede actualizar su perfil
- Puede borrarse a sí mismo
- Puede elegir un equipo favorito

### Administrador
- Todo lo que puede hacer un usuario normal
- Puede crear, modificar y borrar equipos
- Puede crear, modificar y borrar jugadores
- Puede ver todos los usuarios
- Puede modificar cualquier usuario (incluso cambiar sus roles)
- Puede borrar cualquier usuario

## Usuario administrador inicial

Al cargar los datos iniciales, se crea un administrador con:
- Email: x
- Contraseña: hasheada con la cadena x dentro
