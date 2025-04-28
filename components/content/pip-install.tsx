"use client"

import { useState, useEffect, useRef } from "react"
import * as THREE from "three"

interface PackageItem {
  name: string
  version: string
  status: string
}

interface GameState {
  score: number
  lives: number
  level: number
  scrollSpeed: number
}

export function PipInstall() {
  const [packages, setPackages] = useState<PackageItem[]>([
    { name: "numpy", version: "1.24.3", status: "Installing..." },
    { name: "pandas", version: "2.0.1", status: "Waiting..." },
    { name: "matplotlib", version: "3.7.1", status: "Waiting..." },
    { name: "scikit-learn", version: "1.2.2", status: "Waiting..." },
    { name: "tensorflow", version: "2.12.0", status: "Waiting..." },
  ])
  
  const [currentPackage, setCurrentPackage] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showGame, setShowGame] = useState(false)
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    level: 1,
    scrollSpeed: 0.05
  })
  
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const playerRef = useRef<THREE.Mesh | null>(null)
  const enemiesRef = useRef<THREE.Mesh[]>([])
  const bulletsRef = useRef<THREE.Mesh[]>([])
  const obstaclesRef = useRef<THREE.Mesh[]>([])
  const backgroundObjectsRef = useRef<THREE.Mesh[]>([])
  const lastFrameTimeRef = useRef<number>(0)
  const keysRef = useRef<{[key: string]: boolean}>({})
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (currentPackage >= packages.length) {
      setIsComplete(true)
      return
    }

    const timer = setTimeout(() => {
      // Update current package to installed
      setPackages(prev => {
        const updated = [...prev]
        updated[currentPackage] = {
          ...updated[currentPackage],
          status: "Installed"
        }
        
        // Set next package to installing if available
        if (currentPackage + 1 < packages.length) {
          updated[currentPackage + 1] = {
            ...updated[currentPackage + 1],
            status: "Installing..."
          }
        }
        
        return updated
      })
      
      // Move to next package
      setCurrentPackage(prev => prev + 1)
    }, 1500) // 1.5 seconds per package
    
    return () => clearTimeout(timer)
  }, [currentPackage, packages.length])
  
  // Initialize game when installation is complete
  useEffect(() => {
    if (isComplete) {
      // Show game after a short delay
      const timer = setTimeout(() => {
        setShowGame(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [isComplete])
  
  // Initialize Three.js scene when game should be shown
  useEffect(() => {
    if (!showGame || !gameContainerRef.current) return
    
    // Initialize Three.js
    const initGame = () => {
      // Get container dimensions
      const container = gameContainerRef.current
      if (!container) return
      
      const width = container.clientWidth
      const height = container.clientHeight
      
      // Create scene
      const scene = new THREE.Scene()
      scene.background = null // Set to null for transparency
      sceneRef.current = scene
      
      // Create camera
      const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000)
      camera.position.z = 15
      cameraRef.current = camera
      
      // Create renderer with alpha enabled for transparency
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true // Enable transparency
      })
      renderer.setSize(width, height)
      // Lower pixel ratio for better performance
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      // Set clear color with alpha (transparent)
      renderer.setClearColor(0x000000, 0) // Black with 50% opacity
      container.appendChild(renderer.domElement)
      rendererRef.current = renderer
      
      // Create player ship (triangle)
      const playerGeometry = new THREE.BufferGeometry()
      const vertices = new Float32Array([
        0, 1, 0,    // top
        -0.8, -1, 0, // bottom left
        0.8, -1, 0   // bottom right
      ])
      playerGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      const playerMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xf6f1da, // Using --main-text color
        wireframe: true 
      })
      const player = new THREE.Mesh(playerGeometry, playerMaterial)
      player.scale.set(0.5, 0.5, 0.5)
      player.position.y = -5
      scene.add(player)
      playerRef.current = player
      
      // Create background stars
      createBackgroundStars()
      
      // Create enemies
      createEnemies()
      
      // Set up keyboard event listeners
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)
      
      // Start animation loop
      lastFrameTimeRef.current = performance.now()
      animate()
    }
    
    // Handle key down events
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true
      
      // Prevent space from scrolling the page
      if (e.key === ' ') {
        e.preventDefault()
      }
    }
    
    // Handle key up events
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false
    }
    
    // Create background stars for parallax effect
    const createBackgroundStars = () => {
      if (!sceneRef.current) return
      
      // Clear existing background objects
      backgroundObjectsRef.current.forEach(obj => {
        sceneRef.current?.remove(obj)
      })
      backgroundObjectsRef.current = []
      
      // Create stars with different sizes and depths
      const starCount = 100
      
      for (let i = 0; i < starCount; i++) {
        const size = Math.random() * 0.05 + 0.02
        const starGeometry = new THREE.SphereGeometry(size, 4, 4)
        const starMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xffffff,
          wireframe: true 
        })
        
        const star = new THREE.Mesh(starGeometry, starMaterial)
        
        // Random position
        star.position.x = (Math.random() - 0.5) * 20
        star.position.y = (Math.random() - 0.5) * 30
        star.position.z = (Math.random() - 0.5) * 10 - 5 // Different depths for parallax
        
        // Store speed in userData for parallax effect
        star.userData = { speed: 0.01 + Math.random() * 0.05 }
        
        sceneRef.current.add(star)
        backgroundObjectsRef.current.push(star)
      }
    }
    
    // Create enemy ships
    const createEnemies = () => {
      if (!sceneRef.current) return
      
      // Clear existing enemies
      enemiesRef.current.forEach(enemy => {
        sceneRef.current?.remove(enemy)
      })
      enemiesRef.current = []
      
      // Create new enemies based on level - more spread out for shoot'em up style
      const enemyCount = 5 + (gameState.level - 1) * 3
      
      for (let i = 0; i < enemyCount; i++) {
        // Create enemy (simple box)
        const enemyGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8)
        const enemyMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xfe1d1d, // Using --main-accent color
          wireframe: true 
        })
        const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial)
        
        // Random position above the visible area for scrolling in
        const spacing = 2
        enemy.position.x = (Math.random() - 0.5) * 14
        enemy.position.y = 10 + Math.random() * 20 // Above the screen, will scroll down
        enemy.position.z = 0
        
        // Add random movement pattern
        enemy.userData = { 
          movePattern: Math.floor(Math.random() * 3), // 0: straight, 1: sine wave, 2: zigzag
          moveSpeed: 0.02 + Math.random() * 0.03,
          amplitude: 1 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
          shootCooldown: 0,
          originalX: enemy.position.x
        }
        
        sceneRef.current.add(enemy)
        enemiesRef.current.push(enemy)
      }
      
      // Create obstacles
      createObstacles()
    }
    
    // Create obstacles
    const createObstacles = () => {
      if (!sceneRef.current) return
      
      // Clear existing obstacles
      obstaclesRef.current.forEach(obstacle => {
        sceneRef.current?.remove(obstacle)
      })
      obstaclesRef.current = []
      
      // Create new obstacles
      const obstacleCount = Math.min(3, Math.floor(gameState.level / 2))
      
      for (let i = 0; i < obstacleCount; i++) {
        // Create asteroid-like obstacle
        const obstacleGeometry = new THREE.IcosahedronGeometry(1, 0) // Low poly for wireframe look
        const obstacleMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x888888,
          wireframe: true 
        })
        const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial)
        
        // Random position above the visible area
        obstacle.position.x = (Math.random() - 0.5) * 14
        obstacle.position.y = 15 + Math.random() * 20 // Above the screen, will scroll down
        obstacle.position.z = 0
        
        // Random rotation
        obstacle.rotation.x = Math.random() * Math.PI
        obstacle.rotation.y = Math.random() * Math.PI
        obstacle.rotation.z = Math.random() * Math.PI
        
        // Add movement data
        obstacle.userData = { 
          rotSpeed: (Math.random() - 0.5) * 0.02,
          moveSpeed: 0.03 + Math.random() * 0.02
        }
        
        sceneRef.current.add(obstacle)
        obstaclesRef.current.push(obstacle)
      }
    }
    
    // Create a bullet
    const createBullet = (x: number, y: number, isPlayerBullet: boolean) => {
      if (!sceneRef.current) return
      
      const bulletGeometry = new THREE.SphereGeometry(0.1, 6, 6) // Reduced segments for performance
      const bulletMaterial = new THREE.MeshBasicMaterial({ 
        color: isPlayerBullet ? 0xd3c871 : 0xfe1d1d, // Yellow for player, red for enemies
        wireframe: true 
      })
      const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial)
      bullet.position.x = x
      bullet.position.y = y
      bullet.userData = { 
        isPlayerBullet, 
        speed: isPlayerBullet ? 0.4 : -0.2 // Faster bullets for better gameplay
      }
      
      sceneRef.current.add(bullet)
      bulletsRef.current.push(bullet)
    }
    
    // Animation loop
    const animate = (currentTime?: number) => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !playerRef.current) return
      
      // Calculate delta time for frame-rate independent movement
      const deltaTime = currentTime ? (currentTime - lastFrameTimeRef.current) / 16.67 : 1
      lastFrameTimeRef.current = currentTime || performance.now()
      
      // Smooth player movement based on key state
      const moveSpeed = 0.12 * deltaTime
      
      if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
        playerRef.current.position.x -= moveSpeed
      }
      if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
        playerRef.current.position.x += moveSpeed
      }
      if (keysRef.current['ArrowUp'] || keysRef.current['w']) {
        playerRef.current.position.y += moveSpeed * 0.5
      }
      if (keysRef.current['ArrowDown'] || keysRef.current['s']) {
        playerRef.current.position.y -= moveSpeed * 0.5
      }
      
      // Auto-fire when space is held down
      if (keysRef.current[' ']) {
        // Limit fire rate
        if (Math.random() < 0.2) { // Approximately every 5 frames
          createBullet(playerRef.current.position.x, playerRef.current.position.y + 1, true)
        }
      }
      
      // Keep player within bounds
      if (playerRef.current.position.x < -8) playerRef.current.position.x = -8
      if (playerRef.current.position.x > 8) playerRef.current.position.x = 8
      if (playerRef.current.position.y < -6) playerRef.current.position.y = -6
      if (playerRef.current.position.y > 6) playerRef.current.position.y = 6
      
      // Move background stars for parallax scrolling effect
      backgroundObjectsRef.current.forEach((star, index) => {
        // Move stars down for scrolling effect
        star.position.y -= star.userData.speed * deltaTime
        
        // Reset stars that go off screen
        if (star.position.y < -15) {
          star.position.y = 15
          star.position.x = (Math.random() - 0.5) * 20
        }
      })
      
      // Move and update enemies
      enemiesRef.current.forEach((enemy, enemyIndex) => {
        // Move enemies down (vertical scrolling)
        enemy.position.y -= gameState.scrollSpeed * deltaTime
        
        // Apply movement patterns
        const userData = enemy.userData
        
        if (userData.movePattern === 1) { // Sine wave
          userData.phase += 0.02 * deltaTime
          enemy.position.x = userData.originalX + Math.sin(userData.phase) * userData.amplitude
        } else if (userData.movePattern === 2) { // Zigzag
          userData.phase += 0.02 * deltaTime
          enemy.position.x = userData.originalX + (Math.abs((userData.phase % 2) - 1) * 2 - 1) * userData.amplitude
        }
        
        // Random enemy shooting with cooldown
        userData.shootCooldown -= deltaTime
        if (userData.shootCooldown <= 0 && Math.random() < 0.005 * gameState.level * deltaTime) {
          createBullet(enemy.position.x, enemy.position.y - 0.5, false)
          userData.shootCooldown = 60 // Frames until next possible shot
        }
        
        // Remove enemies that go off screen
        if (enemy.position.y < -10) {
          sceneRef.current?.remove(enemy)
          enemiesRef.current.splice(enemyIndex, 1)
        }
      })
      
      // Move and update obstacles
      obstaclesRef.current.forEach((obstacle, obstacleIndex) => {
        // Move obstacles down
        obstacle.position.y -= obstacle.userData.moveSpeed * deltaTime
        
        // Rotate obstacles
        obstacle.rotation.x += obstacle.userData.rotSpeed * deltaTime
        obstacle.rotation.z += obstacle.userData.rotSpeed * deltaTime
        
        // Remove obstacles that go off screen
        if (obstacle.position.y < -10) {
          sceneRef.current?.remove(obstacle)
          obstaclesRef.current.splice(obstacleIndex, 1)
        }
        
        // Check for collisions with player
        if (playerRef.current && obstacle.position.distanceTo(playerRef.current.position) < 1.2) {
          // Hit player
          setGameState(prev => ({
            ...prev,
            lives: prev.lives - 1
          }))
          
          // Remove obstacle
          sceneRef.current?.remove(obstacle)
          obstaclesRef.current.splice(obstacleIndex, 1)
        }
      })
      
      // Move bullets
      bulletsRef.current.forEach((bullet, index) => {
        bullet.position.y += bullet.userData.speed * deltaTime
        
        // Remove bullets that go off screen
        if (bullet.position.y > 10 || bullet.position.y < -10) {
          sceneRef.current?.remove(bullet)
          bulletsRef.current.splice(index, 1)
          return
        }
        
        // Check for collisions
        if (bullet.userData.isPlayerBullet) {
          // Player bullets hit enemies
          enemiesRef.current.forEach((enemy, enemyIndex) => {
            if (bullet.position.distanceTo(enemy.position) < 0.8) {
              // Hit enemy
              sceneRef.current?.remove(enemy)
              enemiesRef.current.splice(enemyIndex, 1)
              
              sceneRef.current?.remove(bullet)
              bulletsRef.current.splice(index, 1)
              
              // Update score
              setGameState(prev => ({
                ...prev,
                score: prev.score + 10 * prev.level
              }))
            }
          })
          
          // Player bullets hit obstacles
          obstaclesRef.current.forEach((obstacle, obstacleIndex) => {
            if (bullet.position.distanceTo(obstacle.position) < 1.0) {
              // Hit obstacle
              sceneRef.current?.remove(bullet)
              bulletsRef.current.splice(index, 1)
            }
          })
        } else {
          // Enemy bullets hit player
          if (playerRef.current && bullet.position.distanceTo(playerRef.current.position) < 0.5) {
            // Hit player
            sceneRef.current?.remove(bullet)
            bulletsRef.current.splice(index, 1)
            
            // Lose a life
            setGameState(prev => ({
              ...prev,
              lives: prev.lives - 1
            }))
          }
        }
      })
      
      // Spawn new enemies if needed
      if (enemiesRef.current.length < 3 + gameState.level) {
        // Add a new enemy above the screen
        const enemyGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8)
        const enemyMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xfe1d1d,
          wireframe: true 
        })
        const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial)
        
        enemy.position.x = (Math.random() - 0.5) * 14
        enemy.position.y = 15 // Above the screen
        
        enemy.userData = { 
          movePattern: Math.floor(Math.random() * 3),
          moveSpeed: 0.02 + Math.random() * 0.03,
          amplitude: 1 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
          shootCooldown: 0,
          originalX: enemy.position.x
        }
        
        sceneRef.current.add(enemy)
        enemiesRef.current.push(enemy)
      }
      
      // Spawn new obstacles occasionally
      if (obstaclesRef.current.length < Math.min(3, Math.floor(gameState.level / 2)) && Math.random() < 0.005) {
        const obstacleGeometry = new THREE.IcosahedronGeometry(1, 0)
        const obstacleMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x888888,
          wireframe: true 
        })
        const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial)
        
        obstacle.position.x = (Math.random() - 0.5) * 14
        obstacle.position.y = 15
        
        obstacle.rotation.x = Math.random() * Math.PI
        obstacle.rotation.y = Math.random() * Math.PI
        
        obstacle.userData = { 
          rotSpeed: (Math.random() - 0.5) * 0.02,
          moveSpeed: 0.03 + Math.random() * 0.02
        }
        
        sceneRef.current.add(obstacle)
        obstaclesRef.current.push(obstacle)
      }
      
      // Level progression
      if (gameState.score >= gameState.level * 200 && enemiesRef.current.length < 5) {
        // Level up
        setGameState(prev => ({
          ...prev,
          level: prev.level + 1,
          scrollSpeed: Math.min(0.15, prev.scrollSpeed + 0.01) // Increase scroll speed with level
        }))
      }
      
      // Check for game over
      if (gameState.lives <= 0) {
        // Game over
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp)
        cancelAnimationFrame(animationFrameRef.current!)
        return
      }
      
      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current)
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    // Initialize game
    initGame()
    
    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      // Remove event listeners
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      
      if (rendererRef.current && gameContainerRef.current) {
        gameContainerRef.current.removeChild(rendererRef.current.domElement)
      }
    }
  }, [showGame, gameState.level, gameState.lives])

  return (
    <div className="text-[var(--main-text)] font-mono p-4">
      {!showGame ? (
        // Package installation UI
        <>
          <div className="mb-6">
            <h2 className="text-xl mb-2">Python Package Installer</h2>
            <div className="text-sm mb-4">Installing packages from PyPI...</div>
          </div>
          
          <div className="space-y-2">
            {packages.map((pkg, index) => (
              <div 
                key={pkg.name}
                className={`flex justify-between p-2 border-l-4 ${getStatusColor(pkg.status, index === currentPackage)}`}
              >
                <div className="flex-1">
                  <span className="font-bold">{pkg.name}</span>
                  <span className="text-sm ml-2">v{pkg.version}</span>
                </div>
                <div className={`${pkg.status === "Installing..." ? "animate-pulse" : ""}`}>
                  {pkg.status}
                </div>
              </div>
            ))}
          </div>
          
          {isComplete && (
            <div className="mt-6 p-3 border border-[var(--main-text)] rounded">
              <div className="text-lg mb-2">✓ Installation Complete</div>
              <div className="text-sm mb-2">
                Successfully installed {packages.length} packages
              </div>
              <div className="text-sm animate-pulse">
                Loading Cosmic Shoot'em Up Game...
              </div>
            </div>
          )}
        </>
      ) : (
        // Game UI
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl">Cosmic Shoot'em Up</h2>
            <div className="flex space-x-4">
              <div className="text-[var(--yellow-accent)]">
                Score: {gameState.score}
              </div>
              <div className="text-[var(--main-accent)]">
                Lives: {gameState.lives}
              </div>
              <div className="text-[var(--main-text)]">
                Level: {gameState.level}
              </div>
            </div>
          </div>
          
          <div className="text-xs mb-2">
            Controls: Arrow Keys or WASD to move, Space to shoot
          </div>
          
          {/* Game container */}
          <div 
            ref={gameContainerRef} 
            className="w-full h-[400px] border border-[var(--main-text)] rounded bg-transparent relative"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Semi-transparent background
          ></div>
          
          {gameState.lives <= 0 && (
            <div className="mt-4 p-3 border border-[var(--main-accent)] rounded text-center">
              <div className="text-lg mb-2 text-[var(--main-accent)]">Game Over</div>
              <div className="text-[var(--main-text)]">
                Final Score: {gameState.score} | Level Reached: {gameState.level}
              </div>
              <button 
                className="mt-2 px-4 py-2 bg-[var(--main-accent-50)] text-white rounded hover:bg-[var(--main-accent)]" 
                onClick={() => {
                  setGameState({ score: 0, lives: 3, level: 1 })
                  // Force re-initialization of the game
                  setShowGame(false)
                  setTimeout(() => setShowGame(true), 100)
                }}
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function getStatusColor(status: string, isActive: boolean): string {
  if (status === "Installed") {
    return "border-green-500"
  } else if (status === "Installing...") {
    return "border-[var(--neon-red)] animate-pulse"
  } else if (isActive) {
    return "border-yellow-500"
  } else {
    return "border-gray-500"
  }
}