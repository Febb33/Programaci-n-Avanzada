

// Ejercicio 1: Crear un objeto literal para un dispositivo de red
const router = {
    modelo: 2,
    marca: "Movistar",
    puertos: 3,
    velocidad: "100Mbps",
    soportaWifi: true
}


// Ejercicio 2: Array de dispositivos de red
const dispositivosRed = [
{ tipo: "Router", marca: "Cisco", modelo: "1941", precio: 1200 },
{ tipo: "Switch", marca: "TP-Link", modelo: "TL-SG108", precio: 150 },
{ tipo: "Firewall", marca: "Cisco", modelo: "ASA 5506-X", precio: 2500 },
{ tipo: "Access Point", marca: "Ubiquiti", modelo: "UniFi AP AC Pro", precio: 320 },
{ tipo: "Router", marca: "TP-Link", modelo: "Archer C7", precio: 180 }
];

// Ejercicio 3: Filtrar dispositivos por marca
const filtro = dispositivosRed.filter(f => f.marca == "TP-Link")
console.log("Filtro dispositivos por marca: ", filtro);


// Ejercicio 4: Mapear direcciones IP
const servidores = [
{ nombre: "Servidor Web", ip: "192.168.1.10", sistema: "Linux" },
{ nombre: "Servidor de Base de Datos", ip: "192.168.1.11", sistema: "Windows" },
{ nombre: "Servidor de Correo", ip: "192.168.1.12", sistema: "Linux" },
{ nombre: "Servidor DNS", ip: "192.168.1.13", sistema: "Linux" },
{ nombre: "Servidor de Archivos", ip: "192.168.1.14", sistema: "Windows" }
];

const ips = servidores.map(i => i.ip);
console.log("Las ip son: ", ips);


// Ejercicio 5: Filtrar y ordenar paquetes de datos
const paquetesDatos = [
{ id: 1, origen: "192.168.1.5", destino: "192.168.1.10", tamaño: 1200, prioridad: 3 },
{ id: 2, origen: "192.168.1.7", destino: "192.168.1.12", tamaño: 800, prioridad: 1 },
{ id: 3, origen: "192.168.1.3", destino: "192.168.1.11", tamaño: 1500, prioridad: 5 },
{ id: 4, origen: "192.168.1.8", destino: "192.168.1.14", tamaño: 950, prioridad: 2 },
{ id: 5, origen: "192.168.1.2", destino: "192.168.1.13", tamaño: 2000, prioridad: 4 }
];

const mayores = paquetesDatos.filter(m => m.tamaño > 1000)
mayores.sort(a => a.prioridad);
console.log("Filtro tamaño > 1000b: ", mayores);


// Ejercicio 6: Calcular estadísticas de red
const traficoRed = {
"08:00": 1250, // MB transferidos
"09:00": 1870,
"10:00": 2100,
"11:00": 1950,
"12:00": 1600,
"13:00": 1300,
"14:00": 1700,
"15:00": 2200,
"16:00": 1800,
"17:00": 1500
};

const total = Object.values(traficoRed).reduce((acum, valor) => acum + valor, 0);

console.log("Total MB transferidos:", total);

const horaMax = Object.entries(traficoRed).reduce((max, [hora, valor]) => {
  return valor > max[1] ? [hora, valor] : max;
});

console.log("Hora con mayor tráfico:", horaMax[0], "-", horaMax[1], "MB");


// Ejercicio 7: Analizar conexiones de red
const conexiones = [
{ id: 1, origen: "192.168.1.5", destino: "192.168.1.10", protocolo: "HTTP" },
{ id: 2, origen: "192.168.1.7", destino: "192.168.1.12", protocolo: "FTP" },
{ id: 3, origen: "192.168.1.3", destino: "192.168.1.11", protocolo: "SSH" },
{ id: 4, origen: "192.168.1.8", destino: "192.168.1.14", protocolo: "HTTP" },
{ id: 5, origen: "192.168.1.2", destino: "192.168.1.13", protocolo: "HTTPS" },
{ id: 6, origen: "192.168.1.6", destino: "192.168.1.10", protocolo: "FTP" },
{ id: 7, origen: "192.168.1.9", destino: "192.168.1.15", protocolo: "SSH" },
{ id: 8, origen: "192.168.1.4", destino: "192.168.1.11", protocolo: "HTTP" }
];

// Crea un objeto para contar las conexiones por protocolo
const conexionesPorProtocolo = conexiones.reduce((acc, conn) => {
  acc[conn.protocolo] = (acc[conn.protocolo] || 0) + 1;
  return acc;
}, {});

