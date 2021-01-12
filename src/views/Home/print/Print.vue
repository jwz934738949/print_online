<template>
  <div>
    <a-card title="打印" :bordered="false" class="welcome_content">
      <!-- 打印主体部分 -->
      <div class="print_content">
        <!-- 步骤条 -->
        <a-steps :current="current" class="steps" direction="vertical">
          <a-step title="开始打印" />
          <a-step title="文件上传" />
          <a-step title="填写信息" />
          <a-step title="确认打印" />
        </a-steps>

        <!-- tabs选项卡 -->
        <a-tabs :active-key="activeKey" @tabClick="callback" class="tabs">
          <a-tab-pane key="1" tab="文件上传">
            <!-- 上传功能 -->
            <div class="upload_wrap">
              <a-upload
                class="upload"
                name="file"
                action="http://47.95.4.133:8080/files/upload"
                list-type="picture"
                :default-file-list="fileList"
                @change="uploadFiles"
                :headers="headers"
              >
                <a-button>
                  <a-icon type="upload" />
                  upload
                </a-button>
              </a-upload>

              <!-- 表格数据 -->
              <a-table
                class="table"
                :columns="columns"
                :data-source="uploadList"
                :pagination="{ pageSize: 5 }"
              >
                <span slot="key" slot-scope="text">
                  {{ text }}
                </span>
                <div
                  class="operation"
                  slot="operation"
                  slot-scope="text, record"
                >
                  <div class="pagenum_change">
                    <a-button size="small" ref="subBtn" @click="subNum(record)"
                      >-
                    </a-button>
                    <span>{{ record.copies }}</span>
                    <a-button size="small" @click="addNum(record)">+</a-button>
                  </div>
                  <a-button
                    class="delete_btn"
                    type="danger"
                    size="small"
                    icon="delete"
                    @click="showModal"
                  ></a-button>
                  <!-- 显示是否删除要打印的文件 -->
                  <a-modal
                    v-model="visible"
                    title="删除文件"
                    ok-text="确认"
                    cancel-text="取消"
                    @ok="deleteFile(record.fileid)"
                  >
                    <p>您确认删除文件吗？</p>
                  </a-modal>
                </div>
              </a-table>

              <!-- 下一步 -->
              <a-button type="primary" @click="uploadFinish">下一步</a-button>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="填写信息">
            <div class="isSend">
              <span>是否配送：</span>
              <a-button type="primary" @click="send = true">是</a-button>
              <a-button type="danger" @click="send = false">否</a-button>
            </div>
            <a-form-model
              ref="sendFormRef"
              :model="sendForm"
              :rules="sendRules"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-form-model-item label="配送地址" prop="address" v-if="send">
                <a-input
                  v-model="sendForm.address"
                  placeholder="请输入配送地址"
                />
              </a-form-model-item>
              <a-form-model-item label="取件时间" prop="time" v-if="send">
                <a-date-picker
                  show-time
                  v-model="sendForm.time"
                  placeholder="请输入取件时间"
                  style="width: 100%"
                />
              </a-form-model-item>
              <a-form-model-item label="是否彩印">
                <a-radio-group v-model="sendForm.isColor">
                  <a-radio :value="0"> 否</a-radio>
                  <a-radio :value="1"> 是</a-radio>
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item label="打印方式" prop="side">
                <a-select v-model="sendForm.side" placeholder="请选择打印方式">
                  <a-select-option value="0"> 单面</a-select-option>
                  <a-select-option value="1"> 双面</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="备注" prop="remark">
                <a-textarea
                  v-model="sendForm.remark"
                  placeholder="请输入备注"
                  :rows="4"
                />
              </a-form-model-item>
            </a-form-model>
            <a-button type="primary" class="btn" @click="previewBtn">
              上一步
            </a-button>
            <a-button type="primary" class="btn" @click="nextBtn"
              >下一步
            </a-button>
          </a-tab-pane>
          <a-tab-pane key="3" tab="确认打印">
            <div id="qrCode" ref="qrCodeDiv"></div>
          </a-tab-pane>
        </a-tabs>
      </div>
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
    title: "文件名",
    dataIndex: "name",
    width: 100,
  },
  {
    title: "页数",
    dataIndex: "size",
    width: 100,
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 150,
  },
];

