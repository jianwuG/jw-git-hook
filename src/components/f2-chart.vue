<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'App',
  setup() {
    const show = ref<boolean>(false);

    /**
     * 关闭弹窗
     */
    const closePopup = () => {
      show.value = false;
    };
    /**
     * 开启弹窗
     */
    const openPopup = () => {
      show.value = true;
    };
    return {
      show,
      closePopup,
      openPopup
    };
  }
});
</script>

<style lang="less"></style>
