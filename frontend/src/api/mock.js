const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    name: '管理员'
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    email: 'user@example.com',
    name: '普通用户'
  }
]

const mockRequirements = [
  {
    id: 'req-1',
    title: '用户登录系统需求',
    status: 'completed',
    statusText: '已完成',
    date: '2026-05-12 14:30',
    testPointCount: 3,
    caseCount: 5,
    source: 'standardization'
  },
  {
    id: 'req-2',
    title: '数据导出功能需求',
    status: 'generating',
    statusText: '生成中',
    date: '2026-05-12 10:15',
    testPointCount: 2,
    caseCount: 3,
    source: 'standardization'
  },
  {
    id: 'req-3',
    title: '用户权限管理需求',
    status: 'pending',
    statusText: '待生成',
    date: '2026-05-11 16:45',
    testPointCount: 0,
    caseCount: 0,
    source: 'standardization'
  },
  {
    id: 'req-4',
    title: '账户安全设置需求',
    status: 'completed',
    statusText: '已完成',
    date: '2026-05-10 09:20',
    testPointCount: 4,
    caseCount: 8,
    source: 'standardization'
  },
  {
    id: 'req-5',
    title: '交易记录查询需求',
    status: 'pending',
    statusText: '待生成',
    date: '2026-05-09 11:30',
    testPointCount: 0,
    caseCount: 0,
    source: 'standardization'
  },
  {
    id: 'req-6',
    title: '系统通知推送需求',
    status: 'completed',
    statusText: '已完成',
    date: '2026-05-08 15:00',
    testPointCount: 2,
    caseCount: 4,
    source: 'standardization'
  },
  {
    id: 'req-7',
    title: '密码重置流程需求',
    status: 'generating',
    statusText: '生成中',
    date: '2026-05-07 08:45',
    testPointCount: 1,
    caseCount: 2,
    source: 'standardization'
  }
]

const buildCaseNote = (caseData) => {
  const propClass = caseData.caseProperty === '正例' ? 'positive' : 'negative'
  const propLabel = caseData.caseProperty
  const sourceLabel = caseData.source
  const sourceClass = caseData.source === 'AI' ? 'ai' : 'manual'

  let html = '<div class="case-note-popover">'
  if (caseData.caseName) {
    html += `<div class="case-note-name">${caseData.caseName}</div>`
  }
  html += `<div class="case-note-header">
    <span class="case-property-tag tag-${propClass}">${propLabel}</span>
    <span class="case-source-tag tag-${sourceClass}">${sourceLabel}</span>
  </div>`
  html += `<div class="case-note-precondition"><span class="label">前置条件：</span>${caseData.preCondition}</div>`
  html += '<div class="case-note-steps"><div class="label">测试步骤：</div>'
  caseData.steps.forEach((step, idx) => {
    html += `<div class="step-item">
      <span class="step-num">${idx + 1}</span>
      <span class="step-name">${step.name}</span>
      <span class="step-desc">${step.description}</span>
      <span class="step-arrow">→</span>
      <span class="step-expect">${step.stepExpectedResult}</span>
    </div>`
  })
  html += '</div></div>'
  return html
}

