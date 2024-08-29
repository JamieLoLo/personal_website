import { useEffect, useRef, forwardRef, useState } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { uiState } from '@/lib/valtioState'
import ProjectInfo from './ProjectInfo'
import { modelData } from '@/database/projectInfoData'
import { useSnapshot } from 'valtio'
import { windowSizeState } from '@/lib/windowSize'

const fileUrl = '/model/Cube.glb'

const MeshComponent = forwardRef((props, forwardedRef) => {
  const { introVisible } = useSnapshot(uiState.introPage)
  const { infoVisible } = useSnapshot(uiState.projectInfo)
  const { isLoaded } = useSnapshot(uiState.model)

  const gltf = useLoader(GLTFLoader, fileUrl)
  const { scene, camera } = useThree()
  const initialClickPosition = useRef({ x: 0, y: 0 })
  const router = useRouter()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const { mobileMode } = useSnapshot(windowSizeState)

  const internalRef = useRef() // 創建本地 ref
  const rotationRef = useRef(0) // 記錄旋轉角度

  // 合併 internalRef 與 forwardedRef
  const combinedRef = useRef()

  useEffect(() => {
    combinedRef.current = internalRef.current
    if (typeof forwardedRef === 'function') {
      forwardedRef(combinedRef.current)
    } else if (forwardedRef) {
      forwardedRef.current = combinedRef.current
    }
  }, [forwardedRef])

  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        uiState.loading.loadingVisible = false
      }, 1000)
    } else {
      uiState.loading.colorMode = 'dark'
      uiState.loading.loadingVisible = true
    }
  }, [isLoaded])

  // 加载模型和材质
  useEffect(() => {
    if (!camera || !camera.isPerspectiveCamera) {
      console.error('Camera is not a valid PerspectiveCamera')
      return
    }

    const nodes = gltf.nodes

    modelData.forEach((item) => {
      if (nodes && nodes[item.name]) {
        const textureLoader = new THREE.TextureLoader()
        const newTexture = textureLoader.load(item.texture, () => {
          uiState.model.isLoaded = true
        })

        newTexture.repeat.set(1, -1)
        newTexture.offset.set(0, 1)

        const material = nodes[item.name].material
        material.map = newTexture

        material.emissive = new THREE.Color('#E9E9E9')
        material.emissiveIntensity = 1.25
        material.emissiveMap = newTexture

        if (item.name === 'Cube001_6') {
          material.opacity = 0.9
          material.transparent = true
          nodes[item.name].userData = { onClick: () => router.push('/blog') }
        } else {
          material.opacity = 0.9
          material.transparent = true
          nodes[item.name].userData = {
            onClick: () => {
              uiState.projectInfo.activeProject = item.id
              setTimeout(() => {
                uiState.projectInfo.infoVisible = true
              }, 200)
            },
          }
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
          uiState.model.isLoaded = true
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
      nodes.Cube001.renderOrder = 2
      nodes.Cube001.material = material
    }
  }, [gltf, scene, camera, router])

  // 事件監聽
  useEffect(() => {
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
        if (
          intersected.userData &&
          intersected.userData.onClick &&
          !introVisible &&
          !infoVisible
        ) {
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
          if (
            intersected.userData &&
            intersected.userData.onClick &&
            !introVisible &&
            !infoVisible
          ) {
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
  }, [isLoaded, camera, scene, introVisible, infoVisible])

  // 模型旋轉
  useEffect(() => {
    if (isLoaded) {
      const rotateModel = () => {
        if (combinedRef.current) {
          rotationRef.current += 0.003 // 控制旋轉速度
          combinedRef.current.rotation.y = rotationRef.current
        }

        requestAnimationFrame(rotateModel)
      }
      rotateModel()
    }
  }, [isLoaded])

  useEffect(() => {
    if (isLoaded) {
      const rotateModel = () => {
        if (combinedRef.current) {
          // 使用 combinedRef
          rotationRef.current += 0.003 // 控制旋轉速度
          combinedRef.current.rotation.y = rotationRef.current
        }

        requestAnimationFrame(rotateModel)
      }
      rotateModel()
    }
  }, [isLoaded])

  return (
    <>
      <mesh
        ref={internalRef} // 绑定内部ref
        scale={mobileMode ? 1.2 : 1.6}
      >
        <primitive object={gltf.scene} />
      </mesh>
    </>
  )
})

MeshComponent.displayName = 'MeshComponent'

export default function CubeModel() {
  return (
    <div className={`w-full h-full overscroll-none relative  `}>
      <Canvas linear={false} className='pointer-events-none'>
        <OrbitControls enableZoom={false} enablePan={false} />
        <MeshComponent />
      </Canvas>
      <ProjectInfo />
    </div>
  )
}
