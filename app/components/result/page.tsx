"use client"
import React from 'react'
import { Button, Result } from 'antd'
import { ResultStatusType } from 'antd/es/result'

const ResultComponent: React.FC<any> = ({
  status,
  title,
  buttons
}: {
  status: ResultStatusType,
  title: string
  buttons: Array<object>
}) => {
  const buttonLists = buttons.map((item: any) => {
    return (
      <Button type={item.type} key={item.key} onClick={item.clickHandler}>
        {item.key}
      </Button>
    )
  })
  return (
    <>
      <Result
        status={status}
        title={title}
        subTitle='Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait.'
        extra={buttonLists}
      />
    </>
  )
}

export default ResultComponent
