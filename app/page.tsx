'use client'
// app目录下的组件默认都是server side的， 但onChange是需要在Client Side处理的也就是在浏览器上处理，所以需要声明组件是client side的

import { Avatar, FloatButton, Dropdown, Card, List, Button } from 'antd'
import {
  AntDesignOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import Heartbeat from './components/heartbeat/page'
import { FloatButtonElement } from 'antd/es/float-button/interface'
// ！useRouter 新版本必须从navigation导入，之前从router导入
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { title } from 'process'
import dayjs from 'dayjs'

export default function Home() {
  const router = useRouter()

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://www.antgroup.com'
        >
          主页
        </a>
      )
    },
    {
      key: '2',
      label: (
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://www.aliyun.com'
        >
          博文
        </a>
      )
    },
    {
      key: '3',
      label: (
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://www.luohanacademy.com'
        >
          留言
        </a>
      )
    }
  ]

  const [collapsed, setCollapsed] = useState(false)
  const floatBtnRef = useRef<FloatButtonElement>(null)

  interface ArticlesList {
    href: string
    title: string
    description: string
    date: string
  }
  const [articleLists, setArticelLists] = useState<ArticlesList[]>([])

  const getArticlesLists = async () => {
    // new Array(10).fill([]).map((_, i) => {
    //   return {
    //     href: 'http://localhost:3000',
    //     title: `ant design part ${i}`,
    //     description:
    //       'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    //     content:
    //       'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
    //   }
    // })
    const res = await axios.get('/api/article/getLists')
    if (res.status === 200) {
      let resLists = res.data.data.map((item: any) => {
        return {
          href: '',
          title: item.title,
          description: '',
          date: dayjs(item.updated_at).format('YYYY-MM-DD')
        }
      })
      setArticelLists(resLists)
    }
    console.log('res', res)
  }
  // console.log('===>', articlesLists())
  useEffect(() => {
    getArticlesLists()

    // 组件挂载后，myRef.current 不会为 null
    if (floatBtnRef.current) {
      // 在这里可以访问 DOM 元素
      floatBtnRef.current.addEventListener('mouseenter', () => {
        console.log('mouseenter')
      })
      console.log(floatBtnRef.current)
    }

    // 清理事件监听器
    return () => {}
  }, [])

  return (
    <div className='flex min-h-screen flex-col items-center'>
      <Dropdown menu={{ items }} placement='top'>
        <FloatButton
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          ref={floatBtnRef}
        />
      </Dropdown>
      <div>
        <Button onClick={() => router.push('/login')}>Login</Button>
        <Button onClick={() => router.push('/components/addArticle')}>
          Writing
        </Button>
      </div>
      <header className='flex items-center justify-center header-wrapper'>
        <Heartbeat />
        <div className='avatar-wrapper'>
          <Avatar
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            icon={<AntDesignOutlined />}
          />
          <div style={{ color: 'white' }}>
            <p>
              Hi, I&apos; m&nbsp;
              <span className='theme-point-font-color'>Eclipse</span>
            </p>
            <p>Don&apos;t forget to be happy</p>
          </div>
        </div>
      </header>
      <main>
        <List
          style={{ width: '95vw' }}
          header={
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              CONTENT DIRECTORY
            </div>
          }
          bordered
          dataSource={articleLists}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<a href={item.href}>{item.title}</a>}
                description={item.description}
              />
              <div style={{ color: '#00000073' }}>{item.date}</div>
            </List.Item>
          )}
        />
      </main>
    </div>
  )
}
