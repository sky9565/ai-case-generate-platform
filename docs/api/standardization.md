# 需求标准化模块接口文档

## 概述

本文档描述智能测试用例平台「需求标准化」模块的接口规范，涵盖需求录入、文档标准化、AI头脑风暴、版本管理、质量评分、需求拆分、文档导出、历史记录等全部功能。

**基础路径**：`/api/v1`

**通用规范**：
- 所有接口需携带 `Authorization: Bearer <token>` 请求头
- 请求体统一使用 `application/json`（文件上传除外）
- 响应体统一格式：

```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {},
  "traceId": "uuid-string"
}
```

---

## 目录

- [1. 需求管理](#1-需求管理)
  - [1.1 创建需求](#11-创建需求)
  - [1.2 获取需求列表](#12-获取需求列表)
  - [1.3 获取需求详情](#13-获取需求详情)
  - [1.4 更新需求](#14-更新需求)
  - [1.5 删除需求](#15-删除需求)
- [2. 文件上传](#2-文件上传)
  - [2.1 上传需求文档](#21-上传需求文档)
- [3. 文档标准化](#3-文档标准化)
  - [3.1 执行标准化](#31-执行标准化)
  - [3.2 获取标准化结果](#32-获取标准化结果)
- [4. AI头脑风暴](#4-ai头脑风暴)
  - [4.1 发送对话消息](#41-发送对话消息)
  - [4.2 获取对话历史](#42-获取对话历史)
  - [4.3 采纳AI建议](#43-采纳ai建议)
  - [4.4 拒绝AI建议](#44-拒绝ai建议)
- [5. 版本管理](#5-版本管理)
  - [5.1 获取版本列表](#51-获取版本列表)
  - [5.2 获取版本详情](#52-获取版本详情)
  - [5.3 恢复版本](#53-恢复版本)
  - [5.4 获取版本差异](#54-获取版本差异)
- [6. 质量评分](#6-质量评分)
  - [6.1 执行质量评分](#61-执行质量评分)
- [7. 需求拆分](#7-需求拆分)
  - [7.1 执行需求拆分](#71-执行需求拆分)
  - [7.2 获取拆分结果列表](#72-获取拆分结果列表)
  - [7.3 更新拆分项](#73-更新拆分项)
  - [7.4 删除拆分项](#74-删除拆分项)
  - [7.5 手动添加拆分项](#75-手动添加拆分项)
- [8. 文档导出](#8-文档导出)
  - [8.1 导出标准化文档](#81-导出标准化文档)
- [9. 历史记录](#9-历史记录)
  - [9.1 获取历史记录列表](#91-获取历史记录列表)
  - [9.2 获取历史记录详情](#92-获取历史记录详情)
- [10. 错误码说明](#10-错误码说明)

---

## 1. 需求管理

### 1.1 创建需求

用户录入新需求（文本或上传文档后），创建需求记录。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/requirements` |
| Method | `POST` |
| Content-Type | `application/json` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | string | 是 | 需求标题，最大长度 200 |
| inputMode | string | 是 | 输入模式：`text`（文本输入）/ `file`（文档上传） |
| rawContent | string | 否 | 原始需求文本内容（inputMode=text 时必填） |
| fileId | string | 否 | 上传文件的ID（inputMode=file 时必填） |

**请求示例**

```json
{
  "title": "用户登录系统需求",
  "inputMode": "text",
  "rawContent": "实现用户登录功能，支持用户名密码验证，登录成功后跳转到首页。"
}
```

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.id | string | 需求ID |
| data.title | string | 需求标题 |
| data.inputMode | string | 输入模式 |
| data.rawContent | string | 原始需求内容 |
| data.status | string | 状态：`draft`（草稿）/ `standardized`（已标准化）/ `splitted`（已拆分） |
| data.createdAt | string | 创建时间 |
| data.updatedAt | string | 更新时间 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": "req_001",
    "title": "用户登录系统需求",
    "inputMode": "text",
    "rawContent": "实现用户登录功能，支持用户名密码验证，登录成功后跳转到首页。",
    "status": "draft",
    "createdAt": "2026-05-11T10:00:00.000Z",
    "updatedAt": "2026-05-11T10:00:00.000Z"
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 1.2 获取需求列表

获取当前用户的所有需求列表，用于左侧历史记录展示。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/requirements` |
| Method | `GET` |

**请求参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页条数，默认 20 |
| keyword | string | 否 | 搜索关键词，匹配标题 |
| status | string | 否 | 状态筛选：`draft` / `standardized` / `splitted` |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.items | array | 需求列表 |
| data.items[].id | string | 需求ID |
| data.items[].title | string | 需求标题 |
| data.items[].status | string | 状态 |
| data.items[].createdAt | string | 创建时间 |
| data.items[].updatedAt | string | 更新时间 |
| data.pageNo | number | 当前页码 |
| data.pageSize | number | 每页条数 |
| data.total | number | 总条数 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "查询成功",
  "data": {
    "items": [
      {
        "id": "req_001",
        "title": "用户登录系统需求",
        "status": "splitted",
        "createdAt": "2026-05-10T14:30:00.000Z",
        "updatedAt": "2026-05-10T15:00:00.000Z"
      },
      {
        "id": "req_002",
        "title": "数据导出功能需求",
        "status": "standardized",
        "createdAt": "2026-05-09T10:15:00.000Z",
        "updatedAt": "2026-05-09T10:30:00.000Z"
      }
    ],
    "pageNo": 1,
    "pageSize": 20,
    "total": 2
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 1.3 获取需求详情

获取单个需求的完整信息，包含标准化文档、拆分结果等。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/requirements/{id}` |
| Method | `GET` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 需求ID |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.id | string | 需求ID |
| data.title | string | 需求标题 |
| data.inputMode | string | 输入模式 |
| data.rawContent | string | 原始需求内容 |
| data.fileInfo | object | 上传文件信息（inputMode=file 时有值） |
| data.fileInfo.fileName | string | 原始文件名 |
| data.fileInfo.fileSize | number | 文件大小（字节） |
| data.fileInfo.fileType | string | 文件类型 |
| data.standardizedContent | string | 标准化后的文档内容（Markdown） |
| data.splitRequirements | array | 拆分后的需求列表 |
| data.splitRequirements[].id | string | 拆分项ID |
| data.splitRequirements[].content | string | 拆分项内容 |
| data.splitRequirements[].order | number | 排序序号 |
| data.status | string | 状态 |
| data.createdAt | string | 创建时间 |
| data.updatedAt | string | 更新时间 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": "req_001",
    "title": "用户登录系统需求",
    "inputMode": "text",
    "rawContent": "实现用户登录功能，支持用户名密码验证，登录成功后跳转到首页。",
    "fileInfo": null,
    "standardizedContent": "# 用户登录系统需求规格说明书\n\n## 1. 引言\n...",
    "splitRequirements": [
      { "id": "split_001", "content": "实现用户名密码登录功能", "order": 1 },
      { "id": "split_002", "content": "实现密码复杂度校验", "order": 2 },
      { "id": "split_003", "content": "实现登录失败锁定机制", "order": 3 }
    ],
    "status": "splitted",
    "createdAt": "2026-05-10T14:30:00.000Z",
    "updatedAt": "2026-05-10T15:00:00.000Z"
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 1.4 更新需求

更新需求的基本信息或标准化文档内容。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/requirements/{id}` |
| Method | `PUT` |
| Content-Type | `application/json` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 需求ID |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | string | 否 | 需求标题 |
| rawContent | string | 否 | 原始需求内容 |
| standardizedContent | string | 否 | 标准化文档内容（用户手动编辑后保存） |
| status | string | 否 | 状态更新 |

**请求示例**

```json
{
  "title": "用户登录系统需求（修订版）",
  "standardizedContent": "# 用户登录系统需求规格说明书\n\n## 1. 引言\n..."
}
```

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "req_001",
    "title": "用户登录系统需求（修订版）",
    "updatedAt": "2026-05-11T11:00:00.000Z"
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 1.5 删除需求

删除指定需求及其关联的所有数据（标准化文档、拆分结果、对话记录、版本记录）。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/requirements/{id}` |
| Method | `DELETE` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 需求ID |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "删除成功",
  "data": null,
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

## 2. 文件上传

### 2.1 上传需求文档

上传 docx/xlsx 格式的需求文档，返回文件ID供创建需求时引用。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/upload` |
| Method | `POST` |
| Content-Type | `multipart/form-data` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | File | 是 | 需求文档文件 |
| type | string | 是 | 文件用途类型：`requirement` |

**文件限制**

| 限制项 | 值 |
|--------|-----|
| 允许格式 | .docx, .xlsx |
| 最大大小 | 10MB |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.fileId | string | 文件唯一标识 |
| data.fileName | string | 原始文件名 |
| data.fileSize | number | 文件大小（字节） |
| data.fileType | string | 文件MIME类型 |
| data.uploadedAt | string | 上传时间 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "上传成功",
  "data": {
    "fileId": "file_001",
    "fileName": "用户登录需求文档.docx",
    "fileSize": 25600,
    "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "uploadedAt": "2026-05-11T10:00:00.000Z"
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

## 3. 文档标准化

### 3.1 执行标准化

调用大模型将原始需求转换为符合 IEEE 830 标准的 Markdown 文档。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/standardize` |
| Method | `POST` |
| Content-Type | `application/json` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| requirementId | string | 是 | 需求ID |
| inputMode | string | 是 | 输入模式：`text` / `file` |
| rawContent | string | 否 | 原始需求文本（inputMode=text 时必填） |
| fileId | string | 否 | 上传文件ID（inputMode=file 时必填） |

**请求示例**

```json
{
  "requirementId": "req_001",
  "inputMode": "text",
  "rawContent": "实现用户登录功能，支持用户名密码验证，登录成功后跳转到首页。"
}
```

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.requirementId | string | 需求ID |
| data.standardizedContent | string | 标准化后的 Markdown 文档内容 |
| data.versionId | string | 初始版本ID |
| data.versionNumber | number | 版本号（初始为 1） |
| data.completedAt | string | 标准化完成时间 |

**标准化文档模板结构**

生成的文档包含以下固定章节（基于 IEEE 830）：

```
# <需求标题>需求规格说明书

## 1. 引言
### 1.1 编写目的
### 1.2 项目背景
### 1.3 术语定义

## 2. 需求概述
### 2.1 业务目标
### 2.2 用户角色
### 2.3 核心业务流程

## 3. 功能需求
### 3.1 功能模块一
### 3.2 功能模块二

## 4. 非功能需求
### 4.1 性能需求
### 4.2 安全性需求
### 4.3 可用性需求
### 4.4 兼容性需求

## 5. 约束条件
### 5.1 技术约束
### 5.2 业务约束
### 5.3 法规约束

## 6. 异常场景处理
### 6.1 异常场景一
### 6.2 异常场景二
```

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "标准化完成",
  "data": {
    "requirementId": "req_001",
    "standardizedContent": "# 用户登录系统需求规格说明书\n\n## 1. 引言\n### 1.1 编写目的\n...",
    "versionId": "ver_001",
    "versionNumber": 1,
    "completedAt": "2026-05-11T10:00:05.000Z"
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 3.2 获取标准化结果

获取需求当前的标准化文档内容。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/standardize/{requirementId}` |
| Method | `GET` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| requirementId | string | 是 | 需求ID |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.requirementId | string | 需求ID |
| data.standardizedContent | string | 标准化文档内容 |
| data.currentVersionId | string | 当前版本ID |
| data.currentVersionNumber | number | 当前版本号 |
| data.updatedAt | string | 最后更新时间 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "查询成功",
  "data": {
    "requirementId": "req_001",
    "standardizedContent": "# 用户登录系统需求规格说明书\n\n## 1. 引言\n...",
    "currentVersionId": "ver_003",
    "currentVersionNumber": 3,
    "updatedAt": "2026-05-11T10:30:00.000Z"
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

## 4. AI头脑风暴

### 4.1 发送对话消息

向AI发送对话消息，AI以头脑风暴模式回复。AI会提出建议但不会直接修改文档，需用户确认后才生效。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/standardize/chat` |
| Method | `POST` |
| Content-Type | `application/json` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| requirementId | string | 是 | 需求ID |
| message | string | 是 | 用户发送的消息内容 |
| currentContent | string | 是 | 当前标准化文档内容（用于AI上下文理解） |
| context | object | 否 | 额外上下文信息 |
| context.quickTopic | string | 否 | 快捷话题标识（如 `security`、`performance`、`exception`） |

**请求示例**

```json
{
  "requirementId": "req_001",
  "message": "请帮我完善安全性相关的需求",
  "currentContent": "# 用户登录系统需求规格说明书\n\n## 1. 引言\n...",
  "context": {
    "quickTopic": "security"
  }
}
```

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.messageId | string | 消息ID |
| data.role | string | 角色：`assistant` |
| data.content | string | AI回复的文本内容 |
| data.type | string | 消息类型：`proposal`（建议）/ `discussion`（讨论）/ `clarification`（澄清） |
| data.proposal | object | 建议详情（type=proposal 时有值） |
| data.proposal.pendingContent | string | 建议修改后的完整文档内容（预览用） |
| data.proposal.changeSummary | string | 变更摘要描述 |
| data.createdAt | string | 消息创建时间 |

**响应示例（建议类型）**

```json
{
  "success": true,
  "code": 200,
  "message": "success",
  "data": {
    "messageId": "msg_005",
    "role": "assistant",
    "content": "我建议在非功能需求中增加以下安全性要求：\n\n- 密码加密存储（bcrypt）\n- 登录失败锁定机制\n- 敏感操作日志审计\n- 数据传输使用 HTTPS\n\n这些是否符合您的实际业务场景？如果有不需要的可以告诉我。",
    "type": "proposal",
    "proposal": {
      "pendingContent": "# 用户登录系统需求规格说明书\n\n...\n\n## 5. 安全性需求\n- 密码加密存储（bcrypt）\n- 登录失败锁定机制\n- 敏感操作日志审计\n- 数据传输使用 HTTPS",
      "changeSummary": "新增「安全性需求」章节，包含4条安全要求"
    },
    "createdAt": "2026-05-11T10:15:00.000Z"
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**响应示例（讨论类型）**

```json
{
  "success": true,
  "code": 200,
  "message": "success",
  "data": {
    "messageId": "msg_006",
    "role": "assistant",
    "content": "好的，我理解您的需求。让我分析一下当前文档，看看哪些地方可以优化。您能具体说说希望调整的方向吗？比如安全性、性能、异常处理等方面？",
    "type": "discussion",
    "proposal": null,
    "createdAt": "2026-05-11T10:16:00.000Z"
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 4.2 获取对话历史

获取指定需求的AI头脑风暴对话历史记录。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/standardize/chat/{requirementId}` |
| Method | `GET` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| requirementId | string | 是 | 需求ID |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.messages | array | 对话消息列表 |
| data.messages[].messageId | string | 消息ID |
| data.messages[].role | string | 角色：`user` / `assistant` |
| data.messages[].content | string | 消息内容 |
| data.messages[].type | string | 消息类型（仅 assistant） |
| data.messages[].proposal | object | 建议详情（仅 proposal 类型） |
| data.messages[].confirmed | boolean | 用户是否已采纳（仅 proposal 类型） |
| data.messages[].rejected | boolean | 用户是否已拒绝（仅 proposal 类型） |
| data.messages[].createdAt | string | 消息时间 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "查询成功",
  "data": {
    "messages": [
      {
        "messageId": "msg_001",
        "role": "user",
        "content": "请帮我完善安全性相关的需求",
        "createdAt": "2026-05-11T10:14:00.000Z"
      },
      {
        "messageId": "msg_002",
        "role": "assistant",
        "content": "我建议在非功能需求中增加以下安全性要求...",
        "type": "proposal",
        "proposal": {
          "pendingContent": "# 用户登录系统需求规格说明书\n\n...",
          "changeSummary": "新增「安全性需求」章节"
        },
        "confirmed": true,
        "rejected": false,
        "createdAt": "2026-05-11T10:15:00.000Z"
      }
    ]
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 4.3 采纳AI建议

用户确认采纳AI的建议，将建议内容应用到标准化文档，并生成新版本。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/standardize/chat/{messageId}/confirm` |
| Method | `POST` |
| Content-Type | `application/json` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| messageId | string | 是 | AI建议消息ID |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| requirementId | string | 是 | 需求ID |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.requirementId | string | 需求ID |
| data.newContent | string | 采纳后的最新文档内容 |
| data.newVersionId | string | 新生成的版本ID |
| data.newVersionNumber | number | 新版本号 |
| data.changeSummary | string | 变更摘要 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "已采纳AI建议",
  "data": {
    "requirementId": "req_001",
    "newContent": "# 用户登录系统需求规格说明书\n\n...\n\n## 5. 安全性需求\n- 密码加密存储（bcrypt）\n...",
    "newVersionId": "ver_002",
    "newVersionNumber": 2,
    "changeSummary": "新增「安全性需求」章节，包含4条安全要求"
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 4.4 拒绝AI建议

用户拒绝AI的建议，不修改文档。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/standardize/chat/{messageId}/reject` |
| Method | `POST` |
| Content-Type | `application/json` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| messageId | string | 是 | AI建议消息ID |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| requirementId | string | 是 | 需求ID |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "已拒绝AI建议",
  "data": null,
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

## 5. 版本管理

### 5.1 获取版本列表

获取指定需求标准化文档的所有历史版本。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/standardize/versions/{requirementId}` |
| Method | `GET` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| requirementId | string | 是 | 需求ID |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.versions | array | 版本列表，按版本号倒序 |
| data.versions[].versionId | string | 版本ID |
| data.versions[].versionNumber | number | 版本号 |
| data.versions[].description | string | 版本描述（如"初始版本"、"采纳AI建议"、"恢复自版本2"） |
| data.versions[].createdAt | string | 版本创建时间 |
| data.currentVersionId | string | 当前生效版本ID |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "查询成功",
  "data": {
    "versions": [
      {
        "versionId": "ver_003",
        "versionNumber": 3,
        "description": "采纳AI建议：新增异常场景处理",
        "createdAt": "2026-05-11T10:30:00.000Z"
      },
      {
        "versionId": "ver_002",
        "versionNumber": 2,
        "description": "采纳AI建议：新增安全性需求",
        "createdAt": "2026-05-11T10:15:00.000Z"
      },
      {
        "versionId": "ver_001",
        "versionNumber": 1,
        "description": "初始版本",
        "createdAt": "2026-05-11T10:00:05.000Z"
      }
    ],
    "currentVersionId": "ver_003"
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 5.2 获取版本详情

获取指定版本的完整文档内容。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/standardize/versions/{requirementId}/{versionId}` |
| Method | `GET` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| requirementId | string | 是 | 需求ID |
| versionId | string | 是 | 版本ID |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.versionId | string | 版本ID |
| data.versionNumber | number | 版本号 |
| data.content | string | 该版本的完整文档内容 |
| data.description | string | 版本描述 |
| data.createdAt | string | 创建时间 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "查询成功",
  "data": {
    "versionId": "ver_002",
    "versionNumber": 2,
    "content": "# 用户登录系统需求规格说明书\n\n...\n\n## 5. 安全性需求\n- 密码加密存储（bcrypt）\n...",
    "description": "采纳AI建议：新增安全性需求",
    "createdAt": "2026-05-11T10:15:00.000Z"
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 5.3 恢复版本

将指定历史版本恢复为当前生效版本，同时生成一条新的版本记录（标记为恢复操作）。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/standardize/versions/{requirementId}/{versionId}/restore` |
| Method | `POST` |
| Content-Type | `application/json` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| requirementId | string | 是 | 需求ID |
| versionId | string | 是 | 要恢复的版本ID |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.newVersionId | string | 恢复操作生成的新版本ID |
| data.newVersionNumber | number | 新版本号 |
| data.content | string | 恢复后的文档内容 |
| data.description | string | 版本描述（如"恢复自版本 2"） |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "版本恢复成功",
  "data": {
    "newVersionId": "ver_004",
    "newVersionNumber": 4,
    "content": "# 用户登录系统需求规格说明书\n\n...",
    "description": "恢复自版本 2"
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 5.4 获取版本差异

获取两个版本之间的文档差异（逐行对比）。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/standardize/versions/{requirementId}/diff` |
| Method | `GET` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| requirementId | string | 是 | 需求ID |

**请求参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| fromVersionId | string | 是 | 对比基准版本ID |
| toVersionId | string | 是 | 对比目标版本ID |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.fromVersionId | string | 基准版本ID |
| data.toVersionId | string | 目标版本ID |
| data.diffLines | array | 逐行差异列表 |
| data.diffLines[].lineNumber | number | 行号 |
| data.diffLines[].text | string | 行文本内容 |
| data.diffLines[].type | string | 差异类型：`unchanged`（无变化）/ `added`（新增）/ `modified`（修改）/ `removed`（删除） |
| data.summary | object | 差异统计 |
| data.summary.addedCount | number | 新增行数 |
| data.summary.modifiedCount | number | 修改行数 |
| data.summary.removedCount | number | 删除行数 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "查询成功",
  "data": {
    "fromVersionId": "ver_001",
    "toVersionId": "ver_002",
    "diffLines": [
      { "lineNumber": 1, "text": "# 用户登录系统需求规格说明书", "type": "unchanged" },
      { "lineNumber": 2, "text": "", "type": "unchanged" },
      { "lineNumber": 45, "text": "## 5. 安全性需求", "type": "added" },
      { "lineNumber": 46, "text": "- 密码加密存储（bcrypt）", "type": "added" },
      { "lineNumber": 47, "text": "- 登录失败锁定机制", "type": "added" },
      { "lineNumber": 48, "text": "- 敏感操作日志审计", "type": "added" },
      { "lineNumber": 49, "text": "- 数据传输使用 HTTPS", "type": "added" }
    ],
    "summary": {
      "addedCount": 5,
      "modifiedCount": 0,
      "removedCount": 0
    }
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

## 6. 质量评分

### 6.1 执行质量评分

对标准化文档进行三维度质量评估（完整性、清晰度、一致性）。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/standardize/quality` |
| Method | `POST` |
| Content-Type | `application/json` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| requirementId | string | 是 | 需求ID |
| content | string | 是 | 待评分的标准化文档内容（Markdown） |

**请求示例**

```json
{
  "requirementId": "req_001",
  "content": "# 用户登录系统需求规格说明书\n\n## 1. 引言\n..."
}
```

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.overall | number | 综合评分（0-100） |
| data.level | string | 评分等级：`good`（≥80）/ `medium`（60-79）/ `poor`（<60）/ `empty`（文档为空） |
| data.completeness | object | 完整性维度（权重 45%） |
| data.completeness.score | number | 完整性得分 |
| data.completeness.details | array | 各章节检查详情 |
| data.completeness.details[].section | string | 章节名称 |
| data.completeness.details[].ok | boolean | 是否通过 |
| data.completeness.details[].suggestion | string | 改进建议（未通过时有值） |
| data.clarity | object | 清晰度维度（权重 35%） |
| data.clarity.score | number | 清晰度得分 |
| data.clarity.issues | array | 清晰度问题列表 |
| data.consistency | object | 一致性维度（权重 20%） |
| data.consistency.score | number | 一致性得分 |
| data.consistency.issues | array | 一致性问题列表 |
| data.suggestions | array | 综合改进建议列表（最多5条） |

**评分维度说明**

| 维度 | 权重 | 检测内容 |
|------|------|----------|
| 完整性 | 45% | 检查6个必填章节（引言、需求概述、功能需求、非功能需求、约束条件、异常场景）是否有实质内容 |
| 清晰度 | 35% | 检测模糊词汇（大概/可能/差不多等）、是否有量化指标、是否有示例 |
| 一致性 | 20% | 检测术语混用（登录/登陆、账号/帐号）、矛盾描述 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "评分完成",
  "data": {
    "overall": 72,
    "level": "medium",
    "completeness": {
      "score": 65,
      "details": [
        { "section": "引言", "ok": true },
        { "section": "需求概述", "ok": true },
        { "section": "功能需求", "ok": true },
        { "section": "非功能需求", "ok": true },
        { "section": "约束条件", "ok": false, "suggestion": "「约束条件」章节内容为空或仅有占位提示，建议补充具体内容" },
        { "section": "异常场景处理", "ok": false, "suggestion": "「异常场景处理」章节内容为空或仅有占位提示，建议补充具体内容" }
      ]
    },
    "clarity": {
      "score": 80,
      "issues": [
        "未发现明确的量化指标，建议补充具体的性能、容量等数值指标"
      ]
    },
    "consistency": {
      "score": 90,
      "issues": []
    },
    "suggestions": [
      "「约束条件」章节内容为空或仅有占位提示，建议补充具体内容",
      "「异常场景处理」章节内容为空或仅有占位提示，建议补充具体内容",
      "未发现明确的量化指标，建议补充具体的性能、容量等数值指标"
    ]
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

## 7. 需求拆分

### 7.1 执行需求拆分

调用AI将标准化文档拆分为单个需求项。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/requirements/{id}/split` |
| Method | `POST` |
| Content-Type | `application/json` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 需求ID |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| standardizedContent | string | 是 | 标准化文档内容（用于AI分析拆分） |

**请求示例**

```json
{
  "standardizedContent": "# 用户登录系统需求规格说明书\n\n## 1. 引言\n..."
}
```

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.requirementId | string | 需求ID |
| data.splits | array | 拆分结果列表 |
| data.splits[].id | string | 拆分项ID |
| data.splits[].content | string | 拆分项内容 |
| data.splits[].order | number | 排序序号 |
| data.totalCount | number | 拆分总数 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "拆分完成",
  "data": {
    "requirementId": "req_001",
    "splits": [
      { "id": "split_001", "content": "实现用户名密码登录功能", "order": 1 },
      { "id": "split_002", "content": "实现密码复杂度校验", "order": 2 },
      { "id": "split_003", "content": "实现登录失败锁定机制", "order": 3 }
    ],
    "totalCount": 3
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 7.2 获取拆分结果列表

获取指定需求的拆分结果列表。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/requirements/{id}/splits` |
| Method | `GET` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 需求ID |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.splits | array | 拆分结果列表 |
| data.splits[].id | string | 拆分项ID |
| data.splits[].content | string | 拆分项内容 |
| data.splits[].order | number | 排序序号 |
| data.splits[].createdAt | string | 创建时间 |
| data.splits[].updatedAt | string | 更新时间 |
| data.totalCount | number | 总数 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "查询成功",
  "data": {
    "splits": [
      { "id": "split_001", "content": "实现用户名密码登录功能", "order": 1, "createdAt": "2026-05-11T10:35:00.000Z", "updatedAt": "2026-05-11T10:35:00.000Z" },
      { "id": "split_002", "content": "实现密码复杂度校验", "order": 2, "createdAt": "2026-05-11T10:35:00.000Z", "updatedAt": "2026-05-11T10:35:00.000Z" },
      { "id": "split_003", "content": "实现登录失败锁定机制", "order": 3, "createdAt": "2026-05-11T10:35:00.000Z", "updatedAt": "2026-05-11T10:35:00.000Z" }
    ],
    "totalCount": 3
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 7.3 更新拆分项

编辑单个拆分项的内容。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/requirements/{id}/splits/{splitId}` |
| Method | `PUT` |
| Content-Type | `application/json` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 需求ID |
| splitId | string | 是 | 拆分项ID |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| content | string | 是 | 拆分项内容 |
| order | number | 否 | 排序序号 |

**请求示例**

```json
{
  "content": "实现用户名密码登录功能（含记住密码）"
}
```

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "split_001",
    "content": "实现用户名密码登录功能（含记住密码）",
    "order": 1,
    "updatedAt": "2026-05-11T11:00:00.000Z"
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 7.4 删除拆分项

删除指定的拆分项。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/requirements/{id}/splits/{splitId}` |
| Method | `DELETE` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 需求ID |
| splitId | string | 是 | 拆分项ID |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "删除成功",
  "data": null,
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 7.5 手动添加拆分项

用户手动添加一条新的拆分需求。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/requirements/{id}/splits` |
| Method | `POST` |
| Content-Type | `application/json` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 需求ID |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| content | string | 是 | 拆分项内容 |
| order | number | 否 | 排序序号（不传则自动追加到末尾） |

**请求示例**

```json
{
  "content": "实现登录日志记录功能"
}
```

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.id | string | 新拆分项ID |
| data.content | string | 拆分项内容 |
| data.order | number | 排序序号 |
| data.createdAt | string | 创建时间 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "添加成功",
  "data": {
    "id": "split_004",
    "content": "实现登录日志记录功能",
    "order": 4,
    "createdAt": "2026-05-11T11:05:00.000Z"
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

## 8. 文档导出

### 8.1 导出标准化文档

将标准化文档导出为指定格式的文件。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/requirements/{id}/export` |
| Method | `GET` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 需求ID |

**请求参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| format | string | 是 | 导出格式：`markdown` / `docx` |

**响应说明**

| 格式 | Content-Type | 说明 |
|------|-------------|------|
| markdown | `text/markdown; charset=utf-8` | 直接返回 Markdown 文本内容 |
| docx | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | 返回二进制文件流 |

**响应头**

```
Content-Disposition: attachment; filename="需求规格说明书_2026-05-11.md"
```

或

```
Content-Disposition: attachment; filename="需求规格说明书_2026-05-11.docx"
```

**DOCX 导出样式规范**

| Markdown 语法 | DOCX 样式 |
|---------------|-----------|
| `# 标题` | Heading 1（36pt 加粗，段前360twips，段后120twips） |
| `## 标题` | Heading 2（28pt 加粗，段前280twips，段后120twips） |
| `### 标题` | Heading 3（24pt 加粗，段前240twips，段后120twips） |
| `> 引用` | 斜体灰色（#666666），左缩进720twips |
| 空行 | 段落间距80twips |
| 普通文本 | 22pt 正文，段前段后60twips |

---

## 9. 历史记录

### 9.1 获取历史记录列表

获取当前用户的需求历史记录列表（左侧边栏展示）。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/history` |
| Method | `GET` |

**请求参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pageNo | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页条数，默认 20 |
| keyword | string | 否 | 搜索关键词，匹配标题 |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.items | array | 历史记录列表 |
| data.items[].id | string | 需求ID |
| data.items[].title | string | 需求标题 |
| data.items[].status | string | 状态 |
| data.items[].updatedAt | string | 最后更新时间 |
| data.pageNo | number | 当前页码 |
| data.pageSize | number | 每页条数 |
| data.total | number | 总条数 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "查询成功",
  "data": {
    "items": [
      { "id": "req_001", "title": "用户登录系统需求", "status": "splitted", "updatedAt": "2026-05-10T15:00:00.000Z" },
      { "id": "req_002", "title": "数据导出功能需求", "status": "standardized", "updatedAt": "2026-05-09T10:30:00.000Z" },
      { "id": "req_003", "title": "权限管理系统需求", "status": "draft", "updatedAt": "2026-05-08T16:45:00.000Z" }
    ],
    "pageNo": 1,
    "pageSize": 20,
    "total": 3
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 9.2 获取历史记录详情

获取某条历史记录的完整数据，用于加载到当前工作区。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/history/{id}` |
| Method | `GET` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 需求ID |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.id | string | 需求ID |
| data.title | string | 需求标题 |
| data.inputMode | string | 输入模式 |
| data.rawContent | string | 原始需求内容 |
| data.fileInfo | object | 上传文件信息 |
| data.standardizedContent | string | 标准化文档内容 |
| data.splitRequirements | array | 拆分需求列表 |
| data.testPoints | array | 测试点列表（后续模块数据） |
| data.testCases | array | 测试用例列表（后续模块数据） |
| data.status | string | 状态 |
| data.createdAt | string | 创建时间 |
| data.updatedAt | string | 更新时间 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": "req_001",
    "title": "用户登录系统需求",
    "inputMode": "text",
    "rawContent": "实现用户登录功能，支持用户名密码验证，登录成功后跳转到首页。",
    "fileInfo": null,
    "standardizedContent": "# 用户登录系统需求规格说明书\n\n## 1. 引言\n...",
    "splitRequirements": [
      { "id": "split_001", "content": "实现用户名密码登录功能", "order": 1 },
      { "id": "split_002", "content": "实现密码复杂度校验", "order": 2 },
      { "id": "split_003", "content": "实现登录失败锁定机制", "order": 3 }
    ],
    "testPoints": [],
    "testCases": [],
    "status": "splitted",
    "createdAt": "2026-05-10T14:30:00.000Z",
    "updatedAt": "2026-05-10T15:00:00.000Z"
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

## 10. 错误码说明

### 通用错误码

| 状态码 | code | 说明 |
|--------|------|------|
| 400 | 400 | 请求参数错误 |
| 401 | 401 | 未登录或 Token 过期 |
| 403 | 403 | 无权限访问该资源 |
| 404 | 404 | 资源不存在 |
| 413 | 413 | 上传文件大小超过限制 |
| 415 | 415 | 不支持的文件格式 |
| 429 | 429 | 请求过于频繁 |
| 500 | 500 | 服务器内部错误 |
| 502 | 502 | AI 服务调用失败 |
| 503 | 503 | AI 服务暂时不可用 |

### 业务错误码

| code | 说明 |
|------|------|
| 10001 | 需求不存在 |
| 10002 | 需求状态不允许此操作 |
| 10003 | 标准化文档内容为空 |
| 10004 | AI 标准化处理失败 |
| 10005 | AI 对话生成失败 |
| 10006 | 版本不存在 |
| 10007 | 版本恢复失败 |
| 10008 | 质量评分为空（文档无内容） |
| 10009 | 需求拆分失败 |
| 10010 | 拆分项不存在 |
| 10011 | 导出格式不支持 |
| 10012 | 文件上传失败 |
| 10013 | 文件解析失败 |

### 错误响应示例

```json
{
  "success": false,
  "code": 10001,
  "message": "需求不存在",
  "data": null,
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

## 附录：接口汇总表

| 序号 | 接口 | 方法 | URL | 说明 |
|------|------|------|-----|------|
| 1 | 创建需求 | POST | `/api/v1/requirements` | 录入新需求 |
| 2 | 需求列表 | GET | `/api/v1/requirements` | 获取需求列表 |
| 3 | 需求详情 | GET | `/api/v1/requirements/{id}` | 获取需求完整信息 |
| 4 | 更新需求 | PUT | `/api/v1/requirements/{id}` | 更新需求信息 |
| 5 | 删除需求 | DELETE | `/api/v1/requirements/{id}` | 删除需求及关联数据 |
| 6 | 上传文档 | POST | `/api/v1/upload` | 上传需求文档文件 |
| 7 | 执行标准化 | POST | `/api/v1/standardize` | AI生成标准文档 |
| 8 | 获取标准化结果 | GET | `/api/v1/standardize/{requirementId}` | 获取当前标准化文档 |
| 9 | 发送对话消息 | POST | `/api/v1/standardize/chat` | AI头脑风暴对话 |
| 10 | 获取对话历史 | GET | `/api/v1/standardize/chat/{requirementId}` | 获取对话记录 |
| 11 | 采纳AI建议 | POST | `/api/v1/standardize/chat/{messageId}/confirm` | 确认采纳建议 |
| 12 | 拒绝AI建议 | POST | `/api/v1/standardize/chat/{messageId}/reject` | 拒绝AI建议 |
| 13 | 版本列表 | GET | `/api/v1/standardize/versions/{requirementId}` | 获取所有版本 |
| 14 | 版本详情 | GET | `/api/v1/standardize/versions/{requirementId}/{versionId}` | 获取版本内容 |
| 15 | 恢复版本 | POST | `/api/v1/standardize/versions/{requirementId}/{versionId}/restore` | 恢复历史版本 |
| 16 | 版本差异 | GET | `/api/v1/standardize/versions/{requirementId}/diff` | 获取版本间差异 |
| 17 | 质量评分 | POST | `/api/v1/standardize/quality` | 文档质量评估 |
| 18 | 执行拆分 | POST | `/api/v1/requirements/{id}/split` | AI拆分需求 |
| 19 | 拆分列表 | GET | `/api/v1/requirements/{id}/splits` | 获取拆分结果 |
| 20 | 更新拆分项 | PUT | `/api/v1/requirements/{id}/splits/{splitId}` | 编辑拆分项 |
| 21 | 删除拆分项 | DELETE | `/api/v1/requirements/{id}/splits/{splitId}` | 删除拆分项 |
| 22 | 添加拆分项 | POST | `/api/v1/requirements/{id}/splits` | 手动添加拆分项 |
| 23 | 导出文档 | GET | `/api/v1/requirements/{id}/export` | 导出Markdown/DOCX |
| 24 | 历史列表 | GET | `/api/v1/history` | 获取历史记录列表 |
| 25 | 历史详情 | GET | `/api/v1/history/{id}` | 获取历史记录详情 |

---

**文档版本**：v1.0
**创建日期**：2026-05-11
**适用范围**：需求标准化模块 - 后端开发接口参考