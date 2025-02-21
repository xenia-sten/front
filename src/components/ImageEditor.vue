<template>
  <div>
    <h1>Рисование</h1>
    <div>
      <label for="color">Выберите цвет:</label>
      <input type="color" id="color" v-model="lineColor" />
      <label for="lineWidth">Выберите толщину линии:</label>
      <input type="range" id="lineWidth" v-model="lineWidth" min="1" max="10" />
      <br />
      <button @click="clearCanvas">Очистить поле</button>
      <button @click="addImage">Сохранить</button>
    </div>
    <canvas
      ref="canvas"
      id="myCanvas"
      width="700"
      height="500"
      @mousedown="beginDrawing"
      @mousemove="keepDrawing"
      @mouseup="stopDrawing"
    />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isDrawing: false,
      lineColor: "#000000",
      lineWidth: 2,
      lastX: 0,
      lastY: 0,
      lines: [],
      dataURL: "",
      canvasHeight: 600,
      canvasWidth: 600,
    };
  },
  methods: {
    drawLine(x1, y1, x2, y2, color, lineWidth) {
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
    },
    beginDrawing(e) {
      this.isDrawing = true;
      this.lastX = e.offsetX;
      this.lastY = e.offsetY;
    },
    keepDrawing(e) {
      if (this.isDrawing) {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        this.drawLine(
          this.lastX,
          this.lastY,
          currentX,
          currentY,
          this.lineColor,
          this.lineWidth
        );
        this.lastX = currentX;
        this.lastY = currentY;
      }
    },
    stopDrawing(e) {
      if (this.isDrawing) {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        this.drawLine(
          this.lastX,
          this.lastY,
          currentX,
          currentY,
          this.lineColor,
          this.lineWidth
        );

        this.lines.push({
          x1: this.lastX,
          y1: this.lastY,
          x2: currentX,
          y2: currentY,
          color: this.lineColor,
          lineWidth: this.lineWidth,
        });
      }
      this.isDrawing = false;
    },
    clearCanvas() {
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.clearRect(0, 0, 700, 500);
      ctx.fillStyle = "#FFFFFF"; // Задаем белый цвет
      ctx.fillRect(0, 0, 700, 500); // Заполняем весь холст белым цветом
      this.lines = [];
    },
    addImage() {
      this.dataURL = this.$refs.canvas.toDataURL("image/jpeg", 1.0);
      this.$emit("create", this.dataURL);
    },
  },
  mounted() {
    this.clearCanvas();
  },
};
</script>

<style scoped>
#myCanvas {
  border: 1px solid #0000008a;
  overflow: auto;
}
</style>