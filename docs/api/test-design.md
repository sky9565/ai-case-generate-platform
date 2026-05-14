# 测试设计模块接口文档

## 概述

本文档描述智能测试用例平台「测试设计」模块的接口规范，涵盖需求列表查询、脑图数据获取、测试点管理、测试用例管理、AI调整、异步任务管理、导出等全部功能。

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

- [1. 需求列表](#1-需求列表)
  - [1.1 获取需求列表](#11-获取需求列表)
  - [1.2 搜索需求](#12-搜索需求)
- [2. 脑图数据](#2-脑图数据)
  - [2.1 获取脑图数据](#21-获取脑图数据)
- [3. 测试点管理](#3-测试点管理)
  - [3.1 添加测试点](#31-添加测试点)
  - [3.2 编辑测试点](#32-编辑测试点)
  - [3.3 删除测试点](#33-删除测试点)
  - [3.4 批量删除测试点](#34-批量删除测试点)
  - [3.5 标记保留测试点](#35-标记保留测试点)
- [4. 测试用例管理](#4-测试用例管理)
  - [4.1 添加测试用例](#41-添加测试用例)
  - [4.2 编辑测试用例](#42-编辑测试用例)
  - [4.3 删除测试用例](#43-删除测试用例)
  - [4.4 批量删除测试用例](#44-批量删除测试用例)
- [5. AI调整](#5-ai调整)
  - [5.1 发起AI调整对话](#51-发起ai调整对话)
  - [5.2 发送对话消息](#52-发送对话消息)
  - [5.3 获取对话历史](#53-获取对话历史)
- [6. 异步任务管理](#6-异步任务管理)
  - [6.1 快速生成](#61-快速生成)
  - [6.2 获取任务状态](#62-获取任务状态)
  - [6.3 取消任务](#63-取消任务)
- [7. 导出](#7-导出)
  - [7.1 导出Excel](#71-导出excel)
- [8. 错误码说明](#8-错误码说明)

---

## 1. 需求列表

### 1.1 获取需求列表

获取当前用户所有已拆分的需求列表，用于测试设计模块左侧面板展示。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/requirements` |
| Method | `GET` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | integer | 否 | 页码，默认 1 |
| pageSize | integer | 否 | 每页条数，默认 20 |
| status | string | 否 | 状态筛选：`pending`（待生成）/ `generating`（生成中）/ `completed`（已完成） |
| keyword | string | 否 | 搜索关键词，匹配需求标题 |

**请求示例**

```
GET /api/v1/test-design/requirements?page=1&pageSize=20&keyword=登录
```

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.list | array | 需求列表 |
| data.list[].id | string | 需求ID |
| data.list[].title | string | 需求标题 |
| data.list[].status | string | 状态：`pending` / `generating` / `completed` |
| data.list[].statusText | string | 状态中文描述 |
| data.list[].date | string | 创建/更新时间 |
| data.list[].testPointCount | integer | 测试点数量 |
| data.list[].caseCount | integer | 测试用例数量 |
| data.list[].source | string | 来源：`standardization`（标准化模块） |
| data.total | integer | 总条数 |
| data.page | integer | 当前页码 |
| data.pageSize | integer | 每页条数 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {
    "list": [
      {
        "id": "req-1",
        "title": "用户登录系统需求",
        "status": "completed",
        "statusText": "已完成",
        "date": "2026-05-12 14:30",
        "testPointCount": 3,
        "caseCount": 5,
        "source": "standardization"
      },
      {
        "id": "req-2",
        "title": "数据导出功能需求",
        "status": "generating",
        "statusText": "生成中",
        "date": "2026-05-12 10:15",
        "testPointCount": 2,
        "caseCount": 3,
        "source": "standardization"
      }
    ],
    "total": 2,
    "page": 1,
    "pageSize": 20
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

### 1.2 搜索需求

搜索需求与获取需求列表共用同一接口，通过 `keyword` 参数实现搜索功能。

---

## 2. 脑图数据

### 2.1 获取脑图数据

根据需求ID获取完整的脑图数据结构（4级：根节点 → 需求 → 测试点 → 测试用例）。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/requirements/{requirementId}/mindmap` |
| Method | `GET` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| requirementId | string | 是 | 需求ID |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data | object | 脑图数据对象，结构同 simple-mind-map 数据格式 |
| data.data | object | 根节点数据 |
| data.data.text | string | 根节点文本 |
| data.data._level | string | 节点层级：`root` |
| data.data._status | string | 状态 |
| data.children | array | 子节点（需求节点） |
| data.children[].data | object | 需求节点数据 |
| data.children[].data.text | string | 需求文本 |
| data.children[].data._level | string | 节点层级：`requirement` |
| data.children[].data._status | string | 状态 |
| data.children[].children | array | 子节点（测试点节点） |
| data.children[].children[].data | object | 测试点节点数据 |
| data.children[].children[].data.text | string | 测试点文本 |
| data.children[].children[].data._level | string | 节点层级：`testPoint` |
| data.children[].children[].data._source | string | 来源：`AI` / `人工` |
| data.children[].children[].data._marked | boolean | 是否标记保留 |
| data.children[].children[].children | array | 子节点（测试用例节点） |
| data.children[].children[].children[].data | object | 测试用例节点数据 |
| data.children[].children[].children[].data.text | string | 用例名称 |
| data.children[].children[].children[].data._caseProperty | string | 用例属性：`正例` / `反例` |
| data.children[].children[].children[].data._source | string | 来源：`AI` / `人工` |
| data.children[].children[].children[].data.note | string | 用例详情（HTML格式） |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {
    "data": {
      "text": "用户登录系统需求",
      "expand": true,
      "_level": "root",
      "_status": "completed"
    },
    "children": [
      {
        "data": {
          "text": "实现用户登录功能，支持用户名密码验证",
          "expand": true,
          "_level": "requirement",
          "_status": "completed"
        },
        "children": [
          {
            "data": {
              "text": "用户名输入验证",
              "expand": true,
              "_level": "testPoint",
              "_status": "completed",
              "_source": "AI",
              "_marked": false
            },
            "children": [
              {
                "data": {
                  "text": "用户正常登录系统",
                  "note": "<div class=\"case-note-popover\">...</div>",
                  "expand": true,
                  "_level": "testCase",
                  "_caseProperty": "正例",
                  "_source": "AI"
                },
                "children": []
              }
            ]
          }
        ]
      }
    ]
  },
  "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

## 3. 测试点管理

### 3.1 添加测试点

在指定需求节点下手动添加测试点。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/requirements/{requirementId}/test-points` |
| Method | `POST` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| requirementNodeId | string | 是 | 需求节点ID |
| text | string | 是 | 测试点文本内容 |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.id | string | 测试点ID |
| data.text | string | 测试点文本 |
| data._source | string | 来源：`人工` |

### 3.2 编辑测试点

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/test-points/{testPointId}` |
| Method | `PUT` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| text | string | 是 | 测试点文本内容 |

### 3.3 删除测试点

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/test-points/{testPointId}` |
| Method | `DELETE` |

### 3.4 批量删除测试点

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/test-points/batch-delete` |
| Method | `POST` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ids | string[] | 是 | 测试点ID列表 |

### 3.5 标记保留测试点

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/test-points/{testPointId}/mark` |
| Method | `PUT` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| marked | boolean | 是 | 是否标记保留 |

---

## 4. 测试用例管理

### 4.1 添加测试用例

在指定测试点下手动添加测试用例。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/test-points/{testPointId}/test-cases` |
| Method | `POST` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| text | string | 是 | 用例名称 |
| caseProperty | string | 是 | 用例属性：`正例` / `反例` |
| preCondition | string | 否 | 前置条件 |
| steps | array | 否 | 测试步骤 |
| steps[].name | string | 是 | 步骤名称 |
| steps[].description | string | 是 | 步骤描述 |
| steps[].stepExpectedResult | string | 是 | 步骤预期结果 |

### 4.2 编辑测试用例

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/test-cases/{testCaseId}` |
| Method | `PUT` |

### 4.3 删除测试用例

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/test-cases/{testCaseId}` |
| Method | `DELETE` |

### 4.4 批量删除测试用例

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/test-cases/batch-delete` |
| Method | `POST` |

---

## 5. AI调整

### 5.1 发起AI调整对话

对指定节点发起AI调整多轮对话。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/ai-adjust/sessions` |
| Method | `POST` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| requirementId | string | 是 | 需求ID |
| nodeId | string | 是 | 节点ID |
| nodeType | string | 是 | 节点类型：`requirement`（需求级，调整测试点）/ `testPoint`（测试点级，调整测试用例） |
| markedNodeIds | string[] | 否 | 标记保留的节点ID列表。当 `nodeType=requirement` 时为标记的测试点ID；当 `nodeType=testPoint` 时为标记的测试用例ID |

**说明**

- 当 `nodeType=requirement` 时，AI调整的层级为：需求 → 测试点，标记保留的为测试点节点
- 当 `nodeType=testPoint` 时，AI调整的层级为：测试点 → 测试用例，标记保留的为测试用例节点

### 5.2 发送对话消息

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/ai-adjust/sessions/{sessionId}/messages` |
| Method | `POST` |

### 5.3 获取对话历史

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/ai-adjust/sessions/{sessionId}/messages` |
| Method | `GET` |

### 5.4 应用AI调整

确认AI调整方案并应用到脑图数据。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/ai-adjust/sessions/{sessionId}/apply` |
| Method | `POST` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| currentMindMapData | object | 是 | 当前脑图完整数据 |
| markedTestPointTexts | string[] | 否 | 标记保留的节点文本列表 |
| nodeType | string | 是 | 节点类型：`requirement` / `testPoint` |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.adjustedMindMapData | object | 调整后的脑图数据 |
| data.addedCount | integer | 新增节点数量 |
| data.removedCount | integer | 移除节点数量 |
| data.preservedCount | integer | 保留标记节点数量 |

---

## 6. 异步任务管理

### 6.1 快速生成

一键触发所有需求的测试点和测试用例生成任务。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/requirements/{requirementId}/generate` |
| Method | `POST` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| useKnowledgeBase | boolean | 否 | 是否启用知识库，默认 false |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.taskId | string | 任务ID |

### 6.2 获取任务状态

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/tasks/{taskId}` |
| Method | `GET` |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.status | string | 任务状态：`pending` / `running` / `completed` / `failed` / `cancelled` |
| data.progress | integer | 进度百分比 0-100 |
| data.progressText | string | 进度描述文本 |
| data.currentNodeId | string | 当前正在处理的节点ID |

### 6.3 取消任务

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/tasks/{taskId}/cancel` |
| Method | `POST` |

---

## 7. 导出

### 7.1 导出Excel

导出当前需求的测试用例为Excel文件。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/test-design/requirements/{requirementId}/export` |
| Method | `GET` |
| Response-Type | `blob` |

---

## 8. 错误码说明

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未登录或Token过期 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如重复操作） |
| 500 | 服务器内部错误 |