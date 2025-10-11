

| Nombre del Caso de Uso: Generar solicitud de título |  |  | ID: CU\_07 |
| ----- | :---: | :---- | ----- |
| **Prioridad**:    ☒ Esencial        ☐ Útil       ☐ Deseable |  |  | **Significativo para la Arquitectura**:   ☐ Si   ☐ No |
| **Complejidad**:     ☐ Simple      ☐ Mediano      ☒ Complejo      ☐ Muy Complejo      ☐ Extremadamente Complejo   |  |  |  |
| **Actor Principal**: Egresado |  |  | **Actor Secundario**: Sistema |
| **Tipo de Caso de Uso:**                      ☒  Concreto                                       ☐   Abstracto |  |  |  |
| **Objetivo**: Registrar a la solicitud con un número único y al usuario que la generó. Que se guarde la solicitud con el estado “pendiente  carga de requisitos”. Que se guarde fecha y hora en se genero la solicitud. |  |  |  |
| **Precondiciones:** Que los datos se hayan importado correctamente al sistema de control de solicitudes de título. |  |  |  |
| **Post- Condiciones**   |  |  | **Éxito:** Que el sistema genere un número único para identificar la solicitud de título. Que se registre  el usuario que la generó. Que se guarde el título solicitado asociado a la solicitud Que el estado del título se modifique a “en trámite”. Que la solicitud se guarde con el estado “pendiente de cargar requisitos”. Que se registre la fecha en que se generó la solicitud. Que los requisitos de la solicitud se inicializan como no completos. |
|  |  |  | **Fracasos:**  Escenario 1 de fracaso Escenario 2 de fracaso |
| **Curso Normal** |  |  | **Alternativas** |
| El caso de uso comienza cuando el egresado selecciona “Solicitud de título” |  |  |  |
| El sistema inicia el caso de uso “Buscar títulos a solicitar”. |  |  |  |
| El egresado selecciona un título. |  |  |  |
| El sistema genera identificador único para la solicitud. |  |  |  |
| El sistema registra el egresado que generó la solicitud. |  |  |  |
| El sistema guarda el tipo de solicitud |  |  |  |
| El sistema guarda la fecha en se generó la solicitud. |  |  |  |
| El sistema inicializa el estado de la solicitud a “Iniciada” |  |  |  |
| El sistema modifica la etapa actual de validación para la solicitud. |  |  |  |
| El sistema inicializa en estado del título a “Solicitado”. |  |  |  |
| El sistema presenta una pantalla para completar la solicitud. |  |  |  |
| El egresado selecciona “Generar formulario de solicitud” |  |  |  |
| El sistema inicia el caso de uso “Generar formulario de solicitud” |  |  |  |
| El egresado selecciona “Completar requisitos” |  |  |  |
| El sistema inicia el caso de uso “Completar requisitos”. |  |  |  |
| Fin del Caso de Uso |  |  |  |
| **Observaciones:**  |  |  |  |
| **Requerimientos No Funcionales asociados** (hacer referencia a la parte 4.3 de la ERS, si están allí descriptos)**:**  |  |  |  |
| **Fuente** (reunión, entrevista, documento, etc.)**:**  |  |  |  |
| **Asociaciones:** |  | **Casos de Uso de Extensión: ** |  |
|  |  | **Casos de Uso de Inclusión: ** |  |
|  |  | **Casos de Uso donde se incluye: ** |  |
|  |  | **Casos de Uso a los que extiende: ** |  |
|  |  | **Casos de Uso de Generalización: ** |  |
| **Historia de Cambios** |  |  |  |
| **Versión** | **Fecha** |  | **Descripción del Cambio** |
| **1.0** | **23/10/2024** |  |  |
| **1.1** | **20/05/2025** |  | **Se agrego registrar usuario que generó la solicitud** |
| **1.2** | **10/06/2025** |  | **Se reunumero** |

| Nombre del Caso de Uso: Buscar títulos a solicitar |  |  | ID: CU\_08 NUEVO AGREGADO |
| ----- | :---: | ----- | ----- |
| **Prioridad**:    ☒ Esencial        ☐ Útil       ☐ Deseable |  |  | **Significativo para la Arquitectura**:   ☐ Si   ☐ No |
| **Complejidad**:     ☐ Simple      ☐ Mediano      ☒ Complejo      ☐ Muy Complejo      ☐ Extremadamente Complejo   |  |  |  |
| **Actor Principal**: Usuario |  |  | **Actor Secundario**:  |
| **Tipo de Caso de Uso:**                      ☒  Concreto                                       ☐   Abstracto |  |  |  |
| **Objetivo**: Presentar en pantalla los títulos que pueden ser solicitados |  |  |  |
| **Precondiciones:** El haya títulos en estado “Pendiente de solicitar”. |  |  |  |
| **Post- Condiciones**   |  |  | **Éxito:** Presentar lista de titulos. |
|  |  |  | **Fracasos:**  Escenario 1 de fracaso Escenario 2 de fracaso |
| **Curso Normal** |  |  | **Alternativas** |
| Con el id\_usuario logueado busca en la tabla EGRESADO id\_usuario logueado=EGRESADO.id\_egresado |  |  | 1.A.1 El id\_usuario logueado no es egresado, el sistema emite un mensaje diciendo “No corresponde a un egresado”. 1.A.2 Pasa al punto 6\. |
| Con el id\_egresado consulta la tabla PERSONA y obtiene los datos personales |  |  |  |
| Con el id\_egresado consulta en la tabla CURSA y obtiene Carrera, Facultad y Plan. |  |  |  |
| Con el id\_Plan busca el título asociado al plan cuyo estado esté “pendiente de solicitar”. |  |  | 4.A.1 El sistema no encuentra título en estado “pendiente de solicitar”. 4.A.2 El sistema presenta el mensaje “No hay títulos para solicitar”. |
| El sistema presenta en pantalla los títulos a solicitar.  |  |  |  |
| Fin del caso de uso. |  |  |  |
| **Observaciones:**  |  |  |  |
| **Requerimientos No Funcionales asociados** (hacer referencia a la parte 4.3 de la ERS, si están allí descriptos)**:**  |  |  |  |
| **Fuente** (reunión, entrevista, documento, etc.)**:**  |  |  |  |
| **Asociaciones:** |  |  | **Casos de Uso de Extensión: ** |
|  |  |  | **Casos de Uso de Inclusión: ** |
|  |  |  | **Casos de Uso donde se incluye: Generar solicitud de titulo** |
|  |  |  | **Casos de Uso a los que extiende: ** |
|  |  |  | **Casos de Uso de Generalización: ** |
| **Historia de Cambios** |  |  |  |
| **Versión** | **Fecha** | **Descripción del Cambio** | **Autor** |
| **1.0** | **09/06/2025** | **No se desarrollo con anterioridad** | **Romero-Rodriguez** |
| **1.1** | **17/07/205** | **Se agregaron datos de las tablas que intervienen** |  |
| **1.2** | **10/08/25** | **Se modificaron las clases que intervienen en el caso de uso** |  |

