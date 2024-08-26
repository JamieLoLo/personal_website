import { useEffect, useRef, forwardRef, useState } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { uiState } from '@/lib/valtioState'
import ProjectInfo from './ProjectInfo'

const fileUrl = '/model/Cube.glb'

const MeshComponent = forwardRef((props, ref) => {
  const gltf = useLoader(GLTFLoader, fileUrl)
  const { scene, camera } = useThree()
  const [isLoaded, setIsLoaded] = useState(false)
  const initialClickPosition = useRef({ x: 0, y: 0 })
  const router = useRouter()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())

  useEffect(() => {
    if (!isLoaded) {
      uiState.loading.loadingVisible = true
    } else {
      setTimeout(() => {
        uiState.loading.loadingVisible = false
      }, 1000)
    }
  }, [isLoaded])

  useEffect(() => {
    if (!camera || !camera.isPerspectiveCamera) {
      console.error('Camera is not a valid PerspectiveCamera')
      return
    }

    const nodes = gltf.nodes

    const modelData = [
      { name: 'Cube001_1', texture: '/model/texture/czechTexture.jpg' },
      { name: 'Cube001_2', texture: '/model/texture/ukrainianTexture.jpg' },
      { name: 'Cube001_3', texture: '/model/texture/breezeTexture.jpg' },
      { name: 'Cube001_4', texture: '/model/texture/gihrafTexture.JPG' },
      { name: 'Cube001_5', texture: '/model/texture/fortuneTexture.jpg' },
      { name: 'Cube001_6', texture: '/model/texture/goBlogTexture.jpg' },
    ]

    modelData.forEach((item) => {
      if (nodes && nodes[item.name]) {
        const textureLoader = new THREE.TextureLoader()
        const newTexture = textureLoader.load(item.texture, () => {
          setIsLoaded(true)
        })

        newTexture.repeat.set(1, -1)
        newTexture.offset.set(0, 1)

        const material = nodes[item.name].material
        material.map = newTexture

        if (item.name === 'Cube001_6') {
          material.opacity = 0.9
          material.transparent = true
          nodes[item.name].userData = { onClick: () => router.push('/blog') }
        } else {
          material.opacity = 0.9
          material.transparent = true
        }
        material.side = THREE.DoubleSide
        material.needsUpdate = true
      }
    })

    if (nodes.Cube001) {
      const textureLoader = new THREE.TextureLoader()
      const texture = textureLoader.load(
        '/model/texture/cubeTexture.jpg',
        () => {
          setIsLoaded(true)
        }
      )

      const material = new THREE.MeshStandardMaterial({
        emissive: 'white',
        side: THREE.DoubleSide,
        map: texture,
        emissiveMap: texture,
        opacity: 0.7,
        transparent: true,
      })
      nodes.Cube001.renderOrder = 2 // 減少個透明物件中渲染衝突造成的閃爍
      nodes.Cube001.material = material
    }

    const onPointerMove = (event) => {
      if (!isLoaded) return

      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1

      raycaster.current.setFromCamera(mouse.current, camera)
      const intersects = raycaster.current.intersectObjects(
        scene.children,
        true
      )

      if (intersects.length > 0) {
        const intersected = intersects[0].object
        if (intersected.userData && intersected.userData.onClick) {
          document.body.style.cursor = 'pointer'
        } else {
          document.body.style.cursor = 'default'
        }
      } else {
        document.body.style.cursor = 'default'
      }
    }

    const handlePointerDown = (event) => {
      initialClickPosition.current = { x: event.clientX, y: event.clientY }
    }

    const handlePointerUp = (event) => {
      if (!isLoaded) return

      const deltaX = Math.abs(event.clientX - initialClickPosition.current.x)
      const deltaY = Math.abs(event.clientY - initialClickPosition.current.y)
      if (deltaX <= 5 && deltaY <= 5) {
        mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1

        raycaster.current.setFromCamera(mouse.current, camera)
        const intersects = raycaster.current.intersectObjects(
          scene.children,
          true
        )

        if (intersects.length > 0) {
          const intersected = intersects[0].object
          if (intersected.userData && intersected.userData.onClick) {
            intersected.userData.onClick()
          }
        }
      }
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      document.body.style.cursor = 'default'
    }
  }, [gltf, scene, camera, router, isLoaded])

  return (
    <>
      <mesh ref={ref} scale={1.6} rotation={[0, Math.PI / 4, 0]}>
        <primitive object={gltf.scene} />
      </mesh>
    </>
  )
})

MeshComponent.displayName = 'MeshComponent'

export default function CubeModel() {
  return (
    <div className='w-full h-full overscroll-none relative'>
      <Canvas linear={false}>
        <ambientLight intensity={2.4} />
        <OrbitControls enableZoom={false} enablePan={false} />
        <MeshComponent />
      </Canvas>
      <ProjectInfo />
    </div>
  )
}
