<template>
  <div>
    <a-card title="历史订单" :bordered="false" class="welcome_content">
      <!-- 历史订单表格 -->
      <a-table
        :columns="columns"
        :data-source="orderList"
        :pagination="{ pageSize: 15 }"
        :scroll="{ y: 410 }"
      >
        <!-- 状态 -->
        <div class="states_btn" slot="states" slot-scope="text, record">
          <a-button
            v-if="text == 0"
            type="danger"
            size="small"
            shape="round"
            @click="toPay(record)"
            >未支付</a-button
          >
          <a-button v-else type="primary" size="small" shape="round"
            >已支付</a-button
          >
          <!-- 显示要支付的对话框 -->
          <a-modal v-model="visiblePay" title="支付" cancel-text="取消">
            {{ record.orderid }}
            <p>请扫描二维码支付</p>
            <div id="qrCode" ref="qrCodeDiv"></div>
          </a-modal>
        </div>
        <!-- 操作 -->
        <div class="operation_btn" slot="operation" slot-scope="text, record">
          <a-button
            type="danger"
            size="small"
            icon="delete"
            shape="circle"
            @click="showModal(record.orderid)"
          ></a-button>
          <!-- 显示是否删除要打印的文件 -->
          <a-modal
            v-model="visible"
            title="删除文件"
            ok-text="确认"
            cancel-text="取消"
            @ok="deleteOrder"
          >
            <p>您确认删除文件吗？</p>
          </a-modal>
        </div>
      </a-table>
    </a-card>
  </div>
</template>

<script>
// 导入二维码显示
import QRCode from "qrcodejs2";

const columns = [
  {
    title: "编号",
    dataIndex: "key",
    width: 70,
    scopedSlots: { customRender: "key" },
  },
  {
    title: "订单号",
    dataIndex: "orderid",
    width: 100,
  },
  {
    title: "文件",
    dataIndex: "files",
    width: 100,
  },
  {
    title: "状态",
    dataIndex: "states",
    width: 100,
    scopedSlots: { customRender: "states" },
  },
  {
    title: "总页数",
    dataIndex: "pagsall",
    width: 100,
  },
  {
    title: "总价",
    dataIndex: "moneyall",
    width: 50,
  },
  {
    title: "地址",
    dataIndex: "dispatching",
    width: 150,
  },
  {
    title: "备注",
    dataIndex: "marks",
    width: 100,
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 50,
  },
];

export default {
  data() {
    return {
      columns,
      // 存储订单数据
      orderList: [],
      // 支付对话框的显示
      visiblePay: false,
      // 删除文件对话框的显示
      visible: false,
      // 显示二维码
      QRCodeHidden: false,
      // 获取订单id
      orderId: 0
    };
  },
  created() {
    this.getOrder();
  },
  methods: {
    // 获取订单数据
    async getOrder() {
      const { data: res } = await this.$http.post("/history/orderAll");
      this.orderList = [];
      res.data.forEach((item, index) => {
        let obj = {};
        obj.key = index + 1;
        obj.orderid = item.orderid;
        obj.files = item.filesList.join(",");
        obj.states = item.states;
        obj.pagsall = item.pagsall;
        obj.moneyall = item.moneyall;
        obj.marks = item.marks;
        obj.dispatching = item.dispatching;
        this.orderList.push(obj);
      });
    },

    // 未支付状态下点击按钮显示
    async toPay(item) {
      this.visiblePay = true;
      const { data: res } = await this.$http.post("/api/alipay/pay", {
        priceTotal: item.moneyall.toString(),
        uuid: item.orderid.toString(),
      });
      let data = res.data[0];
      if (!this.QRCodeHidden) {
        this.bindQRCode(data);
        this.QRCodeHidden = true;
      }
    },

    // 显示删除对话框
    showModal(orderid) {
      this.visible = true;
      this.orderId = orderid;
      console.log(orderid)
    },

    // 删除订单
    async deleteOrder() {
      const res = await this.$http.get("/history/deleteOrder", {
        params: {
          orderid: this.orderId,
        },
      });
      if (res.status !== 200) {
        return this.$message.error("删除失败！");
      }
      this.$message.success("删除成功！");
      this.visible = false;
      this.getOrder();
    },

    // 显示二维码
    bindQRCode(data) {
      new QRCode(this.$refs.qrCodeDiv, {
        text: data,
        width: 200,
        height: 200,
        colorDark: "#333",
        colorLight: "#fff",
        correctLevel: QRCode.CorrectLevel.L,
      });
    },

    // 验证支付是否成功
    isPay() {
      let start = new Date();
      let flag = "none";
      let timer = setInterval(async () => {
        const { data: res2 } = await this.$http.post("/filesorder/states", {
          orderid: this.orderid,
        });
        if (res2.code === 200) {
          clearInterval(timer);
          flag = "success";
          this.$message.success("支付成功！");
        } else {
          let end = new Date();
          if (end - start > 5000) {
            clearInterval(timer);
            flag = "error";
            this.$message.error("支付失败！");
          }
        }
      }, 1000);
    },
  },
};
</script>

<style></style>
