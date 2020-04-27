//* ****************健康档案*会员列表************************ */
const member = {
  state: {

    // 当前选中的健康档案会员ID
    member_vip_id: '',

    current_table_item_id: '',

    // 选中的指标id（新增使用）
    current_openDrawer_id: '',

    // 当前选中的健康档案会员信息
    member_vip_info: {
      nickName: '',
      phone: ''
    },

    // 显示内容控制开关
    member_ctx: {
      is_info: false, // 个人信息
      is_question: false, // 问卷管理 table
      is_detail: false, // 问卷管理 问卷详情
      is_test: false, // 检验报告 table
      is_upload: false, // 检验报告 编辑||新增
      is_check: false // 检验报告 查看

    },

    // 弹窗
    member_dialog: false,

    member_dialog_name: '',

    // 新增或是编辑状态 0:新增 1：编辑 2：查看
    member_test_is_edit: 0,

    // 检验报告两个输入框
    member_test_report: {
      reportName: '',
      suggestion: ''
    }

  },

  getters: {
    // 弹窗
    get_member_dialog: state => state.member_dialog,

    // 组件显示
    get_member_ctx: state => state.member_ctx,

    // 报告文体
    get_member_test_report: state => state.member_test_report
  },

  mutations: {
    // 弹窗开关 isDialog:Boolean
    SET_MEMBER_DIALOG_SHOW(state, isDialog) {
      state.member_dialog = isDialog
    },

    // 弹窗上下文显示开关 ctx:String
    SET_MEMBER_CTX(state, ctx) {
      if (ctx === 'info' || ctx === 'question' || ctx === 'test') {
        state.member_dialog_name = ctx
      }

      Object.keys(state.member_ctx).forEach(i => {
        state.member_ctx[i] = false

        if (i === `is_${ctx}`) {
          state.member_ctx[i] = true
        }
      })
    },

    // 储存 当前选中的健康档案会员 id:String
    SET_MEMBER_VIP_ID(state, id) {
      state.member_vip_id = id
    },

    // 储存操作后选中表格的ID
    SET_MEMBER_TABLE_CURRENT_ID(state, id) {
      state.current_table_item_id = id
    },

    // 储存个人信息 - 日常信息 - 选中指标ID
    SET_MEMBER_CURRENT_OPENDRAWER_ID(state, id) {
      state.current_openDrawer_id = id
    },

    // 储存 当前选中的健康档案会员信息
    SET_MEMBER_VIP_INFO(state, obj) {
      state.member_vip_info = obj
    },

    // 设置检验报告状态 v:Number enum
    SET_MEMBER_TEXT_IS_EDIT(state, v) {
      state.member_test_is_edit = v
    },

    // 存储检验报告文体
    SET_MEMBER_TEXT_REPORT(state, obj) {
      if (!obj) {
        state.member_test_report = {
          reportName: '',
          suggestion: ''
        }
      } else {
        state.member_test_report = obj
      }
    }
  },

  actions: {

  }

}
export default member
