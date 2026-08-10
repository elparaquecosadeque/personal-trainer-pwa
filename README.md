# Personal Trainer Public PWA

App shell publica para capturar entrenamiento y comida en movil sin publicar datos privados.

## Deploy

1. Crea un repo publico separado, por ejemplo `personal-trainer-pwa`.
2. Copia el contenido de esta carpeta a ese repo.
3. Activa GitHub Pages en ese repo publico.
4. Abre la URL desde Android/iOS y usa Add to Home Screen.

## Configuracion en el telefono

La primera vez, abre `Settings` y guarda:

- Owner: tu usuario de GitHub.
- Repo: `personal-trainer`.
- Branch: `main`.
- Token: fine-grained PAT limitado a ese repo con `Contents: read and write`.
- Passphrase local: recomendada para cifrar el token en `localStorage`.

Luego toca `Guardar settings`, `Desbloquear` si usaste passphrase, y `Cargar datos`.

Si guardas una passphrase, el token se cifra en `localStorage` y se desbloquea solo para la sesion actual. La passphrase no se guarda.

## Uso diario

- `Hoy`: registra el entrenamiento y guarda `data/import/workouts/YYYY-MM-DD.json`.
- `Semana`: revisa la rutina semanal y tus registros previos.
- `Comida`: registra descripcion, fotos antes/despues y correcciones.
- `Reporte`: copia `procesa comidas pendientes` para ChatGPT.
- `Settings`: cambia GitHub, paleta e idioma.

Las fotos de comida se comprimen en el navegador y se suben al repo privado en `data/media/nutrition/YYYY-MM-DD/`.

## ChatGPT programado

En ChatGPT Plus, crea una tarea diaria:

```text
Crea una tarea diaria a las 9:30 pm hora Lima: recuerdame procesar mis comidas pendientes del repo personal-trainer. Cuando abra la tarea, pideme decir "procesa comidas pendientes" para que ChatGPT estime kcal/proteina desde los JSON y fotos guardadas por mi PWA.
```

La pestana `Reporte` muestra comidas pendientes y copia el pedido `procesa comidas pendientes` para usarlo con esa tarea programada.
