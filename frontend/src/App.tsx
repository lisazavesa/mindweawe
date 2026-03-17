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

  useEffect(() => {
    axios.get("http://localhost:3000/graph").then((res) => {
      setNodes(res.data.nodes)
      setEdges(res.data.edges)
    })
  }, [])

  const handleNodeClick = (node: any) => {
    axios.get(`http://localhost:3000/topics/${node.id}`).then((res) => {
      setSelectedTopic(res.data)
    })
  }

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0f172a", position: "relative" }}>
      <GraphCanvas
        nodes={nodes}
        edges={edges}
        draggable
        layoutType="forceDirected2d"
        edgeInterpolation="curved"
        cameraMode="pan"
        // nodeLabel={(node) => node.title} // показываем название узла
        onNodeClick={handleNodeClick} // обработчик клика
        edgeArrowPosition="none" 

        
      />

      {selectedTopic && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 300,
            padding: 20,
            background: "#ffffff",
            color: "#000000",
            borderRadius: 8,
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            zIndex: 10,
          }}
        >
          <h3>{selectedTopic.title}</h3>
          <p>{selectedTopic.description || "Описание отсутствует"}</p>

          {selectedTopic.necessary && selectedTopic.necessary.length > 0 && (
            <div>
              <strong>Обязательные темы:</strong>
              <ul>
                {selectedTopic.necessary.map((t) => (
                  <li key={t.id}>{t.title}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedTopic.recommended && selectedTopic.recommended.length > 0 && (
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
              marginTop: 10,
              padding: "5px 10px",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              background: "#0f172a",
              color: "#ffffff",
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