| Nombre del Caso de Uso: Generar formulario expedición de titulo  |  |  |  |  |  |  |  | ID: CU\_09 |  |
| ----- | ----- | :---- | ----- | :---- | :---- | :---- | ----- | :---- | ----- |
| **Prioridad**:    ☒ Esencial        ☐ Útil       ☐ Deseable |  |  |  |  |  | **Significativo para la Arquitectura**:   ☐ Si   ☐ No |  |  |  |
| **Complejidad**:     ☐ Simple      ☐ Mediano      ☒ Complejo      ☐ Muy Complejo      ☐ Extremadamente Complejo   |  |  |  |  |  |  |  |  |  |
| **Actor Principal**: Egresado |  |  |  |  | **Actor Secundario**: Sistema |  |  |  |  |
| **Tipo de Caso de Uso:**                      ☒  Concreto                                       ☐   Abstracto |  |  |  |  |  |  |  |  |  |
| **Objetivo**: Ratificar, rectificar y completar datos del formulario. |  |  |  |  |  |  |  |  |  |
| **Precondiciones:** Que los datos se hayan importado correctamente al sistema de control de solicitudes de título. |  |  |  |  |  |  |  |  |  |
| **Post- Condiciones**   |  |  |  | **Éxito:** Que se registren los cambio introducido |  |  |  |  |  |
|  |  |  |  | **Fracasos:**  Escenario 1 de fracaso Escenario 2 de fracaso |  |  |  |  |  |
| **Curso Normal** |  |  |  |  |  |  | **Alternativas** |  |  |
| El caso de uso comienza cuando el usuario seleccionar “Generar formulario de expedición de título” |  |  |  |  |  |  |  |  |  |
| El sistema presenta el formulario con campos habilitados para ratificar o rectificar “Datos Personales”. Una vez ratificados o rectificados los campos, se presiona “Siguiente”. |  |  |  |  |  |  | 2.A.1 – Si falta completar algún campo obligatorio de ser completado , el sistema emite un mensaje “corroborar carga”. 2.A.2 – El usuario vuelve a cargar. 2.A.3 – El usuario presiona “Siguiente” 2.A.4 \- El usuario presiona “Guardar” 2.A.5 \- El sistema guarda los datos. |  |  |
| El sistema presenta el formulario con campos habilitados para ratificar o rectificar “Datos de Contacto”. Una vez ratificados o rectificados los campos, se presiona “Siguiente”.  |  |  |  |  |  |  | 3.A.1 – Si falta completar algún campo obligatorio de ser completado , el sistema emite un mensaje “corroborar carga”. 3.A.2 – El usuario vuelve a cargar. 3.A.3 – El usuario presiona “Siguiente”. 3.A.4 \- El usuario presiona “Guardar”. 3.A.5 \- El sistema guarda los datos. |  |  |
| El sistema presenta el formulario  “Tipo de egresado”, el usuario selecciona la opción “Civil”. |  |  |  |  |  |  | 4.A.1 \- El usuario selecciona “Militar” 4.A.2 \- El sistema despliega menú para seleccionar grado y fuerza 4.A.3 \- El usuario selecciona grado y fuerza. 4.A.3 \- El usuario selecciona “Guardar”. 4.A.5 \- El sistema guarda los datos. |  |  |
| El usuario selecciona “Guardar”. |  |  |  |  |  |  |  |  |  |
| El sistema guarda los datos y presenta una ventana emergente con el mensaje “los datos se guardaron correctamente”. |  |  |  |  |  |  |  |  |  |
| El usuario selecciona “Generar archivo pdf”. |  |  |  |  |  |  |  |  |  |
| Inicia caso de uso “Generar archivo pdf”. |  |  |  |  |  |  |  |  |  |
| Fin del Caso de Uso |  |  |  |  |  |  |  |  |  |
| **Observaciones:**  Datos de la página  “Datos Personales”:  Tipo documento – Nro. documento – Apellido –Nombre-Fecha de nacimiento \- Nacionalidad \- País \- Ciudad de Nacimiento \- Provincia. Datos de la página “Datos de Contacto”: Calle-Nro.-Localidad-Provincia-Cel-Mail. Datos del a página “Tipo de egresado”: Tipo \- Grado \- Fuerza. |  |  |  |  |  |  |  |  |  |
| **Requerimientos No Funcionales asociados** (hacer referencia a la parte 4.3 de la ERS, si están allí descriptos)**:**  |  |  |  |  |  |  |  |  |  |
| **Fuente** (reunión, entrevista, documento, etc.)**:**  |  |  |  |  |  |  |  |  |  |
| **Asociaciones:** |  | **Casos de Uso de Extensión: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Inclusión: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso donde se incluye: Generar archivo pdf.** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso a los que extiende: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Generalización: ** |  |  |  |  |  |  |  |
| **Historia de Cambios** |  |  |  |  |  |  |  |  |  |
| **Versión** | **Fecha** |  | **Descripción del Cambio** |  |  |  |  |  | **Autor** |
| **1.0** | **23/10/2024** |  |  |  |  |  |  |  | **Romero-Rodriguez** |
|  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |

