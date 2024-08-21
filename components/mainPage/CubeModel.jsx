'use client'

import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default function CubeModel() {
  const { scene } = useGLTF('/model/Cube.glb')
  // const { scene } = useLoader(GLTFLoader, '')

  return (
    <div className='w-full h-full overscroll-none'>
      <Canvas>
        <ambientLight intensity={3} />
        <OrbitControls enableZoom={false} />
        <Center>
          <primitive object={scene} scale={1.4} />
        </Center>
      </Canvas>
    </div>
  )
}
