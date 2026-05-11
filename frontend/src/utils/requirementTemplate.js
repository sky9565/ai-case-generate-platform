/**
 * 需求规格说明书标准模板
 * 基于 IEEE 830 标准，行业最广泛使用的需求文档模板
 *
 * 模板结构说明：
 * - sections: 定义文档的章节框架，用户不可删除
 * - 每个 section 包含 title（章节标题）和 placeholder（占位提示）
 * - 用户可编辑各章节内容，但框架结构保持不变
 */

export const REQUIREMENT_TEMPLATE = {
  name: '需求规格说明书',
  version: '1.0',
  basedOn: 'IEEE 830-1998',

  sections: [
    {
      id: 'intro',
      title: '1. 引言',
      required: true,
      children: [
        { id: 'intro-purpose', title: '1.1 编写目的', placeholder: '说明本文档的编写目的和预期读者' },
        { id: 'intro-background', title: '1.2 项目背景', placeholder: '描述项目背景、业务场景和要解决的问题' },
        { id: 'intro-terms', title: '1.3 术语定义', placeholder: '定义文档中使用的专业术语和缩写' }
      ]
    },
    {
      id: 'overview',
      title: '2. 需求概述',
      required: true,
      children: [
        { id: 'overview-goal', title: '2.1 业务目标', placeholder: '描述本需求要达成的业务目标' },
        { id: 'overview-role', title: '2.2 用户角色', placeholder: '列出涉及的用户角色及其职责' },
        { id: 'overview-flow', title: '2.3 核心业务流程', placeholder: '描述核心业务流程的主要步骤' }
      ]
    },
    {
      id: 'functional',
      title: '3. 功能需求',
      required: true,
      children: [
        { id: 'func-module-1', title: '3.1 功能模块一', placeholder: '描述第一个功能模块的详细需求' },
        { id: 'func-module-2', title: '3.2 功能模块二', placeholder: '描述第二个功能模块的详细需求' }
      ]
    },
    {
      id: 'non-functional',
      title: '4. 非功能需求',
      required: true,
      children: [
        { id: 'nf-performance', title: '4.1 性能需求', placeholder: '如响应时间、并发量、吞吐量等指标' },
        { id: 'nf-security', title: '4.2 安全性需求', placeholder: '如数据加密、访问控制、审计日志等' },
        { id: 'nf-availability', title: '4.3 可用性需求', placeholder: '如系统可用率、故障恢复时间等' },
        { id: 'nf-compatibility', title: '4.4 兼容性需求', placeholder: '如浏览器兼容、操作系统兼容等' }
      ]
    },
    {
      id: 'constraints',
      title: '5. 约束条件',
      required: true,
      children: [
        { id: 'const-tech', title: '5.1 技术约束', placeholder: '如开发语言、框架、部署环境等技术限制' },
        { id: 'const-business', title: '5.2 业务约束', placeholder: '如合规要求、行业标准等业务限制' },
        { id: 'const-regulatory', title: '5.3 法规约束', placeholder: '如数据保护法、行业监管要求等法规限制' }
      ]
    },
    {
      id: 'exceptions',
      title: '6. 异常场景处理',
      required: true,
      children: [
        { id: 'exc-1', title: '6.1 异常场景一', placeholder: '描述异常场景及处理方式' },
        { id: 'exc-2', title: '6.2 异常场景二', placeholder: '描述异常场景及处理方式' }
      ]
    }
  ],

  generateContent(userInput) {
    const lines = ['# 需求规格说明书', '']

    this.sections.forEach(section => {
      lines.push(`## ${section.title}`)
      lines.push('')
      section.children.forEach(child => {
        lines.push(`### ${child.title}`)
        lines.push('')
        lines.push(`> ${child.placeholder}`)
        lines.push('')
      })
    })

    return lines.join('\n')
  },

  generateEmptyContent() {
    const lines = ['# 需求规格说明书', '']

    this.sections.forEach(section => {
      lines.push(`## ${section.title}`)
      lines.push('')
      section.children.forEach(child => {
        lines.push(`### ${child.title}`)
        lines.push('')
        lines.push('')
      })
    })

    return lines.join('\n')
  }
}