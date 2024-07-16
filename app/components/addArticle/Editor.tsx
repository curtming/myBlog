'use client'
// components/RichTextEditor.js
import { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css' // 代码高亮风格，选择更多风格需导入 node_modules/hightlight.js/styles/ 目录下其它css文件
import './style.scss'
const RichTextEditor = ({
  value,
  onChange
}: {
  value: string
  onChange: (value: string) => void
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill | null>(null)

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          syntax: { hljs },
          toolbar: '#toolbar-container'
        }
      })

      quillRef.current.on('text-change', () => {
        if (editorRef.current) {
          const html = editorRef.current.children[0].innerHTML
          onChange(html)
        }
      })

      // Set initial value
      if (value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value)
      }
    }
  }, [value, onChange])

  return (
    <>
      <div id='toolbar-container'>
        <span className='ql-formats'>
          <select className='ql-font'></select>
          <select className='ql-size'></select>
        </span>
        <span className='ql-formats'>
          <button className='ql-bold'></button>
          <button className='ql-italic'></button>
          <button className='ql-underline'></button>
          <button className='ql-strike'></button>
        </span>
        <span className='ql-formats'>
          <select className='ql-color'></select>
          <select className='ql-background'></select>
        </span>
        <span className='ql-formats'>
          <button className='ql-script' value='sub'></button>
          <button className='ql-script' value='super'></button>
        </span>
        <span className='ql-formats'>
          <button className='ql-header' value='1'></button>
          <button className='ql-header' value='2'></button>
          <button className='ql-blockquote'></button>
          <button className='ql-code-block'></button>
        </span>
        <span className='ql-formats'>
          <button className='ql-list' value='ordered'></button>
          <button className='ql-list' value='bullet'></button>
          <button className='ql-indent' value='-1'></button>
          <button className='ql-indent' value='+1'></button>
        </span>
        <span className='ql-formats'>
          <button className='ql-direction' value='rtl'></button>
          <select className='ql-align'></select>
        </span>
        <span className='ql-formats'>
          <button className='ql-link'></button>
          <button className='ql-image'></button>
          <button className='ql-video'></button>
          <button className='ql-formula'></button>
        </span>
        <span className='ql-formats'>
          <button className='ql-clean'></button>
        </span>
      </div>
      <div ref={editorRef} style={{ width: '100%', height: '60vh' }} />
    </>
  )
}

export default RichTextEditor
