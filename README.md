# Personal Trainer Public PWA

App shell publica para capturar entrenamiento y comida en movil sin publicar datos privados.

## Deploy

1. Crea un repo publico separado, por ejemplo `personal-trainer-app`.
2. Copia el contenido de esta carpeta a ese repo.
3. Activa GitHub Pages en ese repo publico.
4. Abre la URL desde Android/iOS y usa Add to Home Screen.

## Configuracion en el telefono

La primera vez, abre Settings y guarda:

- Owner: tu usuario de GitHub.
- Repo: `personal-trainer`.
- Branch: `main`.
- Token: fine-grained PAT limitado a ese repo con `Contents: read and write`.

El token se guarda solo en `localStorage` del dispositivo.