const mockMindMapData = {
  'req-1': {
    data: {
      text: '用户登录系统需求',
      note: '',
      expand: true,
      _level: 'root',
      _status: 'completed'
    },
    children: [
      {
        data: {
          text: '实现用户登录功能，支持用户名密码验证',
          note: '',
          expand: true,
          _level: 'requirement',
          _status: 'completed'
        },
        children: [
          {
            data: {
              text: '用户名输入验证',
              note: '',
              expand: true,
              _level: 'testPoint',
              _status: 'completed',
              _source: 'AI',
              _marked: false
            },
            children: [
              {
                data: {
                  text: '用户正常登录系统',
                  note: buildCaseNote({
                    caseName: '用户正常登录系统',
                    caseProperty: '正例',
                    preCondition: '用户已注册并拥有有效的账号和密码',
                    source: 'AI',
                    steps: [
                      { name: '输入用户名', description: '在登录页输入正确的用户名', stepExpectedResult: '用户名输入框显示输入的用户名' },
                      { name: '输入密码', description: '在登录页输入正确的密码', stepExpectedResult: '密码输入框显示输入的密码' },
                      { name: '点击登录按钮', description: '点击登录按钮', stepExpectedResult: '系统跳转至用户主页' }
                    ]
                  }),
                  expand: true,
                  _level: 'testCase',
                  _caseProperty: '正例',
                  _source: 'AI'
                },
                children: []
              },
              {
                data: {
                  text: '用户登录失败-密码错误',
                  note: buildCaseNote({
                    caseName: '用户登录失败-密码错误',
                    caseProperty: '反例',
                    preCondition: '用户已注册但密码错误',
                    source: 'AI',
                    steps: [
                      { name: '输入用户名', description: '在登录页输入用户名', stepExpectedResult: '用户名输入框显示输入的用户名' },
                      { name: '输入错误密码', description: '在登录页输入错误的密码', stepExpectedResult: '密码输入框显示输入的密码' },
                      { name: '点击登录按钮', description: '点击登录按钮', stepExpectedResult: '系统提示密码错误' }
                    ]
                  }),
                  expand: true,
                  _level: 'testCase',
                  _caseProperty: '反例',
                  _source: 'AI'
                },
                children: []
              },
              {
                data: {
                  text: '用户登录失败-用户不存在',
                  note: buildCaseNote({
                    caseName: '用户登录失败-用户不存在',
                    caseProperty: '反例',
                    preCondition: '用户未注册',
                    source: '人工',
                    steps: [
                      { name: '输入用户名', description: '输入不存在的用户名', stepExpectedResult: '用户名输入框显示输入的用户名' },
                      { name: '输入密码', description: '输入任意密码', stepExpectedResult: '密码输入框显示输入的密码' },
                      { name: '点击登录按钮', description: '点击登录按钮', stepExpectedResult: '系统提示用户不存在' }
                    ]
                  }),
                  expand: true,
                  _level: 'testCase',
                  _caseProperty: '反例',
                  _source: '人工'
                },
                children: []
              }
            ]
          },
          {
            data: {
              text: '密码输入验证',
              note: '',
              expand: true,
              _level: 'testPoint',
              _status: 'completed',
              _source: 'AI',
              _marked: true
            },
            children: [
              {
                data: {
                  text: '密码为空时登录',
                  note: buildCaseNote({
                    caseName: '密码为空时登录',
                    caseProperty: '反例',
                    preCondition: '用户已注册',
                    source: 'AI',
                    steps: [
                      { name: '输入用户名', description: '输入正确的用户名', stepExpectedResult: '用户名输入框显示输入的用户名' },
                      { name: '密码为空', description: '不输入密码', stepExpectedResult: '密码输入框为空' },
                      { name: '点击登录按钮', description: '点击登录按钮', stepExpectedResult: '系统提示密码不能为空' }
                    ]
                  }),
                  expand: true,
                  _level: 'testCase',
                  _caseProperty: '反例',
                  _source: 'AI'
                },
                children: []
              }
            ]
          },
          {
            data: {
              text: '登录按钮状态验证',
              note: '',
              expand: false,
              _level: 'testPoint',
              _status: 'completed',
              _source: '人工',
              _marked: false
            },
            children: []
          }
        ]
      }
    ]
  }
}

export const mockAuthAPI = {
  login: (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(
          u => u.username === data.username && u.password === data.password
        )
        if (user) {
          resolve({
            token: `mock-token-${user.id}-${Date.now()}`,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              name: user.name
            }
          })
        } else {
          reject({
            response: {
              data: {
                message: '用户名或密码错误'
              },
              status: 401
            }
          })
        }
      }, 500)
    })
  },
  register: (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exists = mockUsers.some(u => u.username === data.username)
        if (exists) {
          reject({
            response: {
              data: {
                message: '用户名已存在'
              },
              status: 400
            }
          })
        } else {
          const newUser = {
            id: String(mockUsers.length + 1),
            username: data.username,
            password: data.password,
            email: data.email,
            name: data.name || data.username
          }
          mockUsers.push(newUser)
          resolve({
            token: `mock-token-${newUser.id}-${Date.now()}`,
            user: {
              id: newUser.id,
              username: newUser.username,
              email: newUser.email,
              name: newUser.name
            }
          })
        }
      }, 500)
    })
  }
}

export const mockTestDesignAPI = {
  getRequirementList: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...mockRequirements]
        const { keyword, status, page = 1, pageSize = 20 } = params

        if (keyword) {
          const kw = keyword.toLowerCase()
          list = list.filter(item => item.title.toLowerCase().includes(kw))
        }

        if (status) {
          list = list.filter(item => item.status === status)
        }

        const total = list.length
        const start = (page - 1) * pageSize
        const pagedList = list.slice(start, start + pageSize)

        resolve({
          success: true,
          code: 200,
          message: '操作成功',
          data: {
            list: pagedList,
            total,
            page,
            pageSize
          }
        })
      }, 300)
    })
  },

  getMindMapData: (requirementId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = mockMindMapData[requirementId]
        if (data) {
          resolve({
            success: true,
            code: 200,
            message: '操作成功',
            data
          })
        } else {
          resolve({
            success: true,
            code: 200,
            message: '操作成功',
            data: {
              data: {
                text: mockRequirements.find(r => r.id === requirementId)?.title || '未知需求',
                expand: true,
                _level: 'root',
                _status: 'pending'
              },
              children: []
            }
          })
        }
      }, 200)
    })
  },

  generate: (requirementId, options = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          code: 200,
          message: '操作成功',
          data: {
            taskId: `task-${Date.now()}`
          }
        })
      }, 300)
    })
  },

  getTaskStatus: (taskId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          code: 200,
          message: '操作成功',
          data: {
            taskId,
            status: 'running',
            progress: 45,
            progressText: '正在生成测试点：密码输入验证',
            currentNodeId: 'tp-2'
          }
        })
      }, 200)
    })
  },

  cancelTask: (taskId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          code: 200,
          message: '任务已取消',
          data: null
        })
      }, 200)
    })
  }
}