export default {
  data() {
    return {
      uploadList: [],
      columns,
      fileList: [],
      headers: {},
      // 步骤条进度索引
      current: 1,
      // tabs激活索引
      activeKey: "1",
      // 删除文件对话框的显示
      visible: false,
      setid: 0,
      filesid: "",
      orderid: 0,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      // 是否选择配送
      send: false,
      sendForm: {
        address: "",
        time: undefined,
        isColor: 0,
        side: undefined,
        remark: "",
      },
      sendRules: {
        address: [
          {
            required: true,
            message: "请输入配送地址",
            trigger: "blur",
          },
          {
            min: 10,
            max: 50,
            message: "配送地址为5-50个字符",
            trigger: "blur",
          },
        ],
        time: [
          { required: true, message: "请选择有效时间", trigger: "change" },
        ],
        side: [
          {
            required: true,
            message: "请选择打印方式",
            trigger: "change",
          },
        ],
        remark: [
          {
            required: true,
            message: "请输入备注信息",
            trigger: "blur",
          },
        ],
      },
      // 显示二维码
      QRCodeHidden: false
    };
  },
  created() {
    let token = window.sessionStorage.getItem("token");
    this.headers = {
      token,
    };
    this.getPrintFile();
  },
  methods: {
    callback(key) {
      this.activeKey = key;
      this.current = Number(key);
    },

    // 获取要打印的文件
    async getPrintFile() {
      const { data: res } = await this.$http.post("/files/showAllNotPay");
      this.uploadList = [];
      res.data.forEach((item, index) => {
        let obj = {};
        obj.key = index + 1;
        obj.name = item.oldfilename;
        obj.size = item.size;
        obj.copies = item.copies;
        obj.fileid = item.fileid;
        this.uploadList.push(obj);
      });
    },

    // 上传文件
    uploadFiles(res) {
      if (res.file.status === "done") {
        let len = res.fileList.length;
        const res2 = res.fileList[len - 1].response;
        if (res2.code !== 200) {
          return this.$message.error("上传失败！");
        }
        this.$message.success("上传成功！");
        this.getPrintFile();
      }
    },

    // 减少打印的份数
    subNum(record) {
      if (record.num <= 1) {
        return this.$message.warn("文件份数最小为1！");
      } else {
        record.copies--;
      }
    },

    // 增加打印的份数
    addNum(record) {
      record.copies++;
    },

    // 显示删除对话框
    showModal() {
      this.visible = true;
    },

    // 删除上传的文件
    async deleteFile(id) {
      await this.$http.get("/files/delete", {
        params: {
          fileid: id,
        },
      });
      this.$message.success("删除成功！");
      this.visible = false;
      await this.getPrintFile();
    },

    // 文件上传成功，点击下一步按钮
    async uploadFinish() {
      const { data: res } = await this.$http.post("/fileset/sets", {
        fileList: this.uploadList,
      });
      this.setid = res.data.setid;
      this.filesid = res.data.filesid;
      this.current++;
      this.activeKey = String(this.current);
    },

    // 点击上一步按钮，返回上一步
    previewBtn() {
      this.current--;
      this.activeKey = String(this.current);
    },

    // 点击下一步按钮
    nextBtn() {
      this.$refs.sendFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("信息填写失败！");
        }
        const date = new Date(this.sendForm.time);
        // 将日期格式转为字符串格式
        const dateString = this.dateToString(date);
        const { data: res } = await this.$http.post("/fileset/setsok", {
          address: this.sendForm.address,
          time: dateString,
          colour: this.sendForm.isColor,
          sads: this.sendForm.side,
          remarks: this.sendForm.remark,
          setid: this.setid,
        });
        if (res.code !== 200) {
          return this.$message.error("信息上传失败！");
        }
        this.$message.success("信息上传成功！");
        let data = res.data[0];
        this.orderid = res.data[1];
        this.current++;
        this.activeKey = String(this.current);

        this.$nextTick(() => {
          if (!this.QRCodeHidden) {
            this.bindQRCode(data);
            this.QRCodeHidden = true;
          }
        });
        this.isPay();
      });
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
        if (flag === "success" || flag === "error") {
          // 不论支付成功或者失败，返回第一步
          this.current = 1;
          this.activeKey = String(this.current);
          flag = "none";
          return;
        }
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
.print_content {
  margin: 15px;
  padding: 20px;
  display: flex;

  .steps {
    flex: 1;
  }

  .tabs {
    flex: 3;
    margin-top: -15px;

    .table {
      margin-top: 10px;

      .operation {
        display: flex;
        justify-content: space-evenly;
        margin-left: -80px;

        .pagenum_change {
          width: 65px;
          display: flex;
          justify-content: space-around;
        }
      }
    }

    .isSend {
      color: #000;
      margin: 10px 50px;

      .ant-btn {
        margin: 0 5px;
      }
    }

    .btn {
      margin-left: 40px;
    }
  }
}
</style>
