<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-8">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h1 class="text-lg font-bold text-gray-800">智能测试用例平台</h1>
            </div>
            <div class="flex items-center space-x-1">
              <router-link
                to="/standardization"
                class="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                需求标准化
              </router-link>
              <router-link
                to="/test-design"
                class="px-4 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-600"
              >
                测试设计
              </router-link>
              <router-link
                to="/knowledge-base"
                class="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                知识库
              </router-link>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">{{ $store.getters.user?.username || 'admin' }}</span>
            <button @click="handleLogout" class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex h-[calc(100vh-64px)]">
      <!-- 左侧边栏 -->
      <aside class="w-64 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto flex flex-col">
        <div class="p-4 flex-1">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-gray-800">需求列表</h3>
            <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{{ totalCount }}</span>
          </div>

          <!-- 搜索框 -->
          <div class="relative mb-3">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              type="text"
              v-model="searchKeyword"
              placeholder="搜索需求..."
              class="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="onSearchInput"
            />
          </div>

          <!-- 状态筛选 -->
          <div class="flex items-center space-x-1 mb-3">
            <button
              v-for="tab in statusTabs"
              :key="tab.value"
              @click="filterByStatus(tab.value)"
              class="flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors"
              :class="activeStatusFilter === tab.value
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'"
            >{{ tab.label }}</button>
          </div>

          <!-- 加载状态 -->
          <div v-if="isLoadingList" class="flex items-center justify-center py-12">
            <svg class="w-5 h-5 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span class="ml-2 text-sm text-gray-400">加载中...</span>
          </div>

          <!-- 加载失败 -->
          <div v-else-if="loadError" class="text-center py-8">
            <svg class="w-10 h-10 text-red-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <p class="text-sm text-red-400 mb-2">{{ loadError }}</p>
            <button @click="fetchRequirementList" class="text-xs text-blue-600 hover:text-blue-700 underline">重新加载</button>
          </div>

          <!-- 空状态 -->
          <div v-else-if="filteredHistoryList.length === 0 && !isLoadingList" class="text-center py-8">
            <svg class="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <p class="text-xs text-gray-400">{{ searchKeyword ? '未找到匹配的需求' : '暂无需求数据' }}</p>
            <p v-if="!searchKeyword" class="text-xs text-gray-300 mt-1">前往「需求标准化」模块完成需求录入</p>
          </div>

          <!-- 需求列表 -->
          <div v-else class="space-y-1">
            <div
              v-for="item in filteredHistoryList"
              :key="item.id"
              @click="selectRequirement(item)"
              class="p-3 rounded-lg cursor-pointer transition-all group"
              :class="item.id === activeRequirementId ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'"
            >
              <div class="flex items-start justify-between">
                <p class="text-sm text-gray-700 truncate flex-1 mr-2">{{ item.title }}</p>
                <span
                  class="flex-shrink-0 px-1.5 py-0.5 text-xs rounded"
                  :class="getRequirementStatusClass(item.status)"
                >{{ item.statusText }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-1.5">{{ item.date }}</p>
              <div class="mt-2 flex items-center space-x-3 text-xs text-gray-400">
                <span class="flex items-center space-x-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <span>{{ item.testPointCount }}测试点</span>
                </span>
                <span class="flex items-center space-x-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>{{ item.caseCount }}用例</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <!-- 工具栏 -->
        <div class="bg-white border-b border-gray-200 px-6 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <h2 class="text-base font-semibold text-gray-800">
                {{ activeRequirement ? activeRequirement.title : '测试设计脑图' }}
              </h2>
              <span v-if="activeRequirement" class="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                {{ activeRequirement.statusText }}
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <!-- 知识库开关 -->
              <label class="flex items-center space-x-2 cursor-pointer">
                <div class="relative">
                  <input type="checkbox" class="sr-only peer" v-model="knowledgeBaseEnabled" />
                  <div class="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                  <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform"></div>
                </div>
                <span class="text-sm text-gray-600">知识库</span>
              </label>

              <div class="w-px h-5 bg-gray-200"></div>

              <!-- 快速生成按钮 -->
              <button
                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isGenerating || !activeRequirement"
              >
                <svg v-if="!isGenerating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>{{ isGenerating ? '生成中...' : '快速生成' }}</span>
              </button>

              <!-- 取消生成按钮 -->
              <button
                v-if="isGenerating"
                class="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                取消
              </button>

              <!-- 导出按钮 -->
              <button
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>导出Excel</span>
              </button>
            </div>
          </div>

          <!-- 进度条 -->
          <div v-if="isGenerating" class="mt-3">
            <div class="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span>{{ progressText }}</span>
              <span>{{ progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div
                class="bg-blue-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                :style="{ width: progress + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- 脑图画布 -->
        <div class="flex-1 overflow-hidden bg-gray-50 relative">
          <!-- 空状态 -->
          <div v-if="!activeRequirement" class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <p class="text-gray-400 text-sm mb-4">请从左侧选择一个需求开始测试设计</p>
              <p class="text-gray-300 text-xs">或前往「需求标准化」模块完成需求录入与拆分</p>
            </div>
          </div>

          <!-- simple-mind-map 容器 -->
          <div
            v-show="activeRequirement"
            ref="mindMapContainer"
            class="w-full h-full"
          ></div>
        </div>

        <!-- 底部缩放控制栏 -->
        <div class="bg-white border-t border-gray-200 px-6 py-2 flex items-center justify-between">
          <div class="flex items-center space-x-1 text-xs text-gray-400">
            <span>提示：右键节点打开菜单 | 双击用例编辑 | 滚轮缩放</span>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="zoomOut"
              class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="缩小"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path>
              </svg>
            </button>
            <span class="text-sm text-gray-600 font-medium w-12 text-center">{{ Math.round(zoomLevel * 100) }}%</span>
            <button
              @click="zoomIn"
              class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="放大"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
              </svg>
            </button>
            <div class="w-px h-4 bg-gray-200 mx-1"></div>
            <button
              @click="fitCanvas"
              class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="适应画布"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- 用例备注弹窗容器 -->
    <div id="custom-note-popover"></div>

    <!-- 右键菜单 -->
    <div
      v-if="contextMenu.visible"
      class="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 z-50 min-w-[180px] context-menu"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
    >
      <!-- 需求节点菜单 -->
      <template v-if="contextMenu.type === 'requirement'">
        <button @click="addTestPoint" class="context-menu-item">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>添加测试点</span>
        </button>
        <button @click="aiAdjust" class="context-menu-item">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          <span>AI调整</span>
        </button>
      </template>

      <!-- 测试点节点菜单 -->
      <template v-if="contextMenu.type === 'testPoint'">
        <button @click="editTestPoint" class="context-menu-item">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <span>编辑</span>
        </button>
        <button @click="addTestCase" class="context-menu-item">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>添加测试用例</span>
        </button>
        <button @click="aiAdjust" class="context-menu-item">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          <span>AI调整</span>
        </button>
        <div class="border-t border-gray-100 my-1"></div>
        <button @click="toggleMark" class="context-menu-item">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
          </svg>
          <span>{{ contextMenu.node && contextMenu.node.marked ? '取消标记保留' : '标记保留' }}</span>
        </button>
        <div class="border-t border-gray-100 my-1"></div>
        <button @click="deleteTestPoint" class="context-menu-item text-red-600 hover:bg-red-50">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          <span>删除</span>
        </button>
      </template>

      <!-- 测试用例节点菜单 -->
      <template v-if="contextMenu.type === 'testCase'">
        <button @click="editTestCaseDialog" class="context-menu-item">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <span>编辑</span>
        </button>
        <div class="border-t border-gray-100 my-1"></div>
        <button @click="deleteTestCase" class="context-menu-item text-red-600 hover:bg-red-50">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          <span>删除</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import MindMap from 'simple-mind-map'
import { mockTestDesignAPI } from '../api/mock'

export default {
  name: 'TestDesign',

  data() {
    return {
      mindMap: null,
      searchKeyword: '',
      knowledgeBaseEnabled: false,
      isGenerating: false,
      progress: 0,
      progressText: '',
      zoomLevel: 1,
      activeRequirementId: null,
      activeRequirement: null,
      historyList: [],
      totalCount: 0,
      isLoadingList: false,
      loadError: '',
      activeStatusFilter: '',
      searchTimer: null,
      statusTabs: [
        { label: '全部', value: '' },
        { label: '待生成', value: 'pending' },
        { label: '生成中', value: 'generating' },
        { label: '已完成', value: 'completed' }
      ],
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        type: '',
        node: null,
        smmNode: null
      }
    }
  },

  computed: {
    filteredHistoryList() {
      return this.historyList
    }
  },

  mounted() {
    this.fetchRequirementList()
    document.addEventListener('click', this.hideContextMenu)
  },

  beforeDestroy() {
    document.removeEventListener('click', this.hideContextMenu)
    if (this.mindMap) {
      this.mindMap.destroy()
      this.mindMap = null
    }
  },

  methods: {
    // ==================== 需求列表数据获取 ====================
    async fetchRequirementList() {
      this.isLoadingList = true
      this.loadError = ''
      try {
        const params = {
          keyword: this.searchKeyword || undefined,
          status: this.activeStatusFilter || undefined
        }
        const res = await mockTestDesignAPI.getRequirementList(params)
        if (res.success) {
          this.historyList = res.data.list
          this.totalCount = res.data.total
          if (!this.activeRequirementId && this.historyList.length > 0) {
            this.selectRequirement(this.historyList[0])
          }
        } else {
          this.loadError = res.message || '加载失败'
        }
      } catch (e) {
        this.loadError = '网络异常，请稍后重试'
      } finally {
        this.isLoadingList = false
      }
    },

    onSearchInput() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }
      this.searchTimer = setTimeout(() => {
        this.fetchRequirementList()
      }, 300)
    },

    filterByStatus(status) {
      if (this.activeStatusFilter === status) return
      this.activeStatusFilter = status
      this.fetchRequirementList()
    },

    // ==================== 需求选择 ====================
    async selectRequirement(item) {
      if (this.activeRequirementId === item.id) return
      this.activeRequirementId = item.id
      this.activeRequirement = item

      try {
        const res = await mockTestDesignAPI.getMindMapData(item.id)
        if (res.success) {
          this._mindMapData = res.data
        }
      } catch (e) {
        this._mindMapData = null
      }

      this.$nextTick(() => {
        this.initMindMap()
      })
    },

    // ==================== 脑图初始化 ====================
    initMindMap() {
      if (this.mindMap) {
        this.mindMap.destroy()
        this.mindMap = null
      }

      const container = this.$refs.mindMapContainer
      if (!container) return

      const mindMapData = this.buildMindMapData()

      const noteShow = (content, left, top) => {
        const el = document.getElementById('custom-note-popover')
        if (!el) return null
        el.style.left = `${left}px`
        el.style.top = `${top}px`
        el.innerHTML = content
        el.style.display = 'block'
        return el
      }
      const noteHide = () => {
        const el = document.getElementById('custom-note-popover')
        if (el) el.style.display = 'none'
      }
      this._noteShow = noteShow
      this._noteHide = noteHide

      this.mindMap = new MindMap({
        el: container,
        data: mindMapData,
        layout: 'mindMap',
        readonly: false,
        themeConfig: this.getThemeConfig(),
        initRootNodePosition: ['20%', '50%'],
        textAutoWrapWidth: 500,
        mousewheelAction: 'zoom',
        defaultInsertSecondLevelNodeText: '分支需求',
        defaultInsertBelowSecondLevelNodeText: '分支主题',
        alwaysShowExpandBtn: true,
        isShowCreateChildBtnIcon: false,
        isUseCustomNodeContent: true,
        customCreateNodeContent: (node) => {
          return this.createCustomNodeContent(node)
        },
        customNoteContentShow: {
          show: noteShow,
          hide: noteHide
        },
        beforeShortcutRun: (key, activeNodes) => {
          if (activeNodes && activeNodes.length > 0) {
            const activeNode = activeNodes[0]
            if (this.getNodeLevel(activeNode) === 'testCase') {
              if (key === 'Tab' || key === 'Insert' || key === 'Enter') {
                return true
              }
            }
          }
          return false
        }
      })

      this.patchRootExpandBtn()
      this.bindMindMapEvents()
    },

    patchRootExpandBtn() {
      const rootNode = this.mindMap.renderer.root
      if (!rootNode) return
      const origRender = rootNode.renderExpandBtn
      rootNode.renderExpandBtn = function () {
        if (this.getChildrenLength() <= 0) return
        const wasRoot = this.isRoot
        this.isRoot = false
        origRender.call(this)
        this.isRoot = wasRoot
      }
      rootNode.renderExpandBtn()
    },

    // ==================== 自定义节点内容 ====================
    createCustomNodeContent(node) {
      const data = node.getData()
      const level = this.getNodeLevel(node)
      const wrapper = document.createElement('div')

      switch (level) {
        case 'root':
          return this.createRootNodeContent(wrapper, data)
        case 'requirement':
          return this.createRequirementNodeContent(wrapper, data)
        case 'testPoint':
          return this.createTestPointNodeContent(wrapper, data)
        case 'testCase':
          return this.createTestCaseNodeContent(wrapper, data)
        default:
          wrapper.textContent = data.text || ''
          return wrapper
      }
    },

    createRootNodeContent(wrapper, data) {
      wrapper.style.cssText = `
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: #ffffff;
        padding: 14px 20px;
        border-radius: 12px;
        min-width: 180px;
        box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      `
      const title = document.createElement('div')
      title.style.cssText = 'font-size:15px;font-weight:700;line-height:1.4;margin-bottom:8px;'
      title.textContent = data.text || ''

      const status = document.createElement('span')
      const statusText = data._status === 'completed' ? '已完成' : data._status === 'generating' ? '生成中' : '待生成'
      const statusBg = data._status === 'completed' ? 'rgba(255,255,255,0.25)' : data._status === 'generating' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)'
      status.style.cssText = `
        display:inline-block;font-size:11px;padding:2px 10px;border-radius:10px;
        background:${statusBg};color:#fff;font-weight:500;letter-spacing:0.5px;
      `
      status.textContent = statusText

      wrapper.appendChild(title)
      wrapper.appendChild(status)
      return wrapper
    },

    createRequirementNodeContent(wrapper, data) {
      wrapper.style.cssText = `
        background: #eff6ff;
        padding: 10px 16px 12px 16px;
        border-radius: 10px;
        border: 1.5px solid #bfdbfe;
        min-width: 200px;
        max-width: 320px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        box-shadow: 0 1px 3px rgba(59, 130, 246, 0.08);
      `
      const typeLabel = document.createElement('div')
      typeLabel.style.cssText = `
        display:inline-block;font-size:10px;font-weight:600;color:#3b82f6;
        background:#dbeafe;padding:1px 8px;border-radius:3px;margin-bottom:6px;
        letter-spacing:0.5px;
      `
      typeLabel.textContent = '需求'

      const header = document.createElement('div')
      header.style.cssText = 'display:flex;align-items:flex-start;justify-content:space-between;gap:8px;'

      const text = document.createElement('div')
      text.style.cssText = 'font-size:13px;font-weight:600;color:#1e40af;line-height:1.5;flex:1;word-break:break-all;'
      text.textContent = data.text || ''

      const statusDot = document.createElement('span')
      const dotColor = data._status === 'completed' ? '#22c55e' : data._status === 'generating' ? '#f59e0b' : '#d1d5db'
      statusDot.style.cssText = `
        flex-shrink:0;width:8px;height:8px;border-radius:50%;background:${dotColor};
        margin-top:4px;box-shadow:0 0 0 3px ${dotColor}22;
      `

      header.appendChild(text)
      header.appendChild(statusDot)
      wrapper.appendChild(typeLabel)
      wrapper.appendChild(header)
      return wrapper
    },

    createTestPointNodeContent(wrapper, data) {
      wrapper.style.cssText = `
        position:relative;
        background: #f0fdf4;
        padding: 10px 16px 12px 16px;
        border-radius: 10px;
        border: 1.5px solid #bbf7d0;
        min-width: 180px;
        max-width: 300px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        box-shadow: 0 1px 3px rgba(34, 197, 94, 0.06);
      `

      if (data._marked) {
        const pinIcon = document.createElement('span')
        pinIcon.style.cssText = `
          position:absolute;top:2px;left:2px;font-size:14px;
          filter:drop-shadow(0 1px 2px rgba(245,158,11,0.4));
        `
        pinIcon.textContent = '📌'
        wrapper.appendChild(pinIcon)
      }

      const typeLabel = document.createElement('div')
      typeLabel.style.cssText = `
        display:inline-block;font-size:10px;font-weight:600;color:#16a34a;
        background:#dcfce7;padding:1px 8px;border-radius:3px;margin-bottom:6px;
        letter-spacing:0.5px;
      `
      typeLabel.textContent = '测试点'

      const header = document.createElement('div')
      header.style.cssText = 'display:flex;align-items:flex-start;justify-content:space-between;gap:6px;margin-bottom:8px;'

      const text = document.createElement('div')
      text.style.cssText = 'font-size:13px;font-weight:600;color:#166534;line-height:1.5;flex:1;word-break:break-all;'
      text.textContent = data.text || ''

      const statusDot = document.createElement('span')
      const dotColor = data._status === 'completed' ? '#22c55e' : data._status === 'generating' ? '#f59e0b' : '#d1d5db'
      statusDot.style.cssText = `
        flex-shrink:0;width:8px;height:8px;border-radius:50%;background:${dotColor};
        margin-top:4px;box-shadow:0 0 0 3px ${dotColor}22;
      `

      header.appendChild(text)
      header.appendChild(statusDot)

      const footer = document.createElement('div')
      footer.style.cssText = 'display:flex;align-items:center;gap:6px;'

      const sourceBadge = document.createElement('span')
      const isAI = data._source === 'AI'
      sourceBadge.style.cssText = `
        display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:600;
        padding:2px 8px;border-radius:4px;
        background:${isAI ? '#fef3c7' : '#f3e8ff'};
        color:${isAI ? '#92400e' : '#6b21a8'};
      `
      sourceBadge.innerHTML = `${isAI ? '🤖' : '✍️'} ${data._source || 'AI'}`

      footer.appendChild(sourceBadge)

      wrapper.appendChild(typeLabel)
      wrapper.appendChild(header)
      wrapper.appendChild(footer)
      return wrapper
    },

    createTestCaseNodeContent(wrapper, data) {
      wrapper.style.cssText = `
        position:relative;
        background: #ffffff;
        padding: 10px 16px 12px 16px;
        border-radius: 10px;
        border: 1.5px solid #e5e7eb;
        min-width: 200px;
        max-width: 320px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      `

      if (data._marked) {
        const pinIcon = document.createElement('span')
        pinIcon.style.cssText = `
          position:absolute;top:2px;left:2px;font-size:14px;
          filter:drop-shadow(0 1px 2px rgba(245,158,11,0.4));
        `
        pinIcon.textContent = '📌'
        wrapper.appendChild(pinIcon)
      }

      const typeLabel = document.createElement('div')
      typeLabel.style.cssText = `
        display:inline-block;font-size:10px;font-weight:600;color:#6b7280;
        background:#f3f4f6;padding:1px 8px;border-radius:3px;margin-bottom:6px;
        letter-spacing:0.5px;
      `
      typeLabel.textContent = '测试用例'

      const header = document.createElement('div')
      header.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;'

      const propBadge = document.createElement('span')
      const isPositive = data._caseProperty === '正例'
      propBadge.style.cssText = `
        flex-shrink:0;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;
        background:${isPositive ? '#dcfce7' : '#fee2e2'};
        color:${isPositive ? '#166534' : '#991b1b'};
      `
      propBadge.textContent = data._caseProperty || '正例'

      const name = document.createElement('span')
      name.style.cssText = 'font-size:13px;font-weight:600;color:#1f2937;line-height:1.4;flex:1;word-break:break-all;'
      name.textContent = data.text || ''

      header.appendChild(propBadge)
      header.appendChild(name)

      const meta = document.createElement('div')
      meta.style.cssText = 'display:flex;align-items:center;gap:6px;'

      const sourceBadge = document.createElement('span')
      const isAI = data._source === 'AI'
      sourceBadge.style.cssText = `
        display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:600;
        padding:2px 8px;border-radius:4px;
        background:${isAI ? '#fef3c7' : '#f3e8ff'};
        color:${isAI ? '#92400e' : '#6b21a8'};
      `
      sourceBadge.innerHTML = `${isAI ? '🤖' : '✍️'} ${data._source || 'AI'}`

      meta.appendChild(sourceBadge)

      if (data.note) {
        const noteBtn = document.createElement('span')
        noteBtn.style.cssText = `
          display:inline-flex;align-items:center;gap:2px;font-size:10px;font-weight:500;
          padding:2px 8px;border-radius:4px;cursor:pointer;
          background:#eff6ff;color:#3b82f6;
          transition:background 0.15s;flex-shrink:0;
        `
        noteBtn.innerHTML = '📋 详情'
        noteBtn.title = '查看用例详情'

        const vm = this
        noteBtn.addEventListener('mouseenter', (e) => {
          e.stopPropagation()
          const rect = wrapper.getBoundingClientRect()
          if (vm._noteShow) {
            vm._noteShow(data.note, rect.right + 8, rect.top)
          }
        })
        noteBtn.addEventListener('mouseleave', (e) => {
          e.stopPropagation()
          if (vm._noteHide) {
            vm._noteHide()
          }
        })

        meta.appendChild(noteBtn)
      }

      wrapper.appendChild(typeLabel)
      wrapper.appendChild(header)
      wrapper.appendChild(meta)
      return wrapper
    },

    buildMindMapData() {
      if (this._mindMapData) {
        return JSON.parse(JSON.stringify(this._mindMapData))
      }

      const req = this.activeRequirement
      if (!req) return { data: { text: '根节点' }, children: [] }

      return {
        data: { text: req.title, expand: true, _level: 'root', _status: req.status },
        children: []
      }
    },

    getThemeConfig() {
      return {
        backgroundColor: '#f9fafb',
        lineColor: '#cbd5e1',
        lineWidth: 2,
        lineStyle: 'straight',
        paddingX: 0,
        paddingY: 0,
        root: {
          fillColor: 'transparent',
          color: '#ffffff',
          fontSize: 14,
          fontWeight: 'bold',
          borderRadius: 0,
          paddingX: 0,
          paddingY: 0,
          borderWidth: 0,
          borderColor: 'transparent'
        },
        second: {
          fillColor: 'transparent',
          color: '#1e40af',
          fontSize: 13,
          fontWeight: '600',
          borderRadius: 0,
          paddingX: 0,
          paddingY: 0,
          borderWidth: 0,
          borderColor: 'transparent'
        },
        node: {
          fillColor: 'transparent',
          color: '#166534',
          fontSize: 13,
          fontWeight: '500',
          borderRadius: 0,
          paddingX: 0,
          paddingY: 0,
          borderWidth: 0,
          borderColor: 'transparent'
        }
      }
    },

    // ==================== 事件绑定 ====================
    bindMindMapEvents() {
      if (!this.mindMap) return

      this.mindMap.on('node_contextmenu', (e, node) => {
        e.preventDefault()
        this.handleNodeContextMenu(e, node)
      })

      this.mindMap.on('node_dblclick', (node) => {
        this.handleNodeDblClick(node)
      })

      this.mindMap.on('scale', (scale) => {
        this.zoomLevel = scale
      })

      this.mindMap.on('draw_click', () => {
        this.hideContextMenu()
      })

      this.mindMap.on('node_click', () => {
        this.hideContextMenu()
      })

      this.mindMap.on('node_tree_render_end', () => {
        this.$nextTick(() => {
          this.patchRootExpandBtn()
        })
      })

      this.mindMap.on('data_change', (data) => {
        this.enforceMaxLevel(data)
      })
    },

    enforceMaxLevel(data) {
      const checkAndRemove = (node, depth = 0) => {
        if (!node || !node.data) return
        const level = node.data._level || this.getLevelByDepth(depth)
        if (level === 'testCase' && node.children && node.children.length > 0) {
          node.children = []
        }
        if (node.children) {
          node.children.forEach(child => checkAndRemove(child, depth + 1))
        }
      }
      checkAndRemove(data, 0)
    },

    getLevelByDepth(depth) {
      if (depth <= 0) return 'root'
      if (depth === 1) return 'requirement'
      if (depth === 2) return 'testPoint'
      return 'testCase'
    },

    handleNodeContextMenu(e, node) {
      const level = this.getNodeLevel(node)
      const customData = this.getNodeCustomData(node)

      this.contextMenu = {
        visible: true,
        x: e.clientX + 5,
        y: e.clientY + 5,
        type: level,
        node: customData,
        smmNode: node
      }
    },

    handleNodeDblClick(node) {
      const level = this.getNodeLevel(node)
      if (level === 'testCase') {
        this.editTestCaseDialog()
      }
    },

    getNodeLevel(node) {
      if (node.isRoot) return 'root'
      const parent = node.parent
      if (parent && parent.isRoot) return 'requirement'
      if (parent && parent.parent && parent.parent.isRoot) return 'testPoint'
      return 'testCase'
    },

    getNodeCustomData(node) {
      const data = node.getData()
      return {
        text: data.text,
        level: data._level,
        status: data._status,
        source: data._source,
        marked: data._marked,
        caseProperty: data._caseProperty
      }
    },

    // ==================== 缩放控制 ====================
    zoomIn() {
      if (this.mindMap) {
        const current = this.mindMap.view.scale || 1
        this.mindMap.view.setScale(Math.min(current + 0.1, 2))
      }
    },

    zoomOut() {
      if (this.mindMap) {
        const current = this.mindMap.view.scale || 1
        this.mindMap.view.setScale(Math.max(current - 0.1, 0.3))
      }
    },

    fitCanvas() {
      if (this.mindMap) {
        this.mindMap.view.fit()
      }
    },

    // ==================== 右键菜单操作 ====================
    hideContextMenu() {
      this.contextMenu.visible = false
    },

    addTestPoint() {
      console.log('添加测试点')
      this.hideContextMenu()
    },

    aiAdjust() {
      console.log('AI调整')
      this.hideContextMenu()
    },

    editTestPoint() {
      console.log('编辑测试点')
      this.hideContextMenu()
    },

    deleteTestPoint() {
      console.log('删除测试点')
      this.hideContextMenu()
    },

    addTestCase() {
      console.log('添加测试用例')
      this.hideContextMenu()
    },

    toggleMark() {
      if (this.contextMenu.node) {
        this.contextMenu.node.marked = !this.contextMenu.node.marked
      }
      this.hideContextMenu()
    },

    editTestCaseDialog() {
      console.log('编辑测试用例')
      this.hideContextMenu()
    },

    deleteTestCase() {
      console.log('删除测试用例')
      this.hideContextMenu()
    },

    // ==================== 状态工具方法 ====================
    getRequirementStatusClass(status) {
      switch (status) {
        case 'completed': return 'bg-green-100 text-green-700'
        case 'generating': return 'bg-yellow-100 text-yellow-700'
        case 'pending': return 'bg-gray-100 text-gray-500'
        default: return 'bg-gray-100 text-gray-500'
      }
    },

    async handleLogout() {
      await this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style>
/* ========== 右键菜单动画 ========== */
.context-menu {
  animation: menu-appear 0.15s ease-out;
}

@keyframes menu-appear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.context-menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 14px;
  text-align: left;
  font-size: 13px;
  color: #374151;
  transition: background-color 0.15s;
  gap: 8px;
}

.context-menu-item:hover {
  background-color: #f3f4f6;
}

/* ========== 用例备注弹窗 ========== */
#custom-note-popover {
  display: none;
  position: fixed;
  z-index: 1000;
  pointer-events: none;
}

.case-note-popover {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: 16px;
  min-width: 320px;
  max-width: 420px;
  font-size: 13px;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.case-note-name {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
  line-height: 1.4;
  word-break: break-all;
}

.case-note-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.case-property-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.tag-positive {
  background: #dcfce7;
  color: #166534;
}

.tag-negative {
  background: #fee2e2;
  color: #991b1b;
}

.case-source-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.tag-ai {
  background: #fef3c7;
  color: #92400e;
}

.tag-manual {
  background: #f3e8ff;
  color: #6b21a8;
}

.case-note-precondition {
  margin-bottom: 12px;
  padding: 8px 10px;
  background: #f9fafb;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.6;
}

.case-note-precondition .label,
.case-note-steps .label {
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 6px;
}

.case-note-steps {
  border-top: 1px solid #f3f4f6;
  padding-top: 10px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 6px 0;
  font-size: 12px;
  line-height: 1.6;
  border-bottom: 1px dashed #f3f4f6;
}

.step-item:last-child {
  border-bottom: none;
}

.step-num {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  margin-top: 1px;
}

.step-name {
  font-weight: 600;
  color: #374151;
  flex-shrink: 0;
}

.step-desc {
  color: #6b7280;
}

.step-arrow {
  color: #d1d5db;
  flex-shrink: 0;
}

.step-expect {
  color: #059669;
}
</style>