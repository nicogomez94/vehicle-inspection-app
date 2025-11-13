# Deployment en Vercel

## Variables de Entorno Requeridas

En el dashboard de Vercel, configura las siguientes variables de entorno:

```
DB_HOST=your_postgres_host
DB_PORT=5432
DB_NAME=vehicle_inspection
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
NODE_ENV=production
DEBUG_MODE=false
```

## Pasos para Deploy

1. **Conecta tu repositorio** a Vercel desde el dashboard
2. **Configura las variables de entorno** en Settings → Environment Variables
3. **Deploy**: Vercel detectará automáticamente la configuración del `vercel.json`

## Verificación Post-Deployment

- Frontend: `https://your-app.vercel.app`
- API Health Check: `https://your-app.vercel.app/api/health`
- API Endpoint: `https://your-app.vercel.app/api/inspecciones`

## Troubleshooting

### Error: "404 Not Found" en /api/inspecciones

Si recibes un error 404 HTML en lugar de JSON:

1. Verifica que todas las variables de entorno estén configuradas en Vercel
2. Asegúrate de que la base de datos PostgreSQL esté accesible desde Vercel
3. Revisa los logs en Vercel Dashboard → Deployments → [tu deployment] → Functions
4. Verifica que el archivo `backend/api/index.ts` esté siendo detectado como función

### Redeployment

Para forzar un nuevo deployment:
```bash
vercel --prod
```

O desde el dashboard:
- Deployments → [último deployment] → Redeploy
