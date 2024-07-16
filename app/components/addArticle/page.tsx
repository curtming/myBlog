'use client'

import React, { useEffect, useState } from 'react'
import Editor from './Editor'
import axios from 'axios'
import { Button, Input, Form } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'

const CreatePost: React.FC = () => {
  const [content, setContent] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('submit')
    // 处理提交逻辑
    try {
      const time = dayjs().format('YYYY-MM-DD HH:mm:ss')

      const response = await axios.post('/api/article/create', {
        title,
        content,
        time,
        author: 'admin'
      })
      console.log('response', response)
      if (response.status === 200) {
        router.push('/resultPage/success')
      }
      console.log('Post created:', response.data)
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Form onFinish={handleSubmit}>
        <Form.Item>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant='borderless'
            placeholder='输入标题'
            className='title-wrapper'
          ></Input>
        </Form.Item>
        <Form.Item>
          <Editor value={content} onChange={setContent} />
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            style={{ float: 'right', margin: '5px 2px' }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreatePost
