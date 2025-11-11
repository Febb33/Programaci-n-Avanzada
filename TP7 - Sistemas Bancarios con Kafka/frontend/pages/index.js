
import { memo, useEffect, useRef, useState } from "react";

// Bordes del HUD
const HudCorners = memo(() => (
  <>
    <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-500/80"></div>
    <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-500/80"></div>
    <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-500/80"></div>
    <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-500/80"></div>
  </>
));
HudCorners.displayName = "HudCorners";


// Indicador del estado del sistema
const SystemStatusIndicator = memo(({ status }) => {
  const styles = {
    ONLINE: ["text-green-400", "bg-green-500"],
    EXECUTING: ["text-yellow-400", "bg-yellow-500 animate-pulse"],
    PROCESSING: ["text-orange-400", "bg-orange-500 animate-slow-pulse"],
    STANDBY: ["text-blue-400", "bg-blue-500"],
    MONITORING: ["text-cyan-400", "bg-cyan-500 animate-pulse-fast"],
  };
  const [textColor, pulse] = styles[status] || styles.MONITORING;

  return (
    <div className="flex items-center space-x-3 transition-colors duration-500">
      <div className={`w-3 h-3 rounded-full ${pulse}`}></div>
      <span className={`${textColor} font-mono text-sm font-bold tracking-widest`}>
        {status}
      </span>
    </div>
  );
});
SystemStatusIndicator.displayName = "SystemStatusIndicator";


export default function Home() {
  const [txId, setTxId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState("ONLINE");
  const [metrics, setMetrics] = useState({ latency: 0, throughput: 0 });
  const [currentTime, setCurrentTime] = useState("");
  const wsRef = useRef(null);

  // Reloj y métricas
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString());
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    const metricInterval = setInterval(() => {
      setMetrics({
        latency: Math.floor(Math.random() * 10),
        throughput: Math.floor(Math.random() * 1000),
      });
    }, 2500);

    const statuses = ["ONLINE", "MONITORING", "PROCESSING", "STANDBY"];
    const statusInterval = setInterval(() => {
      setSystemStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 4000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(statusInterval);
      clearInterval(metricInterval);
    };
  }, []);


  // Conexión WebSocket
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4001");
    wsRef.current = ws;

    ws.onmessage = (msg) => {
      const ev = JSON.parse(msg.data);
      setEvents((prev) => [...prev.slice(-50), ev]);
    };

    ws.onerror = () => console.warn("Error en WebSocket");
    ws.onclose = () => console.log("Conexión WebSocket cerrada");

    return () => ws.close();
  }, []);


  // Iniciar transacción
  async function iniciarTransaccion() {
    setLoading(true);
    setSystemStatus("EXECUTING");
    setEvents([]);

    try {
      const res = await fetch("http://localhost:3001/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromAccount: "A1", toAccount: "A2", amount: 100 }),
      });
      const data = await res.json();
      if (!data.transactionId) throw new Error("No se recibió el transactionId");

      setTxId(data.transactionId);
      console.log("Transacción iniciada:", data.transactionId);

      const ws = wsRef.current;
      if (ws) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ action: "subscribe", transactionId: data.transactionId }));
          console.log("Suscripción enviada:", data.transactionId);
        } else {
          ws.onopen = () => {
            ws.send(JSON.stringify({ action: "subscribe", transactionId: data.transactionId }));
            console.log("Suscripción enviada al abrir WebSocket:", data.transactionId);
          };
        }
      } else {
        console.warn("WebSocket no inicializado todavía");
      }
    } catch (err) {
      console.error("Error al iniciar la transacción:", err);
      setEvents((prev) => [
        ...prev,
        { type: "Reversed", timestamp: Date.now(), reason: "API_ERROR_500" },
      ]);
    } finally {
      setLoading(false);
      setSystemStatus("MONITORING");
    }
  }


  // Estilo de cada tipo de evento
  const getEventStyle = (type) => {
    const styles = {
      FundsReserved: { color: "#00ff88", icon: "⬡", label: "Fondos Reservados" },
      Committed: { color: "#00ffff", icon: "◆", label: "Transacción Confirmada" },
      Notified: { color: "#ff00ff", icon: "◈", label: "Notificación Enviada" },
      FraudChecked: { color: "#ffff00", icon: "⬢", label: "Chequeo de Fraude" },
      Reversed: { color: "#ff0044", icon: "✕", label: "Transacción Revertida" },
      default: { color: "#8888ff", icon: "○", label: type },
    };
    return styles[type] || styles.default;
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-gray-200">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-blue-900/20"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="border-b border-cyan-500/30 bg-black/50 backdrop-blur-sm shadow-md">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="text-xl font-bold text-cyan-400 font-sans tracking-widest">
                TP7_SISTEMA_BANCARIO_KAFKA
              </div>
              <div className="text-green-400 font-mono text-xs">
                [{currentTime || "SINCRONIZANDO..."}]
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">ESTADO_DEL_SISTEMA</div>
                <SystemStatusIndicator status={systemStatus} />
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">CANT_EVENTOS</div>
                <div className="text-cyan-400 font-mono text-sm font-bold">
                  {events.length.toString().padStart(3, "0")}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <div className="border border-cyan-500/30 bg-black/60 p-6 rounded-lg relative">
              <HudCorners />
              <h2 className="text-cyan-400 font-mono text-sm mb-6 border-b border-cyan-500/20 pb-2">
                INTERFAZ_DE_COMANDO
              </h2>
              <button
                onClick={iniciarTransaccion}
                disabled={loading}
                className={`w-full border-2 px-6 py-4 font-mono text-sm tracking-widest transition-all ${
                  loading
                    ? "border-yellow-500/50 text-yellow-400"
                    : "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
                }`}
              >
                {loading ? "EJECUTANDO..." : "INICIAR_TRANSACCIÓN"}
              </button>

              {txId && (
                <div className="border border-green-500/30 bg-green-900/20 p-4 rounded mt-4">
                  <div className="text-xs text-green-400 mb-2 border-b border-green-500/20 pb-1">
                    TRANSACCIÓN_ACTIVA
                  </div>
                  <div className="font-mono text-green-300 text-xs break-all">
                    {txId}
                  </div>
                </div>
              )}
            </div>

            <div className="border border-cyan-500/30 bg-black/60 p-6 rounded-lg">
              <h2 className="text-cyan-400 font-mono text-sm mb-4 border-b border-cyan-500/20 pb-2">
                MÉTRICAS_DEL_SISTEMA
              </h2>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">ESTADO_DE_KAFKA</span>
                  <span className="text-green-400">ACTIVO</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span className="text-gray-400">LATENCIA_PROMEDIO</span>
                  <span className="text-cyan-400">{metrics.latency} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">RENDIMIENTO</span>
                  <span className="text-cyan-400">{metrics.throughput} msg/s</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 border border-cyan-500/30 bg-black/60 p-6 rounded-lg overflow-y-auto">
            <HudCorners />
            <h2 className="text-cyan-400 font-mono text-sm mb-6 border-b border-cyan-500/20 pb-2">
              HISTORIAL_DE_EVENTOS
            </h2>
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                <div className="text-6xl mb-4 opacity-30">📡</div>
                <div className="font-mono tracking-widest">ESPERANDO_SEÑAL</div>
              </div>
            ) : (
              <div className="space-y-6">
                {events
                  .slice()
                  .reverse()
                  .map((e, i) => {
                    const style = getEventStyle(e.type);
                    return (
                      <div
                        key={i}
                        className="relative pl-10 border-l-4 rounded-lg"
                        style={{ borderColor: style.color }}
                      >
                        <div
                          className="ml-4 mt-1 text-sm font-mono"
                          style={{ color: style.color }}
                        >
                          {style.icon} {style.label} —{" "}
                          {new Date(e.timestamp).toLocaleTimeString()}
                        </div>
                        {e.reason && (
                          <div className="text-xs text-gray-400 ml-4">
                            Motivo: {e.reason}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </main>

        <footer className="border-t border-cyan-500/30 bg-black/50 py-3 mt-4 text-xs font-mono text-gray-400">
          <div className="container mx-auto px-6 flex justify-between">
            <div>
              <span className="text-green-400">[OK]</span> CONEXIÖN_API: 3001 &nbsp;
              <span className="text-green-400">[OK]</span> CONEXIÓN_WS: 4001
            </div>
            <div className="text-cyan-400">TP7_SISTEMA_BANCARIO</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