| Nombre del Caso de Uso: Completar requisitos  |  |  |  |  |  |  |  | ID: CU\_10 |  |
| ----- | :---: | :---- | ----- | :---- | :---- | :---- | ----- | :---- | ----- |
| **Prioridad**:    ☒ Esencial        ☐ Útil       ☐ Deseable |  |  |  |  |  | **Significativo para la Arquitectura**:   ☐ Si   ☐ No |  |  |  |
| **Complejidad**:     ☐ Simple      ☐ Mediano      ☒ Complejo      ☐ Muy Complejo      ☐ Extremadamente Complejo   |  |  |  |  |  |  |  |  |  |
| **Actor Principal**: Usuario |  |  |  |  | **Actor Secundario**: Sistema |  |  |  |  |
| **Tipo de Caso de Uso:**                      ☒  Concreto                                       ☐   Abstracto |  |  |  |  |  |  |  |  |  |
| **Objetivo**: Cargar archivo para un requisito |  |  |  |  |  |  |  |  |  |
| **Precondiciones:** Que se haya generado la solicitud de título |  |  |  |  |  |  |  |  |  |
| **Post- Condiciones**   |  |  |  | **Éxito:**  Que se guarde el archivo. Que se registre la fecha en que el requisito fue cargado Que se registre el usuario que cargo el requisito. |  |  |  |  |  |
|  |  |  |  | **Fracasos:**  Escenario 1 de fracaso Escenario 2 de fracaso |  |  |  |  |  |
| **Curso Normal** |  |  |  |  |  |  | **Alternativas** |  |  |
| El caso de uso comienza cuando el usuario seleccionar “Completar requisitos” |  |  |  |  |  |  |  |  |  |
| El sistema inicia el caso de uso “Buscar requisito pendiente de carga” |  |  |  |  |  |  | 2.A.1 Busca requisitos “Rechazados” |  |  |
| El usuario selecciona un requisito. |  |  |  |  |  |  |  |  |  |
| El usuario selecciona el archivo |  |  |  |  |  |  |  |  |  |
| El sistema guarda en la tabla SOLICITUD\_REQUISITO\_INSTANCIA la ruta del archivo cargado, fecha en que el requisito fue cargado,  el usuario  que completó el requisito, modifica el estado actual de la instancia, modifica la version y la etapa\_flujo\_ultima\_revision. |  |  |  |  |  |  |  |  |  |
| Fin del Caso de Uso |  |  |  |  |  |  |  |  |  |
| **Observaciones:** Requisitos Foto \- Copia DNI-Copia DNI certificada-Copia titulo secundario-Comprobante pago diploma-Comprobante pago certificado de estudio-Formulario expedición de titulo-Disposición de Decanato-Certificado de equivalencias-Certificado de estudio  provisorio-Formulario pedido de expedición de título-Certificado de estudio Final. |  |  |  |  |  |  |  |  |  |
| **Requerimientos No Funcionales asociados** (hacer referencia a la parte 4.3 de la ERS, si están allí descriptos)**:**  |  |  |  |  |  |  |  |  |  |
| **Fuente** (reunión, entrevista, documento, etc.)**:**  |  |  |  |  |  |  |  |  |  |
| **Asociaciones:** |  | **Casos de Uso de Extensión: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Inclusión: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso donde se incluye: Identificar usuario y etapa de validación \- Buscar de requisitos pendiente de carga** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso a los que extiende: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Generalización: ** |  |  |  |  |  |  |  |
| **Historia de Cambios** |  |  |  |  |  |  |  |  |  |
| **Versión** | **Fecha** |  | **Descripción del Cambio** |  |  |  |  |  | **Autor** |
| **1.0** | **23/10/2024** |  |  |  |  |  |  |  | **Romero-Rodriguez** |
| **1.1** | **20/05/2025** |  | **Se incluye caso de uso identificar usuario y etapa de validación** |  |  |  |  |  |  |
| **1.2** | **05/06/2025** |  | **Se incluye caso de uso Buscar de requisitos pendientes de carga y Enviar notificacion.** |  |  |  |  |  |  |

| Nombre del Caso de Uso: Generar archivo pdf. |  |  |  |  |  |  |  | ID: CU\_11 |  |
| ----- | ----- | :---- | ----- | :---- | :---- | :---- | ----- | :---- | ----- |
| **Prioridad**:    ☒ Esencial        ☐ Útil       ☐ Deseable |  |  |  |  |  | **Significativo para la Arquitectura**:   ☐ Si   ☐ No |  |  |  |
| **Complejidad**:     ☐ Simple      ☐ Mediano      ☒ Complejo      ☐ Muy Complejo      ☐ Extremadamente Complejo   |  |  |  |  |  |  |  |  |  |
| **Actor Principal**:  |  |  |  |  | **Actor Secundario**:  |  |  |  |  |
| **Tipo de Caso de Uso:**                      ☒  Concreto                                       ☐   Abstracto |  |  |  |  |  |  |  |  |  |
| **Objetivo**: Crear un archivo pdf. |  |  |  |  |  |  |  |  |  |
| **Precondiciones:** Que se haya cargado el formulario.. |  |  |  |  |  |  |  |  |  |
| **Post- Condiciones**   |  |  |  | **Éxito:** Que se genere el archivo pdf. |  |  |  |  |  |
|  |  |  |  | **Fracasos:**  Escenario 1 de fracaso Escenario 2 de fracaso |  |  |  |  |  |
| **Curso Normal** |  |  |  |  |  |  | **Alternativas** |  |  |
| El caso de uso comienza cuando se selecciona “Generar archivo pdf.”. |  |  |  |  |  |  |  |  |  |
| El sistema genera el archivo pdf. |  |  |  |  |  |  |  |  |  |
| Fin del caso de uso |  |  |  |  |  |  |  |  |  |
| **Observaciones:**  |  |  |  |  |  |  |  |  |  |
| **Requerimientos No Funcionales asociados** (hacer referencia a la parte 4.3 de la ERS, si están allí descriptos)**:**  |  |  |  |  |  |  |  |  |  |
| **Fuente** (reunión, entrevista, documento, etc.)**:**  |  |  |  |  |  |  |  |  |  |
| **Asociaciones:** |  | **Casos de Uso de Extensión: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Inclusión: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso donde se incluye: Generar ficha solicitud de titulo.** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso a los que extiende: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Generalización: ** |  |  |  |  |  |  |  |
| **Historia de Cambios** |  |  |  |  |  |  |  |  |  |
| **Versión** | **Fecha** |  | **Descripción del Cambio** |  |  |  |  |  | **Autor** |
| **1.0** | **23/10/2024** |  |  |  |  |  |  |  | **Romero-Rodriguez** |
|  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |

