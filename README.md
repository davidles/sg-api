# Secretaría General API

## CU_07 – Consulta de títulos disponibles

- **GET `/titles/available?userId=<id>`**: Devuelve los títulos que el egresado puede solicitar. Utiliza los modelos `title`, `studyPlan`, `requestType`, `titleStatus` y la relación con `person`/`graduate`. Incluye metadatos de facultad, plan de estudio y tipo de solicitud.
- Endpoints relacionados y lógica se encuentran en `src/controllers/titlesController.ts` y `src/routes/titles.ts`.

## CU_08 – Generación de solicitud de trámite

- **POST `/requests`**: Crea una nueva solicitud de título para el usuario autenticado. Persistencia en tablas `request`, `requestStatusHistory`, `requestRequirementInstance` según el tipo de solicitud.
- Implementado en `src/controllers/requestsController.ts` y `src/routes/requests.ts`.

## CU_09 – Generación de formulario de expedición de título

- **GET `/forms/:userId`**: Obtiene datos personales, de contacto, domicilio y egresado, más catálogos de fuerzas/grados.
- **PUT `/forms/:userId`**: Valida y persiste la información del formulario. Requiere dirección, email válido y relación fuerza/grado coherente para egresados militares.
- **POST `/forms/:userId/pdf`**: Genera un PDF con los datos actuales del formulario. Responde `application/pdf`.

### Seeds
Ejecutar `mysql --default-character-set=utf8mb4 -h <host> -P <port> -u <user> -p <database> < insert.sql` para poblar tablas `pais`, `provincia`, `ciudad`, `fuerza_militar`, `grado_militar`, además de datos base (`persona`, `usuario`, `egresado`).

## Dependencias y riesgo residual

Se añadió `pdfkit` para la generación de archivos PDF. Actualmente `sequelize@6` depende de `validator@^13.9.0`, afectado por [GHSA-9965-vmph-33xx](https://github.com/advisories/GHSA-9965-vmph-33xx). Se forzó `validator@^13.11.0` mediante `"overrides"` en `package.json`. A la fecha, `npm audit` continúa reportando la vulnerabilidad porque `sequelize` no publica aún una versión que refiera una release corregida. No ejecutar `npm audit fix --force` para evitar degradar `sequelize` a `1.x`. Mantener seguimiento del issue en el repositorio oficial de `sequelize` y actualizar apenas se publique una versión estable con el parche.

## Pruebas manuales

- **GET**: `curl http://localhost:4000/forms/1`
- **PUT**:
  ```bash
  curl --location --request PUT 'http://localhost:4000/forms/1' \
    --header 'Content-Type: application/json' \
    --data '{
      "person": { "lastName": "Perez", "firstName": "Ana", "documentNumber": "12345678", "birthDate": null, "nationalityId": null, "birthCityId": null },
      "contact": { "mobilePhone": "111333555", "emailAddress": "ana.militar@example.com" },
      "graduate": { "graduateType": "Militar", "militaryRankId": 1, "forceId": 1 },
      "address": { "street": "Av. San Martín", "streetNumber": 500, "cityId": 1 }
    }'
  ```
- **PDF**: `curl --location --request POST 'http://localhost:4000/forms/1/pdf' --output formulario-1.pdf`

## Auditoría

- Ejecutar `npm audit --omit=dev`. El reporte mostrará el aviso GHSA-9965-vmph-33xx debido a la dependencia transitiva `validator`. El override a `validator@^13.11.0` mitiga el riesgo sin alterar `sequelize`. Documentar este estado en cada despliegue hasta que exista una versión oficial corregida.
