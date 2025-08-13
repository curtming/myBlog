"use client";
import "./style.scss";
import { Steps, ConfigProvider, Flex } from "antd";
import React, { useState, useRef, useEffect } from "react";
import {
  HeartOutlined,
  FormatPainterOutlined,
  StarOutlined,
} from "@ant-design/icons";
const stepsTheme = {
  token: {
    // Seed Token，影响范围大
    colorPrimary: "#000000",
    // colorBorderSecondary: "#cb4fe5",
    // colorSplit: "#cb4fe5",
    // colorTextDisabled: "#000000",
  },
};

const stepItems = [
  {
    title: "SKILLS",
    icon: <HeartOutlined />,
  },
  {
    title: "EXPERIENCE",
    icon: <FormatPainterOutlined />,
  },
  {
    title: "PROJECTS",
    icon: <StarOutlined />,
  },
];

const Resume: React.FC<any> = () => {
  const [current, setCurrent] = useState(0);
  const showContentRef = useRef<any>(null);
  const onChange = (value: number) => {
    console.log("onChange:", showContentRef.current.classList);
    showContentRef.current.classList.add("bounce-out-bottom");
    setTimeout(() => {
      setCurrent(value);
      showContentRef.current.classList.remove("bounce-out-bottom");
    }, 1200);
  };

  const ShowContent = () => {
    if (current === 0) {
      return (
        <Flex gap="0" vertical>
          {new Array(3).fill(null).map((_, rowIndex) => (
            <Flex key={rowIndex} gap="0">
              {new Array(3).fill(null).map((_, colIndex) => (
                <div key={colIndex} className="cell">
                  {(rowIndex+colIndex) % 2 === 0 && "JavaScript"}
                </div>
              ))}
            </Flex>
          ))}
        </Flex>
      );
    }else if (current === 1) {
      return <>Experience</>;
    }
    return <>Thank you !</>;
  };

  return (
    <div className="flex min-h-screen flex-col items-center resume-background">
      <div className="content">
        <div className="side-wrapper">
          <ConfigProvider theme={stepsTheme}>
            <Steps
              size="small"
              current={current}
              onChange={onChange}
              className="site-navigation-steps"
              direction="vertical"
              items={stepItems}
            />
          </ConfigProvider>
        </div>

        <div className="show-wrapper flex items-center justify-center">
          <div ref={showContentRef}>
            <ShowContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
