# Sistema de Análisis de Datos Concurrente

Este proyecto es un sistema de análisis avanzado que permite gestionar y procesar flujos de datos biológicos en tiempo real. Utiliza Firebase para obtener datos, los procesa concurrentemente con técnicas de multihilo en Java, y visualiza los resultados utilizando D3.js en un entorno web.

## Descripción del Proyecto

El sistema está diseñado para manejar múltiples flujos de datos de manera eficiente, garantizando la sincronización y el procesamiento en tiempo real sin afectar la performance del sistema. Se utilizan hilos concurrentes, técnicas de sincronización, WebSockets para enviar datos en tiempo real y D3.js para visualizar gráficas de rendimiento.

### Componentes del Proyecto

El proyecto incluye varias clases y módulos clave que trabajan en conjunto para lograr el objetivo:

### Clases Java

#### 1. `FirebaseConfig`
Esta clase configura Firebase para que se pueda conectar con la base de datos en tiempo real. Utiliza un archivo de credenciales para inicializar la aplicación Firebase.

- **Métodos**:
  - `initializeFirebase`: Inicializa Firebase con las credenciales y la URL de la base de datos.

#### 2. `WebSocketConfig`
Esta clase habilita y configura WebSockets en la aplicación Spring Boot, lo que permite enviar y recibir datos en tiempo real.

- **Métodos**:
  - `registerWebSocketHandlers`: Registra el handler de WebSocket que se encarga de manejar las conexiones entrantes.

#### 3. `FirebaseService`
Esta clase es responsable de leer datos de Firebase y procesarlos concurrentemente utilizando un `ForkJoinPool`. También se encarga de enviar los datos procesados a través del WebSocket.

- **Métodos**:
  - `readData`: Lee los datos desde Firebase, los procesa y los envía al WebSocket.
  - `FirebaseCallback`: Una interfaz que permite manejar los datos una vez leídos desde Firebase.

#### 4. `DataProcessor`
Esta clase maneja el procesamiento concurrente de los datos utilizando un `ForkJoinTask`. Implementa un algoritmo para dividir y procesar los datos biológicos de manera eficiente.

- **Métodos**:
  - `compute`: Divide el trabajo en dos tareas si el tamaño de los datos es grande, y los procesa concurrentemente.
  - `process`: Calcula el promedio de creatinina para los fumadores y realiza cualquier procesamiento necesario de los datos.

#### 5. `DataWebSocketHandler`
Esta clase maneja las conexiones WebSocket y envía datos procesados en tiempo real a los clientes conectados.

- **Métodos**:
  - `sendProcessedData`: Enviar los datos procesados a todos los clientes conectados al WebSocket.

#### 6. `FirebaseController`
Este controlador expone un endpoint REST para permitir la lectura de datos desde Firebase.

- **Endpoints**:
  - `/read`: Permite leer datos de Firebase a través de un path proporcionado como parámetro.

### Visualización de Datos (Frontend)

La visualización de los datos procesados se realiza utilizando **D3.js**. Se han implementado diferentes gráficos para representar visualmente los datos biológicos en tiempo real.

#### 1. Gráfico de Fumadores y No Fumadores
Representa la distribución de fumadores y no fumadores por género en un gráfico de barras.

#### 2. Gráfico de Creatinina (Box Plot)
Muestra la distribución de los niveles de creatinina sérica entre fumadores y no fumadores utilizando un gráfico de caja (box plot).

#### 3. Gráfico En Blanco
Este gráfico está vacío por decisión de diseño actual.

#### 4. Gráfico de Enzimas Hepáticas
Compara los niveles de las enzimas AST, ALT y Gtp entre fumadores y no fumadores en un gráfico de barras.

### Archivos Frontend

- **`index.html`**: Página principal que incluye los contenedores para los gráficos y carga los archivos `script.js` y `style.css`.
- **`style.css`**: Define los estilos para la disposición de los gráficos en una cuadrícula y el formato visual general.
- **`script.js`**: Contiene toda la lógica de D3.js para generar y actualizar los gráficos en tiempo real.

### Requisitos

- **Java 11 o superior**
- **Spring Boot**
- **Firebase SDK**
- **D3.js**

### Link al repositorio:

https://github.com/ConcurrenteSistemaAnalisisDatos/SistemaAnalisisDatosConcurrente.git
