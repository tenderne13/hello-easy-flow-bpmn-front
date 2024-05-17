<template>
  <div>
    解决急急急哈哈哈哈哈哈哈哈
    <el-button type="primary" @click="converToEasyFlow">转换</el-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
export default {
  name: "EasyFlowPanel",
  computed: {
    ...mapGetters(["getModeler"])
  },
  props: {
    // 这里是属性
    bpmnXml: ""
  },
  data() {
    return {

    };
  },
  created() {

  },

  methods: {
    async converToEasyFlow() {
      //console.log(this.bpmnXml)
      const modeler = this.getModeler;
      const { err, xml } = await modeler.saveXML();
      // 读取异常时抛出异常
      if (err) {
        console.error(`[Process Designer Warn ]: ${err.message || err}`);
      }
      //console.log(xml)
      let res = await axios.post("http://localhost:8080/bpmn/convert", {
        bpmnXml: xml
      });
      console.log(JSON.stringify(res.data));
    }
  }
};
</script>
