<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable :placeholder="$t('table.uGood')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.category_id" :placeholder="$t('table.uCategory')" clearable class="filter-item" style="width: 150px">
        <el-option v-for="item in calendarTypeOptions" :key="item.id" :label="item.name+' ('+item.counts+'个)'" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.date')" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_at * 1000 | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.uImage')" width="80px" align="center">
        <template slot-scope="{row}">
          <el-image style="width: 50px; height: 50px" :src="row.images" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.uGood')" min-width="150">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.uContent')" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.uCategory')" width="100px" align="center">
        <template slot-scope="{row}">
          <el-tag type="warning" effect="plain">{{ row.category_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.uPrice')" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="row.status!='published'" disabled size="mini" type="success" @click="handleModifyStatus(row,'published')">
            {{ $t('table.uUpSale') }}
          </el-button>
          <el-button v-if="row.status!='draft'" disabled size="mini" @click="handleModifyStatus(row,'draft')">
            {{ $t('table.uDownSale') }}
          </el-button>
          <el-button v-if="row.status!='deleted'" disabled size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 80%; margin-left:10%;">
        <el-form-item :label="$t('table.uCategory')" prop="category_id">
          <el-select v-model="temp.category_id" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.uGood')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('table.uPrice')" prop="price">
          <el-input-number v-model="temp.price" :precision="2" :step="1" :min="1" :max="999" label="商品单价" />
        </el-form-item>
        <el-form-item :label="$t('table.status')" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.uContent')" prop="content">
          <el-input v-model="temp.content" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item :label="$t('table.uImage')" prop="content" @disabled="dialogStatus==='update'?false:true">
          <el-image style="width: 200px; height: 200px" :src="temp.images" fit="cover" />
          <el-input v-model="temp.images" type="textarea" disabled />
          <el-button type="danger" @click="showCropDialog()">上传首图</el-button>
          <VueImageCropUpload
            v-model="cropDialog"
            field="img"
            :width="300"
            :height="300"
            img-format="png"
            @crop-success="handleCropSuccess"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { fetchList, fetchPv, createArticle, updateArticle, uploadImage, fetchCategories } from '@/api/goods'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import VueImageCropUpload from 'vue-image-crop-upload'

const calendarTypeOptions = []

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.id] = cur.name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination, VueImageCropUpload },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        category_id: undefined,
        sort: '+id'
      },
      calendarTypeOptions,
      sortOptions: [{ label: 'ID 正序', key: '+id' }, { label: 'ID 倒序', key: '-id' }],
      statusOptions: ['published', 'draft'],
      showReviewer: false,
      temp: {
        id: undefined,
        price: undefined,
        content: '',
        images: '',
        name: undefined,
        category_id: undefined,
        status: undefined
      },
      cropDialog: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        category_id: [{ required: true, message: 'category_id is required', trigger: 'change' }],
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        status: [{ required: true, message: 'status is required', trigger: 'blur' }],
        content: [{ required: true, message: 'content is required', trigger: 'blur' }],
        price: [{ required: true, message: 'price is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      multipleSelection: []
    }
  },
  created() {
    this.getCategories()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getCategories() {
      fetchCategories(this.listQuery).then(response => {
        this.calendarTypeOptions = response.data.items
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.category_id = row.category_id
      this.temp.name = row.name
      this.temp.status = status

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      console.log(this.temp)
      this.updateData()
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      } else if (prop === 'pageviews') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        price: undefined,
        content: '',
        images: '',
        name: '',
        status: '',
        category_id: ''
      }
    },
    showCropDialog() {
      if (this.dialogStatus !== 'update') {
        alert('创建商品时不支持上传首图 请先创建商品后点击编辑按钮进行图片上传')
        return
      } else {
        this.cropDialog = true
      }
    },
    handleCropSuccess(imgData) {
      this.temp.images = imgData
      uploadImage({ images: imgData.split(',')[1], id: this.temp.id }).then((result) => {
        if (result.code !== 20000) {
          alert('上传失败 请刷新页面 或联系管理员')
          console.log(result)
        }
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.category_id = row.category_id
      this.temp.name = row.name

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['created_at', 'name', 'category_name', 'status', 'price', 'content']
        const filterVal = ['created_at', 'name', 'category_name', 'status', 'price', 'content']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'created_at') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
