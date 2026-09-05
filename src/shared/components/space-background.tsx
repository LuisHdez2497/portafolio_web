import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number
  pz: number
  warm: boolean
}

const MAX_STARS = 520
const STAR_DENSITY = 0.0004
const SPEED = 0.0022

function resetStar(star: Star): Star {
  star.x = Math.random() * 2 - 1
  star.y = Math.random() * 2 - 1
  star.z = Math.random() * 0.8 + 0.2
  star.pz = star.z
  star.warm = Math.random() > 0.55
  return star
}

function createStars(width: number, height: number): Star[] {
  const count = Math.min(MAX_STARS, Math.floor(width * height * STAR_DENSITY))
  return Array.from({ length: count }, () => resetStar({ x: 0, y: 0, z: 0, pz: 0, warm: false }))
}

function drawStar(ctx: CanvasRenderingContext2D, star: Star, cx: number, cy: number): void {
  const sx = cx + (star.x / star.z) * cx
  const sy = cy + (star.y / star.z) * cy
  const px = cx + (star.x / star.pz) * cx
  const py = cy + (star.y / star.pz) * cy
  const depth = 1 - star.z
  const radius = depth * 2.1 + 0.25
  const alpha = Math.min(1, depth * 1.5)
  const head = star.warm ? '253, 230, 138' : '236, 240, 255'
  ctx.strokeStyle = `rgba(${head}, ${alpha * 0.45})`
  ctx.lineWidth = radius
  ctx.beginPath()
  ctx.moveTo(px, py)
  ctx.lineTo(sx, sy)
  ctx.stroke()
  ctx.fillStyle = `rgba(${head}, ${alpha})`
  ctx.beginPath()
  ctx.arc(sx, sy, radius, 0, Math.PI * 2)
  ctx.fill()
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const staticField = reduced || coarse
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const state = { stars: [] as Star[], raf: 0 }

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      state.stars = createStars(window.innerWidth, window.innerHeight)
    }

    const render = () => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.lineCap = 'round'
      for (const star of state.stars) {
        star.pz = star.z
        star.z -= SPEED
        if (star.z <= 0.02) resetStar(star)
        drawStar(ctx, star, cx, cy)
      }
      state.raf = requestAnimationFrame(render)
    }

    const renderStatic = () => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (const star of state.stars) drawStar(ctx, star, cx, cy)
    }

    const onResize = () => {
      resize()
      if (staticField) renderStatic()
    }
    resize()
    window.addEventListener('resize', onResize)
    if (staticField) renderStatic()
    else state.raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(state.raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-space">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_28%,rgba(5,6,12,0.62)_100%)]" />
    </div>
  )
}