| Nombre del Caso de Uso: Buscar requisitos obligatorios |  |  |  |  |  |  |  | ID: CU\_12 NUEVO AGREGADO |  |
| ----- | ----- | :---- | ----- | :---- | :---- | :---- | ----- | :---- | ----- |
| **Prioridad**:    ☒ Esencial        ☐ Útil       ☐ Deseable |  |  |  |  |  | **Significativo para la Arquitectura**:   ☐ Si   ☐ No |  |  |  |
| **Complejidad**:     ☐ Simple      ☐ Mediano      ☒ Complejo      ☐ Muy Complejo      ☐ Extremadamente Complejo                                                                                                                                                                                                                                                                                                                 |  |  |  |  |  |  |  |  |  |
| **Actor Principal**: Usuario |  |  |  |  | **Actor Secundario**:  |  |  |  |  |
| **Tipo de Caso de Uso:**                      ☒  Concreto                                       ☐   Abstracto |  |  |  |  |  |  |  |  |  |
| **Objetivo**: Presentar requisitos asociados a una solicitud.                                                                       |  |  |  |  |  |  |  |  |  |
| **Precondiciones:** Que se haya generado una solicitud Que se haya guardado el tipo de solicitud. |  |  |  |  |  |  |  |  |  |
| **Post- Condiciones**   |  |  |  | **Éxito:** Realizar la consulta para obtener los requisitos asociados a una solicitud. |  |  |  |  |  |
|  |  |  |  | **Fracasos:**  Escenario 1 de fracaso Escenario 2 de fracaso |  |  |  |  |  |
| **Curso Normal** |  |  |  |  |  |  | **Alternativas** |  |  |
| El sistema con la id\_solicitud busca en la tabla SOLICITUD el  id\_tipo\_solicitud recupera información del tipo de solicitud desde la tabla TIPO\_SOLICITUD |  |  |  |  |  |  |  |  |  |
| Con el id\_tipo\_solicitud recupera los requisitos obligatorios para ese tipo de solicitud desde la tabla TIPO\_SOLICITUD\_REQUISITO |  |  |  |  |  |  |  |  |  |
| Con el id del requisito recupera información (nombre del requisito)  desde la tabla REQUISITO |  |  |  |  |  |  |  |  |  |
| El sistema presenta listado de requisitos |  |  |  |  |  |  |  |  |  |
| Fin del caso de uso |  |  |  |  |  |  |  |  |  |
| **Observaciones:**  |  |  |  |  |  |  |  |  |  |
| **Requerimientos No Funcionales asociados** (hacer referencia a la parte 4.3 de la ERS, si están allí descriptos)**:**  |  |  |  |  |  |  |  |  |  |
| **Fuente** (reunión, entrevista, documento, etc.)**:**  |  |  |  |  |  |  |  |  |  |
| **Asociaciones:** |  | **Casos de Uso de Extensión: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Inclusión: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso donde se incluye:** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso a los que extiende: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Generalización: ** |  |  |  |  |  |  |  |
| **Historia de Cambios** |  |  |  |  |  |  |  |  |  |
| **Versión** | **Fecha** |  | **Descripción del Cambio** |  |  |  |  |  | **Autor** |
| **1.0** | **01/06/2025** |  | **No se desarrollo con anterioridad.** |  |  |  |  |  | **Romero-Rodriguez** |
| **.** |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |

| Nombre del Caso de Uso: Buscar requisito pendiente de carga |  |  |  | ID: CU\_13 NUEVO AGREGADO |  |  |  |  |  |
| ----- | ----- | :---- | ----- | :---- | ----- | ----- | :---- | :---- | :---- |
| **Prioridad**:    ☒ Esencial        ☐ Útil       ☐ Deseable |  |  |  |  |  |  |  |  | **Significativo para la Arquitectura**:   ☐ Si   ☐ No |
| **Complejidad**:     ☐ Simple      ☐ Mediano      ☒ Complejo      ☐ Muy Complejo      ☐ Extremadamente Complejo                                                                                                                                                                                                                                                                                                                 |  |  |  |  |  |  |  |  |  |
| **Actor Principal**: Usuario |  |  |  |  |  |  |  | **Actor Secundario**:  |  |
| **Tipo de Caso de Uso:**                      ☒  Concreto                                       ☐   Abstracto |  |  |  |  |  |  |  |  |  |
| **Objetivo**: Presentar en pantalla los requisitos pendientes de carga.                                                                               |  |  |  |  |  |  |  |  |  |
| **Precondiciones:** Que el usuario este logueado. Que el sistema identifique al usuario logueado. Que se haya generado una solicitud de titulo. |  |  |  |  |  |  |  |  |  |
| **Post- Condiciones**   |  |  |  |  |  |  | **Éxito:** Realizar la consulta para obtener los requisitos pendiente de carga para una solicitud de título |  |  |
|  |  |  |  |  |  |  | **Fracasos:**  Escenario 1 de fracaso Escenario 2 de fracaso |  |  |
| **Curso Normal** |  |  | **Alternativas** |  |  |  |  |  |  |
| El sistema con id del usuario logueado busca en la tabla USUARIO id\_nivel\_control, si id\_nivel\_control= “egresado” |  |  |  |  |  |  |  |  |  |
|  |  |  | 2.A.1 El sistema con id del usuario logueado busca en la tabla USUARIO id\_nivel\_control, si id\_nivel\_control= “administrativo” |  |  |  |  |  |  |
| Consulta tabla SOLICITUD\_REQUISITO\_INSTANCIA y filtra los requisitos por estado\_actual\_instancia |  |  | 3.A.1 Con el id\_nivel\_control busca en la tabla ETAPA\_FLUJO las etapas donde el id\_nivel\_control del usuario coincida con el id\_nivel\_control 3.A.2 Consulta la tabla SOLICITUD\_REQUISITO\_INSTANCIA y filtra los requisitos por id\_etapa\_flujo\_ultima revision y estado\_actual\_instancia |  |  |  |  |  |  |
| El sistema presenta los requisitos. |  |  |  |  |  |  |  |  |  |
| Fin del caso de uso. |  |  |  |  |  |  |  |  |  |
| **Observaciones:**  |  |  |  |  |  |  |  |  |  |
| **Requerimientos No Funcionales asociados** (hacer referencia a la parte 4.3 de la ERS, si están allí descriptos)**:**  |  |  |  |  |  |  |  |  |  |
| **Fuente** (reunión, entrevista, documento, etc.)**:**  |  |  |  |  |  |  |  |  |  |
| **Asociaciones:** |  | **Casos de Uso de Extensión:** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Inclusión: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso donde se incluye:** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso a los que extiende: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Generalización: ** |  |  |  |  |  |  |  |
| **Historia de Cambios** |  |  |  |  |  |  |  |  |  |
| **Versión** | **Fecha** |  |  |  | **Descripción del Cambio** | **Autor** |  |  |  |
| **1.0** | **01/06/2025** |  |  |  | **No se desarrollo con anterioridad.** | **Romero-Rodriguez** |  |  |  |
| **1.1** | **17/07/2025** |  |  |  | **Se incluyeron tablas involucradas en el caso de uso** |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |

