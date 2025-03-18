<template>
  <div>
    <h1>Рисование</h1>
    <div>
      <label for="color">Выберите цвет:</label>
      <input type="color" id="color" v-model="lineColor" />
      <label for="lineWidth">Выберите толщину линии:</label>
      <input type="range" id="lineWidth" v-model="lineWidth" min="1" max="10" />
      <br />
      <button @click="undoFigure">Отменить</button>
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
      figures: [],
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
        this.lines.push({
          x1: this.lastX,
          y1: this.lastY,
          x2: currentX,
          y2: currentY,
          color: this.lineColor,
          lineWidth: this.lineWidth,
        });
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
        this.figures.push(this.lines);
        this.lines = [];
      }
      this.isDrawing = false;
    },
    redraw() {
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.clearRect(0, 0, 700, 500);
      ctx.fillStyle = "#FFFFFF"; // Задаем белый цвет
      ctx.fillRect(0, 0, 700, 500); // Заполняем весь холст белым цветом
      this.figures.forEach((lines) => {
        lines.forEach((line) => {
          ctx.strokeStyle = line.color;
          ctx.lineWidth = line.lineWidth;
          ctx.beginPath();
          ctx.moveTo(line.x1, line.y1);
          ctx.lineTo(line.x2, line.y2);
          ctx.stroke();
        });
      });
    },
    undoFigure() {
      if (this.figures.length > 0) {
        const lastFig = this.figures.pop();
        console.log(lastFig);
        this.redraw();
      }
    },
    clearCanvas() {
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.clearRect(0, 0, 700, 500);
      ctx.fillStyle = "#FFFFFF"; // Задаем белый цвет
      ctx.fillRect(0, 0, 700, 500); // Заполняем весь холст белым цветом
      this.figures = [];
    },
    getMinMaxCoordinates(doubleArray) {
      const xValues = doubleArray.flatMap((subArray) =>
        subArray.flatMap((obj) => [obj.x1, obj.x2])
      );
      const yValues = doubleArray.flatMap((subArray) =>
        subArray.flatMap((obj) => [obj.y1, obj.y2])
      );

      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);

      return { minX, maxX, minY, maxY };
    },
    drawCroppedCanvas(doubleArray) {
      const { minX, maxX, minY, maxY } = this.getMinMaxCoordinates(doubleArray);
      const width = maxX - minX + 10;
      const height = maxY - minY + 10;

      // Создание нового канваса
      const croppedCanvas = document.createElement("canvas");
      const croppedContext = croppedCanvas.getContext("2d");
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      croppedContext.fillStyle = "#FFFFFF";
      croppedContext.fillRect(0, 0, width, height);

      doubleArray.forEach((lines) => {
        lines.forEach((line) => {
          croppedContext.strokeStyle = line.color;
          croppedContext.lineWidth = line.lineWidth;
          croppedContext.beginPath();
          croppedContext.moveTo(line.x1 - minX + 5, line.y1 - minY + 5);
          croppedContext.lineTo(line.x2 - minX + 5, line.y2 - minY + 5);
          croppedContext.stroke();
        });
      });

      return croppedCanvas;
    },
    addImage() {
      const newCanvas = this.drawCroppedCanvas(this.figures);
      this.dataURL = newCanvas.toDataURL("image/jpeg", 1.0);
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