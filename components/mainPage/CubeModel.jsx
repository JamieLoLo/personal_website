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

// glb 是 gltf 的一種，只是 glb 是打包好的檔案 (像是材質紋理等)，因為打包過的關係，更適合用在網頁上。
const fileUrl = '/model/Cube.glb'

const MeshComponent = () => {
  const { introVisible } = useSnapshot(uiState.introPage)
  const { infoVisible } = useSnapshot(uiState.projectInfo)
  const { isLoaded } = useSnapshot(uiState.model)
  const { scene, camera } = useThree()
  // 加載後返回一個物件，裡面會包含可以用的方法和屬性，例如 scene/node。
  const gltf = useLoader(GLTFLoader, fileUrl)
  const initialClickPosition = useRef({ x: 0, y: 0 })
  const router = useRouter()
  const raycaster = useRef(new THREE.Raycaster()) // 檢測滑鼠點擊或懸停是否在3D物件上
  const mouse = useRef(new THREE.Vector2()) // 滑鼠二維坐標
  const { mobileMode } = useSnapshot(windowSizeState)
  const internalRef = useRef() // 創建本地 ref
  const rotationRef = useRef(0) // 記錄旋轉角度

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

  // 加載模型和材質，並確認材質全部加載完成。
  useEffect(() => {
    const nodes = gltf.nodes
    const textureLoader = new THREE.TextureLoader()
    let totalTextures = 0 // 總共需要加載的貼圖數量
    let loadedTextures = 0 // 已經加載完成的貼圖數量

    // 計算需要加載的貼圖數量
    const countTextures = () => {
      modelData.forEach((item) => {
        if (nodes?.[item.name]) {
          totalTextures += 1
        }
      })

      // Cube001 是整個立方體的透明層，需要單獨處理。
      if (nodes?.Cube001) {
        totalTextures += 1
      }
    }

    console.log(totalTextures)
    // 處理材質
    const setMaterialProperties = (material, texture) => {
      material.map = texture // 指定基礎材質 (圖片)
      material.emissive = new THREE.Color('#E9E9E9')
      material.emissiveIntensity = 1.25
      material.emissiveMap = texture // 指定自發光材質
      material.opacity = 0.9
      material.transparent = true
      material.side = THREE.DoubleSide
      material.needsUpdate = true
    }

    const checkIfAllLoaded = () => {
      loadedTextures += 1
      if (loadedTextures === totalTextures) {
        uiState.model.isLoaded = true
      }
    }

    const applyTextures = () => {
      modelData.forEach((item) => {
        if (nodes?.[item.name]) {
          const texture = textureLoader.load(item.texture, checkIfAllLoaded)

          // 調整貼圖的角度和偏移
          texture.repeat.set(1, -1)
          texture.offset.set(0, 1)

          setMaterialProperties(nodes[item.name].material, texture)

          // userData 是一個自定義的屬性，可以用來儲存任何數據，或是事件。
          nodes[item.name].userData =
            item.name === 'Cube001_6'
              ? { onClick: () => router.push('/blog') }
              : {
                  onClick: () => {
                    uiState.projectInfo.activeProject = item.id
                    setTimeout(() => {
                      uiState.projectInfo.infoVisible = true
                    }, 250)
                  },
                }
        }
      })

      if (nodes?.Cube001) {
        const texture = textureLoader.load(
          '/model/texture/cubeTexture.jpg',
          checkIfAllLoaded
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
    }

    countTextures()
    applyTextures()
  }, [gltf, scene, camera, router])

  // 事件監聽
  useEffect(() => {
    const onPointerMove = (event) => {
      if (!isLoaded) return

      // 將二維坐標轉換為可在3D空間中使用的坐標
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1

      raycaster.current.setFromCamera(mouse.current, camera)
      const intersects = raycaster.current.intersectObjects(
        scene.children,
        true
      ) // 第二個參數會檢查所有子對象是否有相交的狀況。

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
      // 當滑鼠移動的距離小於 5 像素時，視為點擊事件，避免在滾動時觸發點擊。
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
        if (internalRef.current) {
          rotationRef.current += 0.003 // 控制旋轉速度
          internalRef.current.rotation.y = rotationRef.current
        }
        requestAnimationFrame(rotateModel)
      }
      rotateModel()
    }
  }, [isLoaded])

  return (
    <mesh ref={internalRef} scale={mobileMode ? 1.2 : 1.6}>
      <primitive object={gltf.scene} />
    </mesh>
  )
}

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
