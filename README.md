# 设备管理系统

一个基于Spring Boot和Vue.js的智能设备管理系统，集成了小米MiMo AI助手。

## 功能特性

- 用户认证与授权（JWT）
- 设备管理（CRUD操作）
- 智能AI助手（小米MiMo API）
- 实时聊天（WebSocket）
- 用户管理与好友系统

## 技术栈

### 后端
- Java 17
- Spring Boot 3.x
- Spring Security + JWT
- Spring Data JPA
- MySQL
- WebSocket

### 前端
- Vue.js 3
- Vite
- Axios
- Vue Router
- Pinia

## 快速开始

### 环境要求
- Java 17+
- Node.js 18+
- MySQL 8.0+

### 后端启动
```bash
cd backend
mvn spring-boot:run
```

### 前端启动
```bash
cd frontend
npm install
npm run dev
```

### 访问地址
- 前端: http://localhost:5173
- 后端API: http://localhost:8081

## 配置说明

### 数据库配置
在 `backend/src/main/resources/application.yml` 中配置数据库连接信息。

### AI助手配置
在 `backend/src/main/resources/application.yml` 中配置小米MiMo API：
```yaml
app:
  deepseek:
    api-key: your-api-key
    api-url: https://token-plan-cn.xiaomimimo.com/v1/chat/completions
    model: mimo-v2.5-pro
```

## 项目结构

```
device-management/
├── backend/                # Spring Boot后端
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/      # Java源代码
│   │   │   └── resources/ # 配置文件
│   │   └── test/          # 测试代码
│   └── pom.xml            # Maven配置
├── frontend/               # Vue.js前端
│   ├── src/
│   │   ├── views/         # 页面组件
│   │   ├── store/         # 状态管理
│   │   ├── router/        # 路由配置
│   │   └── utils/         # 工具函数
│   └── package.json       # npm配置
└── README.md              # 项目说明
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License