<template>
  <div id="bg">
    <router-view> </router-view>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less">
#bg {
  overflow: hidden;
  height: 100%;
  width: 100%;
  background: #4776e6; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #8e54e9,
    #4776e6
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #8e54e9,
    #4776e6
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
@media screen and (max-width: 576px) {
  html {
    font-size: 14px;
  }
  #home-list {
    width: 4.5rem !important;
  }
  .hidden-info {
    display: none !important;
  }
  .charts-adapt {
    float: none !important;
    width: 100% !important;
  }
}
@media screen and (min-width: 576px) and (max-width: 768px) {
  html {
    font-size: 18px;
  }
  #home-list {
    width: 4.5rem !important;
  }
  .hidden-info {
    display: none !important;
  }
  .charts-adapt {
    float: none !important;
    width: 100% !important;
  }
}
@media screen and (min-width: 768px) and (max-width: 992px) {
  html {
    font-size: 22px;
  }
  #home-list {
    width: 4.5rem !important;
  }
  .hidden-info {
    display: none !important;
  }
}
@media screen and (min-width: 992px) and (max-width: 1200px) {
  html {
    font-size: 26px;
  }
}
@media screen and (min-width: 1200px) {
  html {
    font-size: 30px;
  }
}
* {
  padding: 0;
  margin: 0;
}
body,
html,
#app {
  height: 100%;
  width: 100%;
}
</style>
