<template>
  <div class="json-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/rubyblue.css'
require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'

export default {
  name: 'JsonEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value', 'readOnly'],
  data() {
    return {
      jsonEditor: false
    }
  },
  watch: {
    value(value) {
      const editorValue = this.jsonEditor.getValue()
      if (value !== editorValue) {
        this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
      }
    }
  },
  mounted() {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: false,
      mode: 'application/json',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'white',
      lint: true,
      lineWrapping: true,
      abSize: 2,
      readOnly: this.readOnly ? 'nocursor' : false
    })

    this.jsonEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  created(){
    setTimeout(() => {
      this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
      this.jsonEditor.refresh();
    }, 100);
  },
  methods: {
    getValue() {
      return this.jsonEditor.getValue()
    },
  }
}
</script>

<style lang="scss" scoped>
.json-editor {
  // height: 100%;
  position: relative;

  ::v-deep {
    .CodeMirror {
      height: auto;
      min-height: 300px;
    }

    .CodeMirror-scroll {
      min-height: 300px;
    }

    .cm-s-rubyblue span.cm-string {
      color: #F08047;
    }

    .cm-string, .cm-atom, .cm-number{
      color: #0451A5;
    }

    .cm-property{
      color: #A31515;
    }
  }
}
</style>