| Nombre del Caso de Uso: Buscar requisito pendiente de verificar |  |  |  |  |  |  |  | ID: CU\_14 NUEVO AGREGADO |  |
| ----- | ----- | :---- | ----- | :---- | :---- | :---- | ----- | :---- | ----- |
| **Prioridad**:    ☒ Esencial        ☐ Útil       ☐ Deseable |  |  |  |  |  | **Significativo para la Arquitectura**:   ☐ Si   ☐ No |  |  |  |
| **Complejidad**:     ☐ Simple      ☐ Mediano      ☒ Complejo      ☐ Muy Complejo      ☐ Extremadamente Complejo                                                                                                                                                                                                                                                                                                                 |  |  |  |  |  |  |  |  |  |
| **Actor Principal**: Sistema |  |  |  |  | **Actor Secundario**:  |  |  |  |  |
| **Tipo de Caso de Uso:**                      ☒  Concreto                                       ☐   Abstracto |  |  |  |  |  |  |  |  |  |
| **Objetivo**: Presentar en pantalla los requisitos que el usuario puede verificar                                                                   |  |  |  |  |  |  |  |  |  |
| **Precondiciones:** Que el usuario este logueado. Que el sistema identifique al usuario logueado. Que el usuario logueado tengo un nivel de control específico. Que se haya generado una solicitud de titulo. |  |  |  |  |  |  |  |  |  |
| **Post- Condiciones**   |  |  |  | **Éxito:** Realizar la consulta para obtener los requisitos pendiente de ser verificados |  |  |  |  |  |
|  |  |  |  | **Fracasos:**  Escenario 1 de fracaso Escenario 2 de fracaso |  |  |  |  |  |
| **Curso Normal** |  |  |  |  |  |  | **Alternativas** |  |  |
| El sistema con el id de la solicitud llama al caso de uso “Buscar requisitos” |  |  |  |  |  |  |  |  |  |
| Con el id\_usuario logueado busca en tabla USUARIO.id\_nivel\_control |  |  |  |  |  |  |  |  |  |
| Con id\_nivel\_control consulta la tabla ETAPA\_FLUJO y obtiene todas los id\_etapa\_flujo donde el id\_nivel\_control del usuario coincida con ETAPA\_FLUJO.id\_nivel\_control. |  |  |  |  |  |  |  |  |  |
| El sistema consulta la tabla SOLICITUD\_REQUISITO\_INSTANCIA y filtra los requisitos por estado\_actual\_instancia=”pendiente de revision” y por  id\_etapa\_flujo\_ultima revision=ETAPA\_FLUJO.id\_etapa\_flujo |  |  |  |  |  |  |  |  |  |
| El sistema presenta la lista de requisitos a verificar. |  |  |  |  |  |  |  |  |  |
| Fin del caso de uso. |  |  |  |  |  |  |  |  |  |
| **Observaciones:**  |  |  |  |  |  |  |  |  |  |
| **Requerimientos No Funcionales asociados** (hacer referencia a la parte 4.3 de la ERS, si están allí descriptos)**:**  |  |  |  |  |  |  |  |  |  |
| **Fuente** (reunión, entrevista, documento, etc.)**:**  |  |  |  |  |  |  |  |  |  |
| **Asociaciones:** |  | **Casos de Uso de Extensión: Buscar requisitos** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Inclusión: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso donde se incluye:** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso a los que extiende: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Generalización: ** |  |  |  |  |  |  |  |
| **Historia de Cambios** |  |  |  |  |  |  |  |  |  |
| **Versión** | **Fecha** |  | **Descripción del Cambio** |  |  |  |  |  | **Autor** |
| **1.0** | **01/06/2025** |  | **No se desarrollo con anterioridad.** |  |  |  |  |  | **Romero-Rodriguez** |
| **1.1** | **17/07/2025** |  | **Se agregaron las tablas que intervienen en este caso de uso** |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |

| Nombre del Caso de Uso: Verificar requisito |  |  |  |  |  |  |  | ID: CU\_15 MODIFICADO VIEJO CU\_13 |  |
| ----- | ----- | :---- | ----- | :---- | :---- | :---- | ----- | :---- | ----- |
| **Prioridad**:    ☒ Esencial        ☐ Útil       ☐ Deseable |  |  |  |  |  | **Significativo para la Arquitectura**:   ☐ Si   ☐ No |  |  |  |
| **Complejidad**:     ☐ Simple      ☐ Mediano      ☒ Complejo      ☐ Muy Complejo      ☐ Extremadamente Complejo   |  |  |  |  |  |  |  |  |  |
| **Actor Principal**: Usuario |  |  |  |  | **Actor Secundario**: Sistema |  |  |  |  |
| **Tipo de Caso de Uso:**                      ☒  Concreto                                       ☐   Abstracto |  |  |  |  |  |  |  |  |  |
| **Objetivo**: Permitir al usuario revisar, evaluar y aprobar o rechazar un requisito |  |  |  |  |  |  |  |  |  |
| **Precondiciones:** Que exista una solicitud Que esa solicitud tenga instancia en la tabla SOLICITUD\_REQUISITO\_INSTANCIA cuyo estado actual sean “pendientes de revision” Que el id\_usuario\_logueado sea autorizado a realizar la v |  |  |  |  |  |  |  |  |  |
| **Post- Condiciones**   |  |  |  | **Éxito:**  |  |  |  |  |  |
|  |  |  |  | **Fracasos:**  Escenario 1 de fracaso Escenario 2 de fracaso |  |  |  |  |  |
| **Curso Normal** |  |  |  |  |  |  | **Alternativas** |  |  |
| El usuario selecciona del menú “Solicitudes” |  |  |  |  |  |  |  |  |  |
| El sistema inicia el caso de uso “Buscar requisitos pendientes de verificar”. |  |  |  |  |  |  |  |  |  |
| El usuario selecciona un requisito. |  |  |  |  |  |  |  |  |  |
| El usuario revisa el archivo |  |  |  |  |  |  |  |  |  |
| El usuario selecciona “Aprobar” |  |  |  |  |  |  | 7.A.1 El usuario selecciona “Rechazar”. 7.A.2 El usuario ingresa los motivos del rechazo |  |  |
| El sistema actualiza en la tabla SOLICITUD\_REQUISITO\_INSTANCIA los siguientes campos: id\_usuario\_que\_verifico, fecha\_ultima\_revision current\_timestamp, modifica estado\_actual\_instancia “aprobado”, id\_etapa\_flujo\_ultima\_revision |  |  |  |  |  |  | 9.A.1 Modificar el estado\_actual\_instancia “rechazado” |  |  |
| El sistema crea una nueva entrada en la tabla SOLICITUD\_REQUISTO\_ETAPA\_FLUJO, registra id\_solicitu\_requisito\_instancia, id\_etapa\_flujo, id\_usuario\_verificador, id\_resultado\_verficacion |  |  |  |  |  |  |  |  |  |
| El sistema inicia el caso de uso “Enviar notificación”. |  |  |  |  |  |  |  |  |  |
| FIn del caso de uso. |  |  |  |  |  |  |  |  |  |
| **Observaciones:**  |  |  |  |  |  |  |  |  |  |
| **Requerimientos No Funcionales asociados** (hacer referencia a la parte 4.3 de la ERS, si están allí descriptos)**:**  |  |  |  |  |  |  |  |  |  |
| **Fuente** (reunión, entrevista, documento, etc.)**:**  |  |  |  |  |  |  |  |  |  |
| **Asociaciones:** |  | **Casos de Uso de Extensión: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Inclusión: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso donde se incluye: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso a los que extiende: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Generalización: ** |  |  |  |  |  |  |  |
| **Historia de Cambios** |  |  |  |  |  |  |  |  |  |
| **Versión** | **Fecha** |  | **Descripción del Cambio** |  |  |  |  |  | **Autor** |
| **1.0** | **01/06/2025** |  |  |  |  |  |  |  | **Romero-Rodriguez** |
|  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |

