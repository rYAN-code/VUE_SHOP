import Vue from 'vue'
import Element, {
  Button, Form, FormItem, Input, Message, Container, Header, Aside, Main,
  Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col,
  Table, TableColumn, Pagination, Dialog, MessageBox, Tag, Tree, Select, Cascader, Alert,
  Tabs, TabPane, CheckboxGroup, Checkbox, Upload
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element).use(Button).use(Form).use(FormItem).use(Input).use(Container).use(Header).use(Aside).use(Main)
  .use(Menu).use(Submenu).use(MenuItem).use(Breadcrumb).use(BreadcrumbItem).use(Card).use(Row).use(Col)
  .use(Table).use(TableColumn).use(Pagination).use(Dialog).use(Tag).use(Tree).use(Select).use(Cascader).use(Alert)
  .use(Tabs).use(TabPane).use(CheckboxGroup).use(Checkbox).use(Upload)
// 原型挂载
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
