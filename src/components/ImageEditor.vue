<template>
  <div>
    <h1>Рисование</h1>
    <div>
      <label for="color">Выберите цвет:</label>
      <input type="color" id="color" v-model="lineColor" />
      <label for="lineWidth">Выберите толщину линии:</label>
      <v-slider
        id="lineWidth"
        v-model="lineWidth"
        :min="1"
        :max="10"
        :step="1"
      />
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="auto">
            <v-btn density="comfortable" icon="mdi-sine-wave"></v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn density="comfortable" icon="mdi-square-outline"></v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn density="comfortable" icon="mdi-circle-outline"></v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              @click="undoFigure"
              density="comfortable"
              icon="mdi-undo"
            ></v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              @click="clearCanvas"
              density="comfortable"
              icon="mdi-broom"
            ></v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              @click="addImage"
              density="comfortable"
              icon="mdi-image-plus"
            ></v-btn>
          </v-col>
        </v-row>
      </v-container>
      <!-- <button @click="clearCanvas">Очистить поле</button>
      <button @click="addImage">Сохранить</button> -->
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

      this.drawCircle(x1, y1, color, lineWidth);
      this.drawCircle(x2, y2, color, lineWidth);
    },
    drawCircle(x, y, color, diametr) {
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(x, y, diametr / 2, 0, Math.PI * 2);
      ctx.fill();
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
          type: "line",
          x1: this.lastX,
          y1: this.lastY,
          x2: currentX,
          y2: currentY,
          color: this.lineColor,
          lineWidth: this.lineWidth,
        });
        this.lines.push({
          type: "circle",
          x: this.lastX,
          y: this.lastY,
          color: this.lineColor,
          diametr: this.lineWidth,
        });
        this.lines.push({
          type: "circle",
          x: currentX,
          y: currentY,
          color: this.lineColor,
          diametr: this.lineWidth,
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
          type: "line",
          x1: this.lastX,
          y1: this.lastY,
          x2: currentX,
          y2: currentY,
          color: this.lineColor,
          lineWidth: this.lineWidth,
        });
        this.lines.push({
          type: "circle",
          x: this.lastX,
          y: this.lastY,
          color: this.lineColor,
          diametr: this.lineWidth,
        });
        this.lines.push({
          type: "circle",
          x: currentX,
          y: currentY,
          color: this.lineColor,
          diametr: this.lineWidth,
        });
        this.figures.push(this.lines);
        this.lines = [];
      }
      this.isDrawing = false;
    },
    redraw() {
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.clearRect(0, 0, 700, 500);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 700, 500);
      this.figures.forEach((figure) => {
        figure.forEach((element) => {
          if (element.type === "line") {
            this.drawLine(
              element.x1,
              element.y1,
              element.x2,
              element.y2,
              element.color,
              element.lineWidth
            );
          } else if (element.type === "circle") {
            this.drawCircle(
              element.x,
              element.y,
              element.color,
              element.diametr
            );
          }
        });
      });
    },
    undoFigure() {
      if (this.figures.length > 0) {
        this.figures.pop();
        this.redraw();
      }
    },
    clearCanvas() {
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.clearRect(0, 0, 700, 500);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 700, 500);
      this.figures = [];
    },
    getMinMaxCoordinates(doubleArray) {
      const xValues = doubleArray.flatMap((subArray) =>
        subArray.flatMap((obj) =>
          [obj.x1, obj.x2, obj.x].filter((value) => value !== undefined)
        )
      );
      const yValues = doubleArray.flatMap((subArray) =>
        subArray.flatMap((obj) =>
          [obj.y1, obj.y2, obj.y].filter((value) => value !== undefined)
        )
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

      const croppedCanvas = document.createElement("canvas");
      const croppedCtx = croppedCanvas.getContext("2d");
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      croppedCtx.fillStyle = "#FFFFFF";
      croppedCtx.fillRect(0, 0, width, height);

      doubleArray.forEach((figures) => {
        figures.forEach((elem) => {
          if (elem.type === "line") {
            croppedCtx.beginPath();
            croppedCtx.strokeStyle = elem.color;
            croppedCtx.lineWidth = elem.lineWidth;
            croppedCtx.moveTo(elem.x1 - minX + 5, elem.y1 - minY + 5);
            croppedCtx.lineTo(elem.x2 - minX + 5, elem.y2 - minY + 5);
            croppedCtx.stroke();
            croppedCtx.closePath();
          } else if (elem.type === "circle") {
            croppedCtx.beginPath();
            croppedCtx.arc(
              elem.x - minX + 5,
              elem.y - minY + 5,
              elem.diametr / 2,
              0,
              Math.PI * 2
            );
            croppedCtx.fillStyle = elem.color;
            croppedCtx.fill();
            croppedCtx.closePath();
          }
        });
      });
      return croppedCanvas;
    },
    addImage() {
      const newCanvas = this.drawCroppedCanvas(this.figures);
      this.dataURL = newCanvas.toDataURL("image/jpeg", 1.0);
      console.log(this.dataURL);
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
  border: 1px dotted #0000008a;
  overflow: auto;
}
#lineWidth {
  width: 50px;
}
</style>