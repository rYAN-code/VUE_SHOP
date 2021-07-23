import Vue from 'vue'
import Element, {
  Button, Form, FormItem, Input, Message, Container, Header, Aside, Main,
  Menu, Submenu, MenuItem
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element).use(Button).use(Form).use(FormItem).use(Input).use(Container).use(Header).use(Aside).use(Main)
  .use(Menu).use(Submenu).use(MenuItem)

Vue.prototype.$message = Message
