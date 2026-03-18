import { useEffect, useState } from "react"
import axios from "axios"
import { GraphCanvas } from "reagraph"

interface Topic {
  id: number
  title: string
  description?: string
  necessary?: { id: number; title: string; type: string }[]
  recommended?: { id: number; title: string; type: string }[]
}

function App() {
  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState<any[]>([])
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [isSubgraph, setIsSubgraph] = useState(false)

  const loadFullGraph = async () => {
    const res = await axios.get("http://localhost:3000/graph")
    setNodes(res.data.nodes)
    setEdges(res.data.edges)
    setIsSubgraph(false)
    setSelectedTopic(null)
  }

  useEffect(() => {
    loadFullGraph()
  }, [])

  const handleNodeClick = async (node: any) => {
    try {
      // 📦 тема
      const topicRes = await axios.get(`http://localhost:3000/topics/${node.id}`)
      setSelectedTopic(topicRes.data)

      // 📦 подграф
      const graphRes = await axios.get(`http://localhost:3000/graph/${node.id}`)
      const { center, outgoing, incoming } = graphRes.data

      const newNodes = [
        {
          id: String(center.id),
          label: center.title,
          size: 30,
        },
        ...outgoing.map((t: any) => ({
          id: String(t.id),
          label: t.title,
          size: 12,
        })),
        ...incoming.map((t: any) => ({
          id: String(t.id),
          label: t.title,
          size: 12,
        })),
      ]

      const uniqueNodes = Array.from(
        new Map(newNodes.map((n) => [n.id, n])).values()
      )

      const newEdges = [
        ...outgoing.map((t: any) => ({
          id: `${center.id}-${t.id}`,
          source: String(center.id),
          target: String(t.id),
        })),
        ...incoming.map((t: any) => ({
          id: `${t.id}-${center.id}`,
          source: String(t.id),
          target: String(center.id),
        })),
      ]

      setNodes(uniqueNodes)
      setEdges(newEdges)
      setIsSubgraph(true)
    } catch (e) {
      console.error("Ошибка при загрузке подграфа", e)
    }
  }

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      
      {/* 🔵 ГРАФ */}
      <div style={{ flex: 1, background: "#0f172a", position: "relative" }}>
        
        {isSubgraph && (
          <button
            onClick={loadFullGraph}
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              padding: "10px",
              background: "#ffffff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            ← Назад к графу
          </button>
        )}

        <GraphCanvas
          nodes={nodes}
          edges={edges}
          draggable
          layoutType="forceDirected2d"
          edgeInterpolation="linear"
          cameraMode="pan"
          onNodeClick={handleNodeClick}
          edgeArrowPosition="none"
          nodeSize={(node) => node.size}
        />
      </div>

      {/* 🟡 БОКОВАЯ ПАНЕЛЬ */}
      {selectedTopic && (
        <div
          style={{
            width: 350,
            padding: 20,
            background: "#ffffff",
            color: "#000",
            borderLeft: "1px solid #ddd",
            overflowY: "auto",
          }}
        >
          <h2>{selectedTopic.title}</h2>
          <p>{selectedTopic.description || "Описание отсутствует"}</p>

          {selectedTopic.necessary?.length > 0 && (
            <div>
              <strong>Обязательные темы:</strong>
              <ul>
                {selectedTopic.necessary.map((t) => (
                  <li key={t.id}>{t.title}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedTopic.recommended?.length > 0 && (
            <div>
              <strong>Рекомендуемые темы:</strong>
              <ul>
                {selectedTopic.recommended.map((t) => (
                  <li key={t.id}>{t.title}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => setSelectedTopic(null)}
            style={{
              marginTop: 20,
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              background: "#0f172a",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Закрыть
          </button>
        </div>
      )}
    </div>
  )
}

export default App