console.log("Conexiones por protocolo:", conexionesPorProtocolo);


// Ejercicio 8: Filtrar y transformar alertas de seguridad
const dispositivos = [
{ id: 1, nombre: "PC-Desarrollo", ip: "192.168.1.5", tipo: "Estación de trabajo" },
{ id: 2, nombre: "PC-Marketing", ip: "192.168.1.7", tipo: "Estación de trabajo" },
{ id: 3, nombre: "Servidor-Web", ip: "192.168.1.10", tipo: "Servidor" },
{ id: 4, nombre: "Servidor-BD", ip: "192.168.1.11", tipo: "Servidor" }
];

const conexionesActivas = [
{ origen: "192.168.1.5", destino: "192.168.1.10", protocolo: "HTTP", bytes: 8500 },
{ origen: "192.168.1.7", destino: "192.168.1.11", protocolo: "MySQL", bytes: 12000 },
{ origen: "192.168.1.5", destino: "192.168.1.11", protocolo: "MySQL", bytes: 9200 }
];

// Crea un informe que combine la información de dispositivos y conexiones
// Encuentra los dispositivos de origen y destino
// Tu código aquí
// Retorna un objeto con la información combinada

const informeActividad = conexionesActivas.map(conexion => {
  const dispositivoOrigen = dispositivos.find(d => d.ip === conexion.origen);
  const dispositivoDestino = dispositivos.find(d => d.ip === conexion.destino);

  return {
    origen: dispositivoOrigen ? dispositivoOrigen.nombre : conexion.origen,
    destino: dispositivoDestino ? dispositivoDestino.nombre : conexion.destino,
    protocolo: conexion.protocolo,
    bytes: conexion.bytes
  };
});

console.log("Informe de actividad de red:", informeActividad);


// Ejercicio 9: Combinar datos de dispositivos y conexiones
const topologiaRed = {
  nodos: [
    { id: "A", tipo: "Router", ubicacion: "Planta 1" },
    { id: "B", tipo: "Switch", ubicacion: "Planta 1" },
    { id: "C", tipo: "Switch", ubicacion: "Planta 2" },
    { id: "D", tipo: "Switch", ubicacion: "Planta 3" },
    { id: "E", tipo: "Router", ubicacion: "Planta 3" }
  ],
  conexiones: [
    { origen: "A", destino: "B", ancho_banda: 1000 },
    { origen: "A", destino: "C", ancho_banda: 1000 },
    { origen: "B", destino: "C", ancho_banda: 100 },
    { origen: "B", destino: "D", ancho_banda: 100 },
    { origen: "C", destino: "D", ancho_banda: 100 },
    { origen: "C", destino: "E", ancho_banda: 1000 },
    { origen: "D", destino: "E", ancho_banda: 1000 }
  ]
};

const conexionesPorNodo = {};
topologiaRed.nodos.forEach(nodo => {
  conexionesPorNodo[nodo.id] = 0;
});

topologiaRed.conexiones.forEach(conexion => {
  conexionesPorNodo[conexion.origen]++;
  conexionesPorNodo[conexion.destino]++;
});

const nodosOrdenados = Object.entries(conexionesPorNodo)
  .sort((a, b) => b[1] - a[1]);

const sugerencias = nodosOrdenados
  .filter(([nodo, cantidad]) => cantidad > 2)
  .map(([nodo, cantidad]) => `Nodo ${nodo} tiene ${cantidad} conexiones. Considerar aumentar ancho de banda.`);


console.log("Conexiones por nodo:", conexionesPorNodo);
console.log("Nodos ordenados por número de conexiones:", nodosOrdenados);
console.log("Sugerencias de optimización:", sugerencias);


// Ejercicio 10: Analizar y optimizar topología de red
const conexionesPorNodo2 = {};
topologiaRed.nodos.forEach(nodo => {
  conexionesPorNodo[nodo.id] = 0;
});

topologiaRed.conexiones.forEach(conexion => {
  conexionesPorNodo[conexion.origen]++;
  conexionesPorNodo[conexion.destino]++;
});

const nodosOrdenados2 = Object.entries(conexionesPorNodo)
  .sort((a, b) => b[1] - a[1]);

console.log("Conexiones por nodo:", conexionesPorNodo);
console.log("Nodos ordenados por número de conexiones:", nodosOrdenados);


const sugerencias2 = nodosOrdenados
  .filter(([nodo, cantidad]) => cantidad > 2)
  .map(([nodo, cantidad]) => `Nodo ${nodo} tiene ${cantidad} conexiones. Considerar aumentar ancho de banda.`);

console.log("Sugerencias de optimización:", sugerencias);


