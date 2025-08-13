"use client";
import { Button, Flex } from "antd";
import "./style.scss";

const Menu: React.FC<any> = ({ direction }: { direction: string }) => {
  const menuLists = [
    { route: "/", name: "HOME" },
    { route: "pages/resume", name: "RESUME" },
    { route: "/article", name: "ARTICLES" },
  ];

  return (
    <>
      <div className={`${direction} menu-wrapper`}>
        {menuLists.map((item) => (
          <Button
            className="menu-btn"
            type="text"
            key={item.route}
            href={item.route}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </>
  );
};

export default Menu;