| Nombre del Caso de Uso: Obtener datos estado requisitos |  |  |  |  |  |  |  | ID: CU\_16  NUEVO AGREGADO |  |
| ----- | ----- | ----- | :---- | :---- | :---- | :---- | ----- | :---- | ----- |
| **Prioridad**:    ☒ Esencial        ☐ Útil       ☐ Deseable |  |  |  |  |  | **Significativo para la Arquitectura**:   ☐ Si   ☐ No |  |  |  |
| **Complejidad**:     ☐ Simple      ☐ Mediano      ☒ Complejo      ☐ Muy Complejo      ☐ Extremadamente Complejo |  |  |  |  |  |  |  |  |  |
| **Actor Principal**: Sistema |  |  |  |  | **Actor Secundario**:  |  |  |  |  |
| **Tipo de Caso de Uso:**                      ☒  Concreto                                       ☐   Abstracto |  |  |  |  |  |  |  |  |  |
| **Objetivo**: Monitorear el estado del los requisitos de una solicitud                                                            |  |  |  |  |  |  |  |  |  |
| **Precondiciones:** Que se hayan iniciado cualquiera de  los casos de uso Completar requisitos o Verificar requisito o Subsanar requisito |  |  |  |  |  |  |  |  |  |
| **Post- Condiciones**   |  |  |  | **Éxito:** Recuperar una lista de cada requisito con el estado actual en la última versión, el id\_solicitud y su estado actual. |  |  |  |  |  |
|  |  |  |  | **Fracasos:**  Escenario 1 de fracaso Escenario 2 de fracaso |  |  |  |  |  |
| **Curso Normal** |  |  |  |  |  |  | **Alternativas** |  |  |
| El sistema con el id\_solicitud consulta la tabla SOLICITUD para obtener SOLICITUD.id\_estado\_actual\_solicitud y SOLICITUD.id\_tipo\_solicitud |  |  |  |  |  |  |  |  |  |
| Con el id\_tipo\_solicitud consulta tabla TIPO\_SOLICITUD\_REQUISITO y obtiene todos los requisitos que son obligatorios para ese tipo de solicitud |  |  |  |  |  |  |  |  |  |
| Para cada id\_requisito consulta la tabla SOLICITUD\_REQUISITO\_INSTANCIA y filtra las instancia por id\_solicitud e id\_requisito para obtener el estado\_actual\_instancia y su ultima version\_cumplimiento |  |  |  |  |  |  |  |  |  |
| Fin del caso de uso. |  |  |  |  |  |  |  |  |  |
| **Observaciones:**  |  |  |  |  |  |  |  |  |  |
| **Requerimientos No Funcionales asociados** (hacer referencia a la parte 4.3 de la ERS, si están allí descriptos)**:**  |  |  |  |  |  |  |  |  |  |
| **Fuente** (reunión, entrevista, documento, etc.)**:**  |  |  |  |  |  |  |  |  |  |
| **Asociaciones:** |  |  | **Casos de Uso de Extensión:** |  |  |  |  |  |  |
|  |  |  | **Casos de Uso de Inclusión: ** |  |  |  |  |  |  |
|  |  |  | **Casos de Uso donde se incluye: Completar requisitos, Verificar requisitos, Subsanar requisitos** |  |  |  |  |  |  |
|  |  |  | **Casos de Uso a los que extiende: ** |  |  |  |  |  |  |
|  |  |  | **Casos de Uso de Generalización: ** |  |  |  |  |  |  |
| **Historia de Cambios** |  |  |  |  |  |  |  |  |  |
| **Versión** | **Fecha** | **Descripción del Cambio** |  |  |  |  |  |  | **Autor** |
| **1.0** | **17/07/2025** | **No se desarrollo con anterioridad.** |  |  |  |  |  |  | **Romero-Rodriguez** |
|  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |

| Nombre del Caso de Uso: Evaluar estado de la solicitud |  |  |  |  |  |  |  | ID: CU\_17  NUEVO AGREGADO |  |
| ----- | ----- | ----- | :---- | :---- | :---- | :---- | ----- | :---- | ----- |
| **Prioridad**:    ☒ Esencial        ☐ Útil       ☐ Deseable |  |  |  |  |  | **Significativo para la Arquitectura**:   ☐ Si   ☐ No |  |  |  |
| **Complejidad**:     ☐ Simple      ☐ Mediano      ☒ Complejo      ☐ Muy Complejo      ☐ Extremadamente Complejo                                                                                                                                                                                                                                                                                                                 |  |  |  |  |  |  |  |  |  |
| **Actor Principal**: Sistema |  |  |  |  | **Actor Secundario**:  |  |  |  |  |
| **Tipo de Caso de Uso:**                      ☒  Concreto                                       ☐   Abstracto |  |  |  |  |  |  |  |  |  |
| **Objetivo**: Contener y ejecutar las reglas de negocio para determinar el estado de la solicitud a partir del estado de los requisitos                                                        |  |  |  |  |  |  |  |  |  |
| **Precondiciones:** Obtener datos del caso de uso Obtener datos estado requisitos |  |  |  |  |  |  |  |  |  |
| **Post- Condiciones**   |  |  |  | **Éxito:** Obtener el nuevo estado de la solicitud |  |  |  |  |  |
|  |  |  |  | **Fracasos:**  Escenario 1 de fracaso Escenario 2 de fracaso |  |  |  |  |  |
| **Curso Normal** |  |  |  |  |  |  | **Alternativas** |  |  |
| El sistema recibe el id\_solcitud y estado de la solicitud y la lista de los requisitos y el estado en su última version |  |  |  |  |  |  |  |  |  |
| El sistema itera a través de las reglas. |  |  |  |  |  |  |  |  |  |
| El sistema encuentra la primera regla que se evalua como TRUE |  |  |  |  |  |  |  |  |  |
| El sistema devuelve un nuevo estado de la solicitud |  |  |  |  |  |  |  |  |  |
| Fin del caso de uso. |  |  |  |  |  |  |  |  |  |
| **Observaciones:**  |  |  |  |  |  |  |  |  |  |
| **Requerimientos No Funcionales asociados** (hacer referencia a la parte 4.3 de la ERS, si están allí descriptos)**:**  |  |  |  |  |  |  |  |  |  |
| **Fuente** (reunión, entrevista, documento, etc.)**:**  |  |  |  |  |  |  |  |  |  |
| **Asociaciones:** |  |  | **Casos de Uso de Extensión:** |  |  |  |  |  |  |
|  |  |  | **Casos de Uso de Inclusión: ** |  |  |  |  |  |  |
|  |  |  | **Casos de Uso donde se incluye: Obtener datos estado requisitos** |  |  |  |  |  |  |
|  |  |  | **Casos de Uso a los que extiende: ** |  |  |  |  |  |  |
|  |  |  | **Casos de Uso de Generalización: ** |  |  |  |  |  |  |
| **Historia de Cambios** |  |  |  |  |  |  |  |  |  |
| **Versión** | **Fecha** | **Descripción del Cambio** |  |  |  |  |  |  | **Autor** |
| **1.0** | **17/07/2025** | **No se desarrollo con anterioridad.** |  |  |  |  |  |  | **Romero-Rodriguez** |
|  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |

| Nombre del Caso de Uso: Actualizar estado de la solicitud |  |  |  |  |  |  |  | ID: CU\_18  NUEVO AGREGADO |  |
| ----- | ----- | :---- | ----- | :---- | :---- | :---- | ----- | :---- | ----- |
| **Prioridad**:    ☒ Esencial        ☐ Útil       ☐ Deseable |  |  |  |  |  | **Significativo para la Arquitectura**:   ☐ Si   ☐ No |  |  |  |
| **Complejidad**:     ☐ Simple      ☐ Mediano      ☒ Complejo      ☐ Muy Complejo      ☐ Extremadamente Complejo                                                                                                                                                                                                                                                                                                                 |  |  |  |  |  |  |  |  |  |
| **Actor Principal**: Sistema |  |  |  |  | **Actor Secundario**:  |  |  |  |  |
| **Tipo de Caso de Uso:**                      ☒  Concreto                                       ☐   Abstracto |  |  |  |  |  |  |  |  |  |
| **Objetivo**: Comparar el estado actual de la solicitud con el nuevo estado para modificar el estado de la solicitud                                                    |  |  |  |  |  |  |  |  |  |
| **Precondiciones:** Obtener datos del caso de uso Evaluar estado solicitud |  |  |  |  |  |  |  |  |  |
| **Post- Condiciones**   |  |  |  | **Éxito:** Si el nuevo estado es distinto al estado actual, cambiar el estado en la tabla SOLICITUD Crear una nueva entrada en la tabla SOLICITUD\_ESTADO\_HISTORIAL |  |  |  |  |  |
|  |  |  |  | **Fracasos:**  Escenario 1 de fracaso Escenario 2 de fracaso |  |  |  |  |  |
| **Curso Normal** |  |  |  |  |  |  | **Alternativas** |  |  |
| El sistema recibe el nuevo\_estado\_solicitud |  |  |  |  |  |  |  |  |  |
| El sistema compara el SOLICITUD.id\_estado\_actual\_solicitud con el nuevo\_estado\_solicitud |  |  |  |  |  |  |  |  |  |
| Si los estados son distintos busca en la tabla SOLICITUD\_ESTADO\_HISTORIAL con el id\_solicitud y establece Fecha\_finalizacion a CURRENT\_TIME |  |  |  |  |  |  | 3.A.1 Si el nuevo\_estado\_solicitud y el SOLICITUD.id\_estado\_actual son iguales la no se modifica el id\_estado\_actual 3.A.2 Fin del caso de uso |  |  |
| El sistema crea una nueva entrada en SOLICITUD\_ESTADO\_HISTORIAL con el nuevo estado establece id\_solicitud, id\_estado\_solicitud,  Fecha\_inicio a CURRENT\_TIME y Fecha\_finalizacion a NULL |  |  |  |  |  |  |  |  |  |
| Actualiza la tabla SOLICITUD el id\_estado\_actual\_solicitud |  |  |  |  |  |  |  |  |  |
| Fin del caso de uso. |  |  |  |  |  |  |  |  |  |
| **Observaciones:**  |  |  |  |  |  |  |  |  |  |
| **Requerimientos No Funcionales asociados** (hacer referencia a la parte 4.3 de la ERS, si están allí descriptos)**:**  |  |  |  |  |  |  |  |  |  |
| **Fuente** (reunión, entrevista, documento, etc.)**:**  |  |  |  |  |  |  |  |  |  |
| **Asociaciones:** |  | **Casos de Uso de Extensión:** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Inclusión: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso donde se incluye: Obtener datos estado requisitos, Evaluar estado solicitud** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso a los que extiende: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Generalización: ** |  |  |  |  |  |  |  |
| **Historia de Cambios** |  |  |  |  |  |  |  |  |  |
| **Versión** | **Fecha** |  | **Descripción del Cambio** |  |  |  |  |  | **Autor** |
| **1.0** | **17/07/2025** |  | **No se desarrollo con anterioridad.** |  |  |  |  |  | **Romero-Rodriguez** |
|  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |

