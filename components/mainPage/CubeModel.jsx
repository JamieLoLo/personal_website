'use client'

import { useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Center } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Mesh } from 'three'

function MeshComponent() {
  const fileUrl = '/model/Cube.glb'
  const mesh = useRef(null)
  const gltf = useLoader(GLTFLoader, fileUrl)

  return (
    <mesh ref={mesh} scale={1.4}>
      <primitive object={gltf.scene} />
    </mesh>
  )
}

export default function CubeModel() {
  return (
    <div className='w-full h-full overscroll-none'>
      <Canvas>
        <ambientLight intensity={3} />
        <OrbitControls enableZoom={false} />
        <MeshComponent />
      </Canvas>
    </div>
  )
}
