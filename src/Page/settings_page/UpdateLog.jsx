import { MarkdownRender, Tag} from '@douyinfe/semi-ui';
import {IconVerify} from "@douyinfe/semi-icons";
import Text from "@douyinfe/semi-ui/lib/es/typography/text.js";
import {getServer} from "../../code/get_server.js";
export function UpdateLog(){
    const components = {}
    components['Link404']=()=>{
        return <Text link={{href:getServer()+'/abc',target:'_blank'}}>点我访问</Text>
    }

    components['ReleaseTag'] = () => {
        return <Tag
            color='light-blue'
            prefixIcon={<IconVerify />}
            size='large'
            shape='circle'
        >
            Release
        </Tag>
    }
    components['LatestTag'] = () => {
        return <Tag
            color='light-blue'
            size='large'
            shape='circle'
            type='ghost'
        >
            Latest
        </Tag>
    }
    const raw_source=`
## Build 2024/11/05 <ReleaseTag></ReleaseTag>  <LatestTag></LatestTag>
### 🎁 新增
* 网站已引入PWA技术，用户现在可以直接通过浏览器搜索栏将我们的前端应用一键安装到设备上，享受更加便捷的访问体验。
## Build 2024/11/05 <ReleaseTag></ReleaseTag>
### 🎁 新增
* 曾经被删除的 \`高级设置\`
* 允许用户根据服务器设置更改 API 端口
### 🎉 优化
* 删除部分冗余代码
### ⚠ 警告 
- 更改API 端口属于高级设置，随意更改会导致无法正常使用对应服务！
### 📢 通知
* 网站已完全支持HTTPS服务器地址，在链接前加上HTTPS 以开启HTTPS服务。开启前请询问服务器管理员服务器是否已启用HTTPS服务，否则会导致数据无法发送！
---
## Build 2024/11/04 <ReleaseTag></ReleaseTag> 
### 🎁 新增
* Header可以切换自动主题啦
* 事件查看器(仅监控API事件，不监控服务器事件)
* UI主题色的 “自动切换” 功能
* 新的主题色切换API
### 🎉 优化
* 删除部分冗余代码
### 📢 通知
* 主题功能已经下线
---
## Build 2024/11/01 <ReleaseTag></ReleaseTag>
### 🎉 优化
* 优化移动端点击效果
---
## Build 2024/10/31 <ReleaseTag></ReleaseTag>
### 🎁 新增
* 按下 \`esc\` 可以退出所有已打开的抽屉
* 新的 404 界面 <Link404></Link404>
### 🛠️ 变更
* 更改设置页布局，当然也可以在设置页使用旧版本页面布局
### 🎉 优化
* 删除部分冗余代码，减小占用体积
* 减少在成功上传/删除文件后的提示反馈
---
## Build 2024/10/30 <ReleaseTag></ReleaseTag>
### 🎁  新增
* \`更新日志\` 
* \`主题颜色\` 
* \`主题\` 
### 🛠️ 变更
* 更改主界面布局
* \`主题\` 新增 \`万圣节主题\`
### 🎉 优化
* 删除部分冗余代码，减小占用体积
### 🔧 修复
* 修复在手机端 \`抽屉\` 过宽的问题
* 修复部分浏览器显示不正常的问题
* 修复部分动画效果
* 完善\`主题\`的具体功能

---
## Build 2024/10/29 <ReleaseTag></ReleaseTag>
### 🔧 修复
* 修复 \`服务器检测\` 功能在正常联通服务器的情况下仍显示无法联通服务器的问题

    `
    return (
        <MarkdownRender raw={raw_source} components={components} />
    )
}



