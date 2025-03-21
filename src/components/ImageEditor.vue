<template>
  <div>
    <v-container>
      <v-row align="center" justify="space-around">
        <v-col cols="auto">
          <label for="color">Цвет:</label>
          <input type="color" id="color" v-model="lineColor" />
        </v-col>
        <v-col cols="auto">
          <label for="lineWidth">Толщина линии:</label>
          <v-slider
            id="lineWidth"
            v-model="lineWidth"
            show-ticks="always"
            thumb-label
            :min="1"
            :max="10"
            :step="1"
            :width="150"
          />
        </v-col>
        <v-btn-toggle v-model="drawingMode" mandatory>
          <v-col cols="auto">
            <v-btn density="comfortable" icon="mdi-sine-wave"></v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn density="comfortable" icon="mdi-vector-line"></v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn density="comfortable" icon="mdi-square-outline"></v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn density="comfortable" icon="mdi-circle-outline"></v-btn>
          </v-col>
        </v-btn-toggle>
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
            icon="mdi-download"
          ></v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <canvas
            ref="canvas"
            id="myCanvas"
            width="700"
            height="500"
            @mousedown="beginDrawing"
            @mousemove="keepDrawing"
            @mouseup="stopDrawing"
          />
        </v-col>
      </v-row>
    </v-container>
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
      drawingMode: 0,
    };
  },
  methods: {
    drawLine(ctx, x1, y1, x2, y2, color, lineWidth) {
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
    drawRectangle(ctx, x, y, width, height, color, lineWidth) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(x, y, width, height);
      ctx.closePath();
    },
    drawEllipse(ctx, centerX, centerY, radiusX, radiusY, color, lineWidth) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
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
        switch (this.drawingMode) {
          case 0:
            this.drawLine(
              this.$refs.canvas.getContext("2d"),
              this.lastX,
              this.lastY,
              currentX,
              currentY,
              this.lineColor,
              this.lineWidth
            );
            this.lines.push({
              type: "polyline",
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
            break;
          case 1:
            this.redraw();
            this.drawLine(
              this.$refs.canvas.getContext("2d"),
              this.lastX,
              this.lastY,
              currentX,
              currentY,
              this.lineColor,
              this.lineWidth
            );
            break;
          case 2:
            const width = currentX - this.lastX;
            const height = currentY - this.lastY;
            this.redraw();
            this.drawRectangle(
              this.$refs.canvas.getContext("2d"),
              this.lastX,
              this.lastY,
              width,
              height,
              this.lineColor,
              this.lineWidth
            );
            break;
          case 3:
            const radiusX = Math.abs(currentX - this.lastX) / 2;
            const radiusY = Math.abs(currentY - this.lastY) / 2;
            const centerX = (currentX + this.lastX) / 2;
            const centerY = (currentY + this.lastY) / 2;
            this.redraw();
            this.drawEllipse(
              this.$refs.canvas.getContext("2d"),
              centerX,
              centerY,
              radiusX,
              radiusY,
              this.lineColor,
              this.lineWidth
            );
            break;
        }
      }
    },
    stopDrawing(e) {
      if (this.isDrawing) {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        switch (this.drawingMode) {
          case 0:
            this.drawLine(
              this.$refs.canvas.getContext("2d"),
              this.lastX,
              this.lastY,
              currentX,
              currentY,
              this.lineColor,
              this.lineWidth
            );
            this.lines.push({
              type: "polyline",
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
            break;
          case 1:
            this.figures.push([
              {
                type: "straight",
                x1: this.lastX,
                y1: this.lastY,
                x2: currentX,
                y2: currentY,
                color: this.lineColor,
                lineWidth: this.lineWidth,
              },
            ]);
            break;
          case 2:
            const width = currentX - this.lastX;
            const height = currentY - this.lastY;
            this.figures.push([
              {
                type: "rectangle",
                x: this.lastX,
                y: this.lastY,
                width: width,
                height: height,
                color: this.lineColor,
                lineWidth: this.lineWidth,
              },
            ]);
            break;
          case 3:
            const radiusX = Math.abs(currentX - this.lastX) / 2;
            const radiusY = Math.abs(currentY - this.lastY) / 2;
            const centerX = (currentX + this.lastX) / 2;
            const centerY = (currentY + this.lastY) / 2;
            this.figures.push([
              {
                type: "ellipse",
                centerX: centerX,
                centerY: centerY,
                radiusX: radiusX,
                radiusY: radiusY,
                color: this.lineColor,
                lineWidth: this.lineWidth,
              },
            ]);
            console.log(this.figures);
            break;
        }
      }
      this.isDrawing = false;
    },
    redraw() {
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
      this.figures.forEach((figure) => {
        figure.forEach((elem) => {
          switch (elem.type) {
            case "polyline":
              this.drawLine(
                ctx,
                elem.x1,
                elem.y1,
                elem.x2,
                elem.y2,
                elem.color,
                elem.lineWidth
              );
              break;
            case "circle":
              this.drawCircle(elem.x, elem.y, elem.color, elem.diametr);
              break;
            case "straight":
              this.drawLine(
                ctx,
                elem.x1,
                elem.y1,
                elem.x2,
                elem.y2,
                elem.color,
                elem.lineWidth
              );
              break;
            case "rectangle":
              this.drawRectangle(
                this.$refs.canvas.getContext("2d"),
                elem.x,
                elem.y,
                elem.width,
                elem.height,
                elem.color,
                elem.lineWidth
              );
              break;
            case "ellipse":
              this.drawEllipse(
                ctx,
                elem.centerX,
                elem.centerY,
                elem.radiusX,
                elem.radiusY,
                elem.color,
                elem.lineWidth
              );
              break;
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
      ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
      this.figures = [];
    },
    getMinMaxCoordinates(doubleArray) {
      const xValues = doubleArray.flatMap((subArray) =>
        subArray.flatMap((obj) => {
          let values = [obj.x1, obj.x2, obj.x].filter(
            (value) => value !== undefined
          );
          if (obj.x !== undefined && obj.width !== undefined) {
            values.push(obj.x + obj.width);
          }
          if(obj.centerX !== undefined){
            values.push(obj.centerX + obj.radiusX);
          }
          return values;
        })
      );
      const yValues = doubleArray.flatMap((subArray) =>
        subArray.flatMap((obj) => {
          let values = [obj.y1, obj.y2, obj.y].filter(
            (value) => value !== undefined
          );
          if (obj.y !== undefined && obj.height !== undefined) {
            values.push(obj.y + obj.height);
          }
          if(obj.centerY !== undefined){
            values.push(obj.centerY + obj.radiusY);
          }
          return values;
        })
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
          switch (elem.type) {
            case "polyline":
              this.drawLine(
                croppedCtx,
                elem.x1 - minX + 5,
                elem.y1 - minY + 5,
                elem.x2 - minX + 5,
                elem.y2 - minY + 5,
                elem.color,
                elem.lineWidth
              );
              break;
            case "circle":
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
              break;
            case "straight":
              this.drawLine(
                croppedCtx,
                elem.x1 - minX + 5,
                elem.y1 - minY + 5,
                elem.x2 - minX + 5,
                elem.y2 - minY + 5,
                elem.color,
                elem.lineWidth
              );
              break;
            case "rectangle":
              this.drawRectangle(
                croppedCtx,
                elem.x - minX + 5,
                elem.y - minY + 5,
                elem.width,
                elem.height,
                elem.color,
                elem.lineWidth
              );
              break;
            case "ellipse":
              this.drawEllipse(
                croppedCtx,
                elem.centerX - minX + 5,
                elem.centerY - minY + 5,
                elem.radiusX,
                elem.radiusY,
                elem.color,
                elem.lineWidth
              );
              break;
          }
        });
      });
      return croppedCanvas;
    },
    addImage() {
      this.dataURL = this.drawCroppedCanvas(this.figures).toDataURL(
        "image/jpeg",
        1.0
      );
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