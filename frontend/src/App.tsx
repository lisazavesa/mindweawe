import { useEffect, useState } from "react"
import axios from "axios"
import { GraphCanvas } from "reagraph"

function App() {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  useEffect(() => {
    axios.get("http://localhost:3000/graph").then((res) => {
      setNodes(res.data.nodes)
      setEdges(res.data.edges)
    })
  }, [])

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0f172a" }}>
      <GraphCanvas
        nodes={nodes}
        edges={edges}
        draggable
        layoutType="forceDirected2d"
        edgeInterpolation="curved"
        cameraMode="pan"
      />
    </div>
  )
}

export default App