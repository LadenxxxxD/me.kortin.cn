import { TweenMax, Power1 } from 'gsap'
import { createSignal, onMount } from "solid-js";

export default function Cursor() {
let width =  window.innerWidth
let height = window.innerHeight

let mouseX = width / 2;
let mouseY = height / 2;

let circle = {
  radius: 10,
  lastX: mouseX,
  lastY: mouseY
}

function getCanvas () {
  return document.querySelector<HTMLCanvasElement>('.cursor-canvas')
}


function onResize () {
  const canvas = getCanvas()
  if (!canvas) return
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
}

function render () {
  const canvas = getCanvas()
  if (!canvas) return
  const ctx = canvas.getContext('2d')!

  circle.lastX = lerp(circle.lastX, mouseX, 0.25)
  circle.lastY = lerp(circle.lastY, mouseY, 0.25)

  ctx.clearRect(0, 0, width, height)
  ctx.beginPath()
  ctx.arc(circle.lastX, circle.lastY, circle.radius, 0, Math.PI * 3, false)
  ctx.fillStyle = "#ffffff"
  ctx.fill()
  ctx.closePath()

  requestAnimationFrame(render)
}

function init () {
  const canvas = getCanvas()
  if (!canvas) return
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight

  mouseX = width / 2;
  mouseY = height / 2;

  circle = {
    radius: 10,
    lastX: mouseX,
    lastY: mouseY
  }

  requestAnimationFrame(render)
  
  window.addEventListener('mousemove', function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
  })

  window.addEventListener('resize', onResize, false)
  
  let tween = TweenMax.to(circle, 0.25, {
    radius: circle.radius * 3,
    ease: Power1.easeInOut,
    paused: true
  })
  
  const elems = [...document.querySelectorAll('[data-hover]')]

  elems.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      tween.play()
    }, false)
    el.addEventListener('mouseleave', () => {
      tween.reverse()
    }, false)
  })
}

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b
}

  onMount(() => {
    init()
  })
  return <canvas class="cursor-canvas absolute top-0 left-0 p-0 m-0 z-3 pointer-events-none mix-blend-difference"></canvas>
}