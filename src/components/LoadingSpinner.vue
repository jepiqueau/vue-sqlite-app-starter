<template>
  <svg class="loading-spinner">
    <circle
      :cx="circlePositions[index] && circlePositions[index].x"
      :cy="circlePositions[index] && circlePositions[index].y"
      :r="item.radius"
      :fill="item.color"
      v-for="(item, index) in circles"
      :key="index"/>
  </svg>
</template>

<script >
const CENTER_X = 50;
const CENTER_Y = 50;
const RADIUS = 20;

function toRadians(angle) {
  return angle * Math.PI / 180;
}

function positionOnCircle(radius, angle, center) {
  return {
    x: center.x + (radius * Math.cos(toRadians(angle))),
    y: center.y + (radius * Math.sin(toRadians(angle)))
  };
}


function calculatePositions(component) {
  const angleIncrement = 360 / component.circles.length;
  const positions = [];
  for (let index = 0; index< component.circles.length; index++) {
    positions.push( positionOnCircle(
      RADIUS,
      angleIncrement * index,
      {x: CENTER_X, y: CENTER_Y}
    ));
  }
  return positions;
}

export default {
  data() {
    return {
      circles: [
        {color: '#DFE2F1', radius: 0},
        {color: '#B3BCDF', radius: 0},
        {color: '#8091CB', radius: 0},
        {color: '#4E64B7', radius: 0},
        {color: '#2642A6', radius: 0},
        {color: '#001E8A', radius: 0},
        {color: '#001D7A', radius: 0},
        {color: '#00196B', radius: 0},
        {color: '#00164D', radius: 0},
      ],
      counter: 0,
      interval: 0
    }
  },
  computed: {
    circlePositions: calculatePositions
  },
  created() {
    this.interval = setInterval(() => {
      this.counter++;
      this.circles = this.circles.map((item, index) => ({
        ...item,
        radius: (this.counter + index) % 8
      }));
    }, 70);
  },
  unmounted() {
    clearInterval(this.interval);
  }
}
</script>

<style scoped>
.loading-spinner {
  width: 100px;
  height: 100px;
}
</style>
