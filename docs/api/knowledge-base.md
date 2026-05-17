# 知识库模块接口文档

## 概述

本文档描述智能测试用例平台「知识库」模块的接口规范，涵盖文档上传、文档管理、知识召回设置、召回测试、文档切片查看等全部功能。

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

- [1. 文档管理](#1-文档管理)
  - [1.1 获取文档列表](#11-获取文档列表)
  - [1.2 获取文档详情](#12-获取文档详情)
  - [1.3 上传文档](#13-上传文档)
  - [1.4 删除文档](#14-删除文档)
  - [1.5 重试处理文档](#15-重试处理文档)
  - [1.6 获取文档切片](#16-获取文档切片)
  - [1.7 获取文档内容](#17-获取文档内容)
  - [1.8 获取存储空间信息](#18-获取存储空间信息)
- [2. 文档处理状态](#2-文档处理状态)
  - [2.1 获取文档处理状态](#21-获取文档处理状态)
  - [2.2 批量获取文档状态](#22-批量获取文档状态)
- [3. 知识召回设置](#3-知识召回设置)
  - [3.1 获取召回设置](#31-获取召回设置)
  - [3.2 更新召回设置](#32-更新召回设置)
  - [3.3 触发文档重新处理](#33-触发文档重新处理)
- [4. 召回测试](#4-召回测试)
  - [4.1 执行召回测试](#41-执行召回测试)
  - [4.2 获取召回测试历史](#42-获取召回测试历史)
- [5. 统计信息](#5-统计信息)
  - [5.1 获取文档统计](#51-获取文档统计)
  - [5.2 获取处理状态统计](#52-获取处理状态统计)
- [6. 错误码说明](#6-错误码说明)

---

## 1. 文档管理

### 1.1 获取文档列表

获取当前用户的所有文档列表，支持分页、搜索和筛选。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/documents` |
| Method | `GET` |
| Content-Type | `application/json` |

**查询参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | integer | 否 | 页码，默认 1 |
| pageSize | integer | 否 | 每页数量，默认 20，最大 100 |
| keyword | string | 否 | 搜索关键词，按文件名模糊匹配 |
| format | string | 否 | 文件格式筛选：`docx`、`xlsx`、`pdf`、`txt`、`md`、`all`（全部） |
| status | string | 否 | 处理状态筛选：`uploading`、`slicing`、`vectorizing`、`ready`、`failed`、`all`（全部） |
| sortBy | string | 否 | 排序字段：`uploadTime`（上传时间）、`name`（文件名）、`size`（文件大小），默认 `uploadTime` |
| sortOrder | string | 否 | 排序顺序：`desc`（降序）、`asc`（升序），默认 `desc` |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.total | integer | 文档总数 |
| data.page | integer | 当前页码 |
| data.pageSize | integer | 每页数量 |
| data.documents | array | 文档列表 |
| data.documents[].id | string | 文档ID |
| data.documents[].name | string | 文档名称 |
| data.documents[].format | string | 文件格式：`docx`、`xlsx`、`pdf`、`txt`、`md` |
| data.documents[].size | integer | 文件大小（字节） |
| data.documents[].uploadTime | string | 上传时间，格式：YYYY-MM-DD HH:mm:ss |
| data.documents[].status | string | 处理状态：`uploading`、`slicing`、`vectorizing`、`ready`、`failed` |
| data.documents[].chunkCount | integer | 切片数量（仅当 status=ready 时有效） |
| data.documents[].avgChunkLength | integer | 平均切片长度（字符数，仅当 status=ready 时有效） |
| data.documents[].errorMessage | string | 错误信息（仅当 status=failed 时有效） |
| data.documents[].retryCount | integer | 重试次数（仅当 status=failed 时有效） |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {
    "total": 15,
    "page": 1,
    "pageSize": 20,
    "documents": [
      {
        "id": "doc-1716000000001",
        "name": "测试规范文档.docx",
        "format": "docx",
        "size": 256000,
        "uploadTime": "2024-05-17 14:30:25",
        "status": "ready",
        "chunkCount": 12,
        "avgChunkLength": 486,
        "errorMessage": null,
        "retryCount": 0
      },
      {
        "id": "doc-1716000000002",
        "name": "安全测试指南.pdf",
        "format": "pdf",
        "size": 1024000,
        "uploadTime": "2024-05-17 14:28:10",
        "status": "vectorizing",
        "chunkCount": 0,
        "avgChunkLength": 0,
        "errorMessage": null,
        "retryCount": 0
      }
    ]
  }
}
```

### 1.2 获取文档详情

获取指定文档的详细信息。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/documents/{id}` |
| Method | `GET` |
| Content-Type | `application/json` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 文档ID |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.id | string | 文档ID |
| data.name | string | 文档名称 |
| data.format | string | 文件格式 |
| data.size | integer | 文件大小（字节） |
| data.uploadTime | string | 上传时间 |
| data.status | string | 处理状态 |
| data.chunkCount | integer | 切片数量 |
| data.avgChunkLength | integer | 平均切片长度 |
| data.errorMessage | string | 错误信息 |
| data.retryCount | integer | 重试次数 |
| data.contentPreview | string | 文档内容预览（前500字符） |
| data.metadata | object | 文档元数据 |
| data.metadata.author | string | 作者（如果文档包含此信息） |
| data.metadata.createdAt | string | 创建时间（如果文档包含此信息） |
| data.metadata.modifiedAt | string | 修改时间（如果文档包含此信息） |

### 1.3 上传文档

上传文档到知识库，支持拖拽和点击上传。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/documents/upload` |
| Method | `POST` |
| Content-Type | `multipart/form-data` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | file | 是 | 上传的文件，支持格式：.docx, .xlsx, .pdf, .txt, .md |
| overwrite | boolean | 否 | 是否覆盖同名文件，默认 false |

**请求限制**

| 限制项 | 值 | 错误码 |
|--------|------|--------|
| 单文件大小 | 50MB | 4001 |
| 文档总数上限 | 100个 | 4002 |
| 总存储空间 | 2GB | 4003 |
| 文件格式 | docx/xlsx/pdf/txt/md | 4004 |
| 同名文件（overwrite=false） | 不允许 | 4005 |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.document | object | 新创建的文档信息 |
| data.document.id | string | 文档ID |
| data.document.name | string | 文档名称 |
| data.document.format | string | 文件格式 |
| data.document.size | integer | 文件大小 |
| data.document.uploadTime | string | 上传时间 |
| data.document.status | string | 初始状态：`uploading` |
| data.storageInfo | object | 更新后的存储空间信息 |
| data.storageInfo.usedBytes | integer | 已使用字节数 |
| data.storageInfo.maxBytes | integer | 最大存储字节数（2GB） |
| data.storageInfo.usedPercentage | number | 使用百分比 |
| data.storageInfo.usedText | string | 格式化后的使用量（如 "1.2 GB / 2 GB"） |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "文档上传成功，正在处理中...",
  "data": {
    "document": {
      "id": "doc-1716000000003",
      "name": "性能测试指南.pdf",
      "format": "pdf",
      "size": 786432,
      "uploadTime": "2024-05-17 14:35:42",
      "status": "uploading"
    },
    "storageInfo": {
      "usedBytes": 2064384,
      "maxBytes": 2147483648,
      "usedPercentage": 0.096,
      "usedText": "1.97 GB / 2 GB"
    }
  }
}
```

### 1.4 删除文档

删除指定文档及其相关的切片和向量数据。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/documents/{id}` |
| Method | `DELETE` |
| Content-Type | `application/json` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 文档ID |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| force | boolean | 否 | 是否强制删除处理中的文档，默认 false |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.storageInfo | object | 更新后的存储空间信息 |
| data.storageInfo.usedBytes | integer | 已使用字节数 |
| data.storageInfo.maxBytes | integer | 最大存储字节数 |
| data.storageInfo.usedPercentage | number | 使用百分比 |
| data.storageInfo.usedText | string | 格式化后的使用量 |

### 1.5 重试处理文档

对处理失败的文档进行重试处理。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/documents/{id}/retry` |
| Method | `POST` |
| Content-Type | `application/json` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 文档ID |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| fromStep | string | 否 | 从哪个步骤开始重试：`upload`、`slice`、`vectorize`，默认 `slice` |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.document | object | 更新后的文档信息 |
| data.document.id | string | 文档ID |
| data.document.status | string | 新的处理状态 |
| data.document.retryCount | integer | 更新后的重试次数 |

### 1.6 获取文档切片

获取指定文档的所有切片内容。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/documents/{id}/chunks` |
| Method | `GET` |
| Content-Type | `application/json` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 文档ID |

**查询参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | integer | 否 | 页码，默认 1 |
| pageSize | integer | 否 | 每页数量，默认 20，最大 100 |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.totalChunks | integer | 切片总数 |
| data.avgChunkLength | integer | 平均切片长度 |
| data.chunks | array | 切片列表 |
| data.chunks[].index | integer | 切片序号（从1开始） |
| data.chunks[].content | string | 切片内容 |
| data.chunks[].length | integer | 切片长度（字符数） |
| data.chunks[].vectorId | string | 向量ID（用于召回） |
| data.chunks[].metadata | object | 切片元数据 |
| data.chunks[].metadata.page | integer | 原文档页码（如果可提取） |
| data.chunks[].metadata.section | string | 所属章节标题（如果可提取） |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {
    "totalChunks": 12,
    "avgChunkLength": 486,
    "chunks": [
      {
        "index": 1,
        "content": "本文档描述了测试用例编写的标准规范，包括用例命名规则、步骤编写要求、预期结果定义等。用例命名应遵循\"功能点+操作+预期结果\"的格式，例如\"用户登录-输入正确账号密码-登录成功\"。",
        "length": 156,
        "vectorId": "vec-001",
        "metadata": {
          "page": 1,
          "section": "命名规范"
        }
      }
    ]
  }
}
```

### 1.7 获取文档内容

获取指定文档的完整文本内容。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/documents/{id}/content` |
| Method | `GET` |
| Content-Type | `application/json` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 文档ID |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.content | string | 文档完整文本内容 |
| data.length | integer | 内容长度（字符数） |
| data.encoding | string | 内容编码，默认 `utf-8` |

### 1.8 获取存储空间信息

获取当前用户的存储空间使用情况。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/storage` |
| Method | `GET` |
| Content-Type | `application/json` |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.usedBytes | integer | 已使用字节数 |
| data.maxBytes | integer | 最大存储字节数（2GB） |
| data.usedPercentage | number | 使用百分比 |
| data.usedText | string | 格式化后的使用量（如 "1.2 GB / 2 GB"） |
| data.documentCount | integer | 文档总数 |
| data.availableSpace | integer | 剩余可用字节数 |
| data.warningLevel | string | 警告级别：`normal`、`warning`、`critical` |

---

## 2. 文档处理状态

### 2.1 获取文档处理状态

获取指定文档的当前处理状态。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/documents/{id}/status` |
| Method | `GET` |
| Content-Type | `application/json` |

**路径参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 文档ID |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.status | string | 当前状态：`uploading`、`slicing`、`vectorizing`、`ready`、`failed` |
| data.progress | number | 处理进度（0-100），仅当状态为处理中时有效 |
| data.currentStep | string | 当前处理步骤 |
| data.estimatedTime | integer | 预计剩余时间（秒） |
| data.errorMessage | string | 错误信息（仅当 status=failed 时有效） |
| data.retryCount | integer | 重试次数（仅当 status=failed 时有效） |

### 2.2 批量获取文档状态

批量获取多个文档的处理状态。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/documents/status/batch` |
| Method | `POST` |
| Content-Type | `application/json` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| documentIds | array | 是 | 文档ID数组 |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.statuses | array | 状态信息数组 |
| data.statuses[].documentId | string | 文档ID |
| data.statuses[].status | string | 当前状态 |
| data.statuses[].progress | number | 处理进度 |
| data.statuses[].currentStep | string | 当前处理步骤 |
| data.statuses[].errorMessage | string | 错误信息 |

---

## 3. 知识召回设置

### 3.1 获取召回设置

获取当前用户的知识召回配置。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/recall/settings` |
| Method | `GET` |
| Content-Type | `application/json` |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.enabled | boolean | 知识召回开关是否开启 |
| data.topK | integer | 召回数量（top_k），范围 1-20，默认 5 |
| data.scoreThreshold | number | 相似度阈值，范围 0-1，默认 0.7 |
| data.chunkSize | integer | 切片大小（字符数），范围 100-2000，默认 500 |
| data.chunkOverlap | integer | 切片重叠度（字符数），范围 0-500，默认 50 |
| data.recallStrategy | string | 召回策略：`hybrid`（混合召回）、`vector`（纯向量召回），默认 `hybrid` |
| data.updatedAt | string | 最后更新时间 |
| data.updatedBy | string | 最后更新用户 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {
    "enabled": true,
    "topK": 5,
    "scoreThreshold": 0.7,
    "chunkSize": 500,
    "chunkOverlap": 50,
    "recallStrategy": "hybrid",
    "updatedAt": "2024-05-17 14:30:25",
    "updatedBy": "user123"
  }
}
```

### 3.2 更新召回设置

更新知识召回配置。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/recall/settings` |
| Method | `PUT` |
| Content-Type | `application/json` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| enabled | boolean | 否 | 知识召回开关 |
| topK | integer | 否 | 召回数量，范围 1-20 |
| scoreThreshold | number | 否 | 相似度阈值，范围 0-1 |
| chunkSize | integer | 否 | 切片大小，范围 100-2000 |
| chunkOverlap | integer | 否 | 切片重叠度，范围 0-500 |
| recallStrategy | string | 否 | 召回策略：`hybrid`、`vector` |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.settings | object | 更新后的设置 |
| data.requiresReprocess | boolean | 是否需要重新处理文档（当切片参数变更时） |
| data.reprocessDocuments | integer | 需要重新处理的文档数量 |

**特殊处理**：
- 当 `chunkSize` 或 `chunkOverlap` 参数变更时，返回 `requiresReprocess: true`
- 前端需要弹出确认对话框，用户确认后调用重新处理接口

### 3.3 触发文档重新处理

当切片参数变更后，触发所有已就绪文档的重新处理。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/documents/reprocess` |
| Method | `POST` |
| Content-Type | `application/json` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| chunkSize | integer | 是 | 新的切片大小 |
| chunkOverlap | integer | 是 | 新的切片重叠度 |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.totalDocuments | integer | 需要重新处理的文档总数 |
| data.processingDocuments | array | 正在处理的文档ID数组 |
| data.estimatedTime | integer | 预计总处理时间（秒） |

---

## 4. 召回测试

### 4.1 执行召回测试

使用当前知识库配置进行召回测试。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/recall/test` |
| Method | `POST` |
| Content-Type | `application/json` |

**请求参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| query | string | 是 | 测试查询文本 |
| topK | integer | 否 | 召回数量，默认使用当前设置 |
| scoreThreshold | number | 否 | 相似度阈值，默认使用当前设置 |
| recallStrategy | string | 否 | 召回策略，默认使用当前设置 |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.query | string | 查询文本 |
| data.results | array | 召回结果 |
| data.results[].index | integer | 结果序号 |
| data.results[].score | number | 相似度分数（0-1） |
| data.results[].documentId | string | 来源文档ID |
| data.results[].documentName | string | 来源文档名称 |
| data.results[].chunkIndex | integer | 切片序号 |
| data.results[].content | string | 切片内容 |
| data.results[].length | integer | 切片长度 |
| data.results[].metadata | object | 切片元数据 |
| data.totalResults | integer | 总结果数 |
| data.elapsedTime | number | 查询耗时（毫秒） |
| data.usedSettings | object | 使用的参数设置 |
| data.usedSettings.topK | integer | 使用的 top_k 值 |
| data.usedSettings.scoreThreshold | number | 使用的相似度阈值 |
| data.usedSettings.recallStrategy | string | 使用的召回策略 |

**响应示例**

```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {
    "query": "用户登录功能的测试要点",
    "results": [
      {
        "index": 1,
        "score": 0.92,
        "documentId": "doc-1716000000001",
        "documentName": "测试规范文档.docx",
        "chunkIndex": 3,
        "content": "用户登录功能应覆盖以下测试要点：1）用户名和密码的输入验证；2）登录按钮的状态控制；3）登录失败的错误提示；4）登录成功的会话管理；5）记住密码功能；6）验证码机制（如果启用）。",
        "length": 156,
        "metadata": {
          "page": 5,
          "section": "登录功能测试"
        }
      }
    ],
    "totalResults": 1,
    "elapsedTime": 320,
    "usedSettings": {
      "topK": 5,
      "scoreThreshold": 0.7,
      "recallStrategy": "hybrid"
    }
  }
}
```

### 4.2 获取召回测试历史

获取用户的召回测试历史记录。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/recall/test/history` |
| Method | `GET` |
| Content-Type | `application/json` |

**查询参数**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | integer | 否 | 页码，默认 1 |
| pageSize | integer | 否 | 每页数量，默认 10，最大 50 |
| startDate | string | 否 | 开始日期，格式：YYYY-MM-DD |
| endDate | string | 否 | 结束日期，格式：YYYY-MM-DD |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.total | integer | 历史记录总数 |
| data.page | integer | 当前页码 |
| data.pageSize | integer | 每页数量 |
| data.history | array | 历史记录列表 |
| data.history[].id | string | 记录ID |
| data.history[].query | string | 查询文本 |
| data.history[].resultCount | integer | 结果数量 |
| data.history[].elapsedTime | number | 查询耗时 |
| data.history[].createdAt | string | 创建时间 |
| data.history[].settings | object | 使用的参数设置 |

---

## 5. 统计信息

### 5.1 获取文档统计

获取文档相关的统计数据。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/statistics/documents` |
| Method | `GET` |
| Content-Type | `application/json` |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.totalDocuments | integer | 文档总数 |
| data.readyDocuments | integer | 已就绪文档数量 |
| data.processingDocuments | integer | 处理中文档数量 |
| data.failedDocuments | integer | 失败文档数量 |
| data.totalChunks | integer | 切片总数 |
| data.avgChunksPerDocument | number | 平均每文档切片数 |
| data.avgChunkLength | number | 平均切片长度 |
| data.byFormat | object | 按格式统计 |
| data.byFormat.docx | integer | docx 格式文档数量 |
| data.byFormat.xlsx | integer | xlsx 格式文档数量 |
| data.byFormat.pdf | integer | pdf 格式文档数量 |
| data.byFormat.txt | integer | txt 格式文档数量 |
| data.byFormat.md | integer | md 格式文档数量 |

### 5.2 获取处理状态统计

获取文档处理状态的实时统计。

| 属性 | 值 |
|------|-----|
| URL | `/api/v1/knowledge/statistics/processing` |
| Method | `GET` |
| Content-Type | `application/json` |

**响应参数**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| data.uploading | integer | 上传中数量 |
| data.slicing | integer | 切片中数量 |
| data.vectorizing | integer | 向量化中数量 |
| data.ready | integer | 已就绪数量 |
| data.failed | integer | 失败数量 |
| data.activeProcesses | integer | 活跃处理任务数量 |
| data.queueLength | integer | 等待处理队列长度 |
| data.estimatedCompletionTime | integer | 预计所有处理完成时间（秒） |

---

## 6. 错误码说明

| 错误码 | 说明 | 建议处理 |
|--------|------|----------|
| 4001 | 文件大小超过限制（50MB） | 请选择小于50MB的文件 |
| 4002 | 文档数量已达上限（100个） | 请删除部分文档后再上传 |
| 4003 | 存储空间不足 | 请删除部分文档释放空间 |
| 4004 | 不支持的文件格式 | 请上传 .docx, .xlsx, .pdf, .txt, .md 格式文件 |
| 4005 | 已存在同名文件 | 请重命名文件或选择覆盖 |
| 4006 | 文档正在处理中，无法删除 | 请等待处理完成或强制删除 |
| 4007 | 文档处理失败 | 请检查文档内容或联系管理员 |
| 4008 | 重试次数已达上限（3次） | 请检查文档内容或联系管理员 |
| 4009 | 知识库未启用 | 请先开启知识召回开关 |
| 4010 | 无可用文档 | 请先上传并处理文档 |
| 5001 | 文档处理服务异常 | 请稍后重试或联系管理员 |
| 5002 | 向量数据库连接失败 | 请稍后重试或联系管理员 |
| 5003 | 文件解析失败 | 请检查文件格式和内容 |
| 5004 | 切片参数无效 | 请检查参数范围 |
| 5005 | 召回测试失败 | 请检查查询文本或稍后重试 |

---

## 附录

### 文档处理状态说明

| 状态 | 说明 | 前端显示 |
|------|------|----------|
| uploading | 文件正在上传到服务器 | 蓝色脉冲动画标签「上传中」 |
| slicing | 系统正在对文档进行切片处理 | 蓝色脉冲动画标签「切片中」 |
| vectorizing | 切片内容正在向量化并存入向量数据库 | 蓝色脉冲动画标签「向量化中」 |
| ready | 文档处理完成，可被知识召回检索 | 绿色标签「已就绪」 |
| failed | 处理过程中出错 | 红色标签「处理失败」 |

### 召回参数效果说明

| 参数 | 默认值 | 范围 | 效果说明 |
|------|--------|------|----------|
| top_k | 5 | 1-20 | 每次召回返回的最大切片数量。值越大，提供的参考知识越多，但可能引入不相关内容；值越小，结果越精准但可能遗漏有用信息 |
| score_threshold | 0.7 | 0-1 | 仅返回相似度分数 ≥ 此阈值的结果。提高阈值可过滤低相关内容，但可能减少有效召回；降低阈值可获取更多结果，但可能引入噪声 |
| chunk_size | 500 | 100-2000 | 每个切片的最大字符数。较大的切片保留更多上下文，但可能降低检索精度；较小的切片检索更精准，但可能丢失上下文关联 |
| chunk_overlap | 50 | 0-500 | 相邻切片之间重叠的字符数。增大重叠度可避免关键信息被截断在切片边界，但会增加存储和计算开销 |

### 召回策略说明

| 策略 | 标识符 | 说明 | 适用场景 |
|------|--------|------|----------|
| 混合召回 | hybrid | 结合向量相似度和关键词匹配，兼顾语义理解和精确匹配 | 适合大多数场景，特别是包含专业术语、编号规则等需要精确匹配关键词的文档 |
| 纯向量召回 | vector | 仅基于语义相似度进行召回，理解意图而非字面匹配 | 适合自然语言描述为主的文档，能找到语义相近但用词不同的内容 |

### 存储空间警告级别

| 使用率 | 级别 | 颜色 | 提示 |
|--------|------|------|------|
| < 70% | normal | 蓝色 | 存储空间充足 |
| 70%-90% | warning | 黄色 | 存储空间即将用尽，建议清理 |
| > 90% | critical | 红色 | 存储空间严重不足，无法上传新文档 |

---

**文档版本**：v1.0  
**最后更新**：2024-05-17  
**维护者**：前端开发团队