| Nombre del Caso de Uso: Buscar solicitudes |  |  |  |  |  |  | ID: CU\_19 NUEVO AGREGADO |
| ----- | ----- | ----- | :---- | :---- | :---- | ----- | ----- |
| **Prioridad**:    ☒ Esencial        ☐ Útil       ☐ Deseable |  |  |  |  | **Significativo para la Arquitectura**:   ☐ Si   ☐ No |  |  |
| **Complejidad**:     ☐ Simple      ☐ Mediano      ☒ Complejo      ☐ Muy Complejo      ☐ Extremadamente Complejo   |  |  |  |  |  |  |  |
| **Actor Principal**: Usuario |  |  |  | **Actor Secundario**: Sistema |  |  |  |
| **Tipo de Caso de Uso:**                      ☒  Concreto                                       ☐   Abstracto |  |  |  |  |  |  |  |
| **Objetivo**: Permite a los usuarios buscar solicitudes a partir de diferentes criterios. |  |  |  |  |  |  |  |
| **Precondiciones:** Que el usuario este logueado Que se hayan generado solicitudes Seleccionar un criterio |  |  |  |  |  |  |  |
| **Post- Condiciones**   |  |  | **Éxito:** Que se muestren las solicitudes en pantalla. |  |  |  |  |
|  |  |  | **Fracasos:**  Escenario 1 de fracaso Escenario 2 de fracaso |  |  |  |  |
| **Curso Normal** |  |  |  |  |  | **Alternativas** |  |
| El usuario selecciona “Buscar solicitud” |  |  |  |  |  |  |  |
| El sistema presenta pantalla donde el usuario puede seleccionar un criterio de búsqueda |  |  |  |  |  |  |  |
| El usuario seleccionar criterio |  |  |  |  |  |  |  |
| El sistema realiza la búsqueda |  |  |  |  |  |  |  |
| El sistema presenta en pantalla las solicitudes |  |  |  |  |  | 5.A.1 El sistema no encuentra solicitudes 5.A.2 El sistema emite mensaje “No hay solicitudes generadas, quiere generar una solicitud” 5.A.3 El usuario selecciona NO 5.A.4 Fin del caso de uso 5.A.5 El usuario selecciona SÍ 5.A.6 Inicia caso de uso Generar solicitud |  |
| 6\. Fin del caso de uso |  |  |  |  |  |  |  |
| **Observaciones:** Criterios de busqueda: DNI, NRO\_SOLICITUD, ESTADO\_SOLICITUD, TIPO\_SOLICITUD, RANGO DE FECHAS |  |  |  |  |  |  |  |
| **Requerimientos No Funcionales asociados** (hacer referencia a la parte 4.3 de la ERS, si están allí descriptos)**:**  |  |  |  |  |  |  |  |
| **Fuente** (reunión, entrevista, documento, etc.)**:**  |  |  |  |  |  |  |  |
| **Asociaciones:** |  | **Casos de Uso de Extensión: ** |  |  |  |  |  |
|  |  | **Casos de Uso de Inclusión: ** |  |  |  |  |  |
|  |  | **Casos de Uso donde se incluye: Generar ficha solicitud de titulo.** |  |  |  |  |  |
|  |  | **Casos de Uso a los que extiende: ** |  |  |  |  |  |
|  |  | **Casos de Uso de Generalización: ** |  |  |  |  |  |
| **Historia de Cambios** |  |  |  |  |  |  |  |
| **Versión** | **Fecha** | **Descripción del Cambio** |  |  |  |  | **Autor** |
| **1.0** | **01/06/2025** | **No desarrollado con anterioridad.** |  |  |  |  | **Romero-Rodriguez** |
| **1.1** | **17/07/2025** | **Se reviso y modifico funcionalidad** |  |  |  |  |  |
|  |  |  |  |  |  |  |  |

| Nombre del Caso de Uso: Subsanar requisitos |  |  |  |  |  |  |  | ID: CU\_23  MODIFICACO |  |
| ----- | ----- | :---- | ----- | :---- | :---- | :---- | ----- | :---- | ----- |
| **Prioridad**:    ☒ Esencial        ☐ Útil       ☐ Deseable |  |  |  |  |  | **Significativo para la Arquitectura**:   ☐ Si   ☐ No |  |  |  |
| **Complejidad**:     ☐ Simple      ☐ Mediano      ☒ Complejo      ☐ Muy Complejo      ☐ Extremadamente Complejo   |  |  |  |  |  |  |  |  |  |
| **Actor Principal**: Usuario |  |  |  |  | **Actor Secundario**: Sistema |  |  |  |  |
| **Tipo de Caso de Uso:**                      ☒  Concreto                                       ☐   Abstracto |  |  |  |  |  |  |  |  |  |
| **Objetivo**: Permitir que el usuario cargue un nuevo archivo correspondiente a un requisito rechazado |  |  |  |  |  |  |  |  |  |
| **Precondiciones:** Que el archivo este cargado Que el estado de validación del requisito sea rechazado. |  |  |  |  |  |  |  |  |  |
| **Post- Condiciones**   |  |  |  | **Éxito:**  |  |  |  |  |  |
|  |  |  |  | **Fracasos:**  Escenario 1 de fracaso Escenario 2 de fracaso |  |  |  |  |  |
| **Curso Normal** |  |  |  |  |  |  | **Alternativas** |  |  |
| El usuario selecciona Solicitudes de titulo-\>Ver detalles |  |  |  |  |  |  |  |  |  |
| El sistema presenta el listado de los requisitos con su estado de validación |  |  |  |  |  |  |  |  |  |
| El estado de validación de los requisitos es “rechazado” |  |  |  |  |  |  |  |  |  |
| El usuario selecciona “Motivo”, se presenta en pantalla el motivo por el que el requisito fue rechazado |  |  |  |  |  |  |  |  |  |
| El usuario selecciona subsanar |  |  |  |  |  |  |  |  |  |
| El sistema inicia el caso de uso “Completar requisito”. |  |  |  |  |  |  |  |  |  |
| Fin del Caso de Uso |  |  |  |  |  |  |  |  |  |
| **Observaciones:**  |  |  |  |  |  |  |  |  |  |
| **Requerimientos No Funcionales asociados** (hacer referencia a la parte 4.3 de la ERS, si están allí descriptos)**:**  |  |  |  |  |  |  |  |  |  |
| **Fuente** (reunión, entrevista, documento, etc.)**:**  |  |  |  |  |  |  |  |  |  |
| **Asociaciones:** |  | **Casos de Uso de Extensión: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Inclusión: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso donde se incluye: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso a los que extiende: ** |  |  |  |  |  |  |  |
|  |  | **Casos de Uso de Generalización: ** |  |  |  |  |  |  |  |
| **Historia de Cambios** |  |  |  |  |  |  |  |  |  |
| **Versión** | **Fecha** |  | **Descripción del Cambio** |  |  |  |  |  | **Autor** |
| **1.0** | **23/10/2024** |  |  |  |  |  |  |  | **Romero-Rodriguez** |
|  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |

