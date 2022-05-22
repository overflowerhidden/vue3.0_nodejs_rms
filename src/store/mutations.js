/**
 * Mutations业务层数据提交
 */
import storage from './../utils/storage'

export default {
  saveUserInfo(state, userInfo) {
    state.userInfo = userInfo;
    storage.setItem('userInfo', userInfo)
  },
  saveUserMenu(state, menuList) {
    state.userInfo = menuList;
    storage.setItem('menuList', menuList)
  },
  saveUserAction(state, actionList) {
    state.userInfo = actionList;
    storage.setItem('actionList', actionList)
  },
}