// components/CubeModel.js
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center } from '@react-three/drei'

export default function CubeModel() {
  const { scene } = useGLTF('/model/Cube.glb')

  return (
    <div className='w-full h-full overscroll-none'>
      <Canvas>
        <ambientLight intensity={3} />
        <OrbitControls enableZoom={false} />
        {/* 使用 Center 组件将模型居中 */}
        <Center>
          <primitive object={scene} scale={1.4} />
        </Center>
      </Canvas>
    </div>
  )
}
