'use client'
import * as THREE from 'three'
import { useEffect } from 'react'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
// import heartModel from '../../../public/heat.gltf'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  EffectComposer,
  DragControls,
  RenderPass,
  UnrealBloomPass
} from 'three-stdlib'

import './style.scss'

function Heartbeat() {
  console.log('loading heart')

  useEffect(() => {
    const colorMap = [0xf87cd7, 0xd7d68b]

    let curColorIndex = 0
    const container = document.getElementsByClassName('heartbeat-container')[0]
    // 仅在客户端运行时执行的代码
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      1,
      800
    )
    camera.position.set(6, -3, -13)
    // AxesHelper：辅助观察的坐标系
    const axesHelper = new THREE.AxesHelper(150)
    // scene.add(axesHelper);

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)

    // 添加方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 10, 12)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // 渲染器
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(container.clientWidth, container.clientHeight)
    // Configure the renderer
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap // Soft shadow
    renderer.toneMapping = THREE.ACESFilmicToneMapping // Better tone mapping
    renderer.toneMappingExposure = 1 // Adjust exposure
    container.appendChild(renderer.domElement)
    ;(window as any).camera = camera
    ;(window as any).scene = scene
    ;(window as any).renderer = renderer

    // 设置后期处理效果
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    )
    bloomPass.threshold = 0
    bloomPass.radius = 0.5
    composer.addPass(bloomPass)

    const objects: THREE.Object3D[] = []
    // 随机生成三角锥
    for (let i = 0; i < 50; i++) {
      const geometry = new THREE.ConeGeometry(3, 4, 3, 1)
      const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
      const cone = new THREE.Mesh(geometry, material)
      const rdm = Math.random()
      cone.scale.x = rdm * 0.03
      cone.scale.y = rdm * 0.03
      cone.scale.z = rdm * 0.03
      const width = container.clientWidth
      const height = container.clientHeight
      const position = new THREE.Vector3(
        (Math.random() * 2 - 1) * 10,
        (Math.random() * 2 - 1) * 10,
        (Math.random() * 2 - 1) * 5
      )
      console.log('position: ', position)
      cone.position.set(position.x, position.y, position.z)
      // cone.position.set(0, 0, 0)
      ;(window as any).cone = cone
      objects.push(cone)
      scene.add(cone)
      // 初始化拖动控件
      const dragControls = new DragControls(
        objects,
        camera,
        renderer.domElement
      )
      dragControls.addEventListener('dragstart', function (event) {
        controls.enabled = false
      })
      dragControls.addEventListener('dragend', function (event) {
        controls.enabled = true
      })
    }

    const loader = new GLTFLoader()
    const controls = new OrbitControls(camera, renderer.domElement)

    loader.load(
      '/heart.glb',
      function (gltf) {
        const model = gltf.scene

        console.log('gltf loaded successfully', model)
        model.name = '3dmodel'
        model.rotation.z = THREE.MathUtils.degToRad(15)
        // model.scale.x = -1
        model.translateY(-2)
        model.translateX(-1)
        model.translateZ(2)
        model.traverse(function (child: THREE.Object3D | THREE.Mesh) {
          // console.log('child: ', child)
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            mesh.frustumCulled = false
            mesh.castShadow = true //模型阴影
            mesh.receiveShadow = true

            const material = mesh.material as THREE.MeshStandardMaterial

            material.color.setHex(0xf87cd7)
            material.emissive.setHex(0xb05e5e) // setRGB(206 / 255, 85 / 255, 173 / 255) Set emissive color
            material.emissiveIntensity = 0.3 // Adjust emissive intensity
            material.needsUpdate = true
            material.roughness = 0.4
            material.metalness = 0.3
            material.side = THREE.DoubleSide
            material.transparent = true
            material.opacity = 0.8

            // console.log('material.color', material.color)
            // 将材质转换为 MeshLambertMaterial
            const lambertMaterial = new THREE.MeshLambertMaterial({
              color: material.color,
              emissive: material.emissive,
              emissiveIntensity: material.emissiveIntensity
            })

            // mesh.material = lambertMaterial
          }
        })
        // scene.add(model)

        const group = new THREE.Group()
        group.add(model)
        group.rotation.y = THREE.MathUtils.degToRad(100)
        group.rotation.z = THREE.MathUtils.degToRad(-15)
        group.rotation.x = THREE.MathUtils.degToRad(-5)

        scene.add(group)

        // 设置相机位置并使其朝向模型
        // camera.position.x = 3
        // camera.position.y = 3
        // camera.position.z = 15
        const modelWorldPosition = new THREE.Vector3()
        model.getWorldPosition(modelWorldPosition)
        camera.lookAt(modelWorldPosition) // 使相机看向模型原点

        // 更新控制器目标
        controls.target.copy(modelWorldPosition)
        controls.update()
        renderer.render(scene, camera)

        const clock = new THREE.Clock()
        function animate() {
          requestAnimationFrame(animate)
          // 获取时间
          const elapsedTime = clock.getElapsedTime()
          // 计算缩放因子，使其随时间变化
          const scale = 1 + 0.1 * Math.sin(elapsedTime * 3) // 调整振幅和频率
          // 应用缩放因子
          group.scale.set(scale, scale, scale)
          // group.rotation.y += 0.007
          // renderer.render(scene, camera)
          composer.render()
        }
        animate()

        // 添加鼠标点击事件处理
        console.log('render finished', renderer.domElement)
        renderer.domElement.addEventListener('click', (event) => {
          event.preventDefault()
          const rect = renderer.domElement.getBoundingClientRect()

          // 计算鼠标在画布中的位置
          const mouse = new THREE.Vector2()
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

          // 创建射线
          const raycaster = new THREE.Raycaster()
          raycaster.setFromCamera(mouse, camera)

          // 计算交互对象
          const intersects = raycaster.intersectObjects(scene.children, true)
          if (intersects.length > 0) {
            const intersectedObject = intersects[0].object
            console.log('Object clicked:', intersectedObject)

            // 处理点击事件（例如，改变颜色）
            if (intersectedObject instanceof THREE.Mesh) {
              if (curColorIndex + 1 >= colorMap.length) {
                curColorIndex = 0
              } else {
                curColorIndex += 1
              }
              intersectedObject.material.color.set(colorMap[curColorIndex])
            }
          }
        })
      },
      undefined,
      function (error) {
        console.error(error)
      }
    )

    renderer.render(scene, camera)

    // 调整窗口大小时更新渲染器和相机
    window.addEventListener('resize', () => {
      const width = container.clientWidth
      const height = container.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
      composer.setSize(width, height)
    })
  }, [])

  return <div className='heartbeat-container'></div>
}
export default Heartbeat
