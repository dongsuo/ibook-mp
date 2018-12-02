<template>
<div>
  <span class="rating-num">豆瓣评分：</span>
  <span class="rating">☆☆☆☆☆<span :style="{ width: rating.average*10+'%' }">★★★★★</span>
  </span>
  <span class="rating-num">{{rating.average}}/[{{rating.numRaters}}人]</span>
</div>
</template>

<script>
export default {
  name: 'Rating',
  props: {
    rating: {
      type: Object,
      required: true
    }
  }
}
</script>


<style scoped>
.rating{
  font-size: 18px;
  color: gold;
  position: relative;
}
.rating span{
  color: gold;
  position:absolute;
  top:0;
  left:0;
  overflow: hidden;
}
.rating-num{
  font-size: 13px;
  color: #aaa;
}
</style>
