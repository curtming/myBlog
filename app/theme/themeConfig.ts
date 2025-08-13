// theme/themeConfig.ts
import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  components: {
    Button: {
      colorPrimary: "#00b96b",
      algorithm: true, // 启用算法
    },
  },
};

export default theme;
