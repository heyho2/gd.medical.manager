<template>
  <div>
    <editor :id="tinymceId" v-model="newValue" :init="init" />
    <!-- <textarea :id="tinymceId" class="tinymce-textarea">{{newValue}}</textarea> -->
    <upload-img-button
      ref="imgbutton"
      :dialog-visible.sync="dialogVisible"
      :after-success="imageSelectorCallback"
      :hidden="true"
    />
  </div>
</template>

<script>
import plugins from './plugins'
import toolbar from './toolbar'
import Editor from '@tinymce/tinymce-vue'
import uploadImgButton from '@/components/UploadImg2/Button'

export default {
  name: 'Tinymce',
  components: { uploadImgButton, Editor },
  props: {
    id: {
      type: String,
      default: function() {
        return (
          'vue-tinymce-' +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + '')
        )
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: [String, Boolean],
      default: 'file edit insert view format table'
    },
    height: {
      type: Number,
      required: false,
      default: 360
    },
    readonly: { type: Boolean, default: false }
  },
  data() {
    return {
      tinymceId: this.id,
      dialogVisible: false,
      hasChange: false,
      hasInit: true,
      fullscreen: false,
      init: {
        language: 'zh_CN',
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        fontsize_formats: '8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 36pt', // 第二步
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true,
        readonly: this.readonly
      }
    }
  },
  computed: {
    newValue: {
      get() {
        return this.value || ''
      },
      set(val) {
        this.$emit('update:value', val)
      }
    }
  },
  watch: {},
  created() {
    var t = this
    tinymce.PluginManager.add('imageSelector', function(editor, url) {
      // Add a button that opens a window
      editor.addButton('imageSelector', {
        icon: false,
        text: '上传图片',
        tooltip: '上传图片',
        onclick: function() {
          t.$refs.imgbutton.selectFile()
          t.cbk = function(r) {
            console.log('inserting image to editor: ' + r)
            editor.execCommand(
              'mceInsertContent',
              false,
              '<img alt="Smiley face" src="' + r + '"/>'
            )
          }
        }
      })
    })
  },
  methods: {
    imageSelectorCallback(url, value) {
      this.cbk(url)
    },
    cbk(r) {}
  }
}
</script>
