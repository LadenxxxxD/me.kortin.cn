import { TweenMax, Power1 } from "gsap";
import { createSignal, onMount } from "solid-js";

export default function Cursor() {
  let width = window.innerWidth;
  let height = window.innerHeight;

  let mouseX = width / 2;
  let mouseY = height / 2;

  let circle = {
    radius: 14,
    lastX: mouseX,
    lastY: mouseY,
  };

  function getCanvas() {
    return document.querySelector<HTMLCanvasElement>(".cursor-canvas");
  }

  function onResize() {
    const canvas = getCanvas();
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // 定义嘴巴的最大张合角度
  const maxMouthAngle = Math.PI / 6; // 可以根据需要调整这个值，例如 Math.PI / 6 为30度

  function render() {
    const canvas = getCanvas();
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
  
    // 更新吃豆人位置
    circle.lastX = lerp(circle.lastX, mouseX, 0.1);
    circle.lastY = lerp(circle.lastY, mouseY, 0.1);
  
    // 计算吃豆人朝向鼠标的角度
    const angleToCursor = Math.atan2(mouseY - circle.lastY, mouseX - circle.lastX);
  
    // 使用正弦波生成一个周期性变化的数值来模拟嘴巴的开合
    const mouthOpen = Math.abs(Math.sin(Date.now() * 0.01)) * maxMouthAngle;
  
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // 绘制吃豆人身体的完整圆
    ctx.beginPath();
    ctx.arc(circle.lastX, circle.lastY, circle.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "#f7d46c";
    ctx.fill();
  
    // 绘制吃豆人嘴巴的扇形
    ctx.beginPath();
    ctx.moveTo(circle.lastX, circle.lastY);
    ctx.arc(circle.lastX, circle.lastY, circle.radius, angleToCursor - mouthOpen, angleToCursor + mouthOpen, false);
    ctx.closePath();
    ctx.fillStyle = "black"; // 选择黑色以便在黄色背景上形成对比
    ctx.fill();
  
    // 循环调用render函数以持续更新画布
    requestAnimationFrame(render);
  }
  

  function init() {
    const canvas = getCanvas();
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    mouseX = width / 2;
    mouseY = height / 2;

    circle = {
      radius: 14,
      lastX: mouseX,
      lastY: mouseY,
    };

    requestAnimationFrame(render);

    window.addEventListener("mousemove", function (e) {
      mouseX = e.pageX;
      mouseY = e.pageY;
    });

    window.addEventListener("resize", onResize, false);

    let tween = TweenMax.to(circle, 0.25, {
      radius: circle.radius * 2,
      ease: Power1.easeInOut,
      paused: true,
    });

    const elems = [...document.querySelectorAll("[data-hover]")];

    elems.forEach(el => {
      el.addEventListener(
        "mouseenter",
        () => {
          tween.play();
        },
        false
      );
      el.addEventListener(
        "mouseleave",
        () => {
          tween.reverse();
        },
        false
      );
    });
  }

  function lerp(a: number, b: number, n: number) {
    return (1 - n) * a + n * b;
  }

  onMount(() => {
    init();
  });

  return (
    <canvas class="cursor-canvas absolute top-0 left-0 p-0 m-0 z-3 pointer-events-none mix-blend-difference"></canvas>
  );
}
