import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Home, 
  Play, 
  Pause,
  Settings,
  Maximize
} from "lucide-react";

interface ProjectNode {
  id: string;
  name: string;
  position: [number, number, number];
  status: 'completed' | 'in-progress' | 'at-risk' | 'delayed' | 'pending';
  completion: number;
  dependencies: string[];
}

interface DigitalTwinProps {
  projectData: ProjectNode[];
  isSimulationRunning: boolean;
  onToggleSimulation: () => void;
  onNodeClick: (nodeId: string) => void;
}

const statusColors = {
  completed: '#10b981',
  'in-progress': '#3b82f6', 
  'at-risk': '#f59e0b',
  delayed: '#ef4444',
  pending: '#6b7280'
};

function ProjectNode({ node, onClick, isAnimated }: { 
  node: ProjectNode; 
  onClick: (nodeId: string) => void;
  isAnimated: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && isAnimated) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={() => onClick(node.id)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={statusColors[node.status]} 
          transparent 
          opacity={0.8}
          emissive={hovered ? statusColors[node.status] : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
      
      {/* Completion indicator */}
      <mesh position={[0, -(1.2 - node.completion / 100 * 1.2) / 2, 0]}>
        <cylinderGeometry args={[0.6, 0.6, node.completion / 100 * 1.2]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>

      {/* Simple text label - using basic mesh instead of Text component */}
      <mesh position={[0, 1.5, 0]}>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function SimpleGrid() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial color="#333333" wireframe />
    </mesh>
  );
}

export function DigitalTwin({ 
  projectData, 
  isSimulationRunning, 
  onToggleSimulation, 
  onNodeClick 
}: DigitalTwinProps) {
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              3D Digital Twin
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Live
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Interactive project visualization with real-time updates
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={onToggleSimulation}
              variant={isSimulationRunning ? "outline" : "default"}
              size="sm"
            >
              {isSimulationRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Simulate
                </>
              )}
            </Button>
            
            <Button variant="ghost" size="icon-sm">
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="icon-sm">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative h-[500px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg overflow-hidden">
          <Canvas
            camera={{ position: [10, 10, 10], fov: 50 }}
            className="w-full h-full"
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            {/* Simple Grid */}
            <SimpleGrid />
            
            {/* Project Nodes */}
            {projectData.map((node) => (
              <ProjectNode
                key={node.id}
                node={node}
                onClick={onNodeClick}
                isAnimated={isSimulationRunning}
              />
            ))}
            
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={30}
            />
          </Canvas>

          {/* 3D Controls Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button variant="glass" size="icon-sm">
              <Home className="w-4 h-4" />
            </Button>
            <Button variant="glass" size="icon-sm">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="glass" size="icon-sm">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="glass" size="icon-sm">
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>

          {/* Status Legend */}
          <div className="absolute bottom-4 left-4 glass p-3 rounded-lg">
            <div className="text-sm font-medium text-foreground mb-2">Status Legend</div>
            <div className="space-y-1 text-xs">
              {Object.entries(statusColors).map(([status, color]) => (
                <div key={status} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-foreground capitalize">
                    {status.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="absolute top-4 left-4 glass p-3 rounded-lg">
            <div className="text-sm font-medium text-foreground mb-2">Live Metrics</div>
            <div className="space-y-1 text-xs text-foreground">
              <div>Nodes: {projectData.length}</div>
              <div>Completed: {projectData.filter(n => n.status === 'completed').length}</div>
              <div>At Risk: {projectData.filter(n => n.status === 'at-risk').length}</div>
              <div>Avg Progress: {Math.round(projectData.reduce((acc, n) => acc + n.completion, 0) / projectData.length)}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}