import { MarkdownRender, Tag} from '@douyinfe/semi-ui';
import {IconVerify} from "@douyinfe/semi-icons";
import {getSettings} from "../../code/Settings.js";
import { AiOutlineBug } from "react-icons/ai";
import Text from "@douyinfe/semi-ui/lib/es/typography/text.js";
export function UpdateLog(){
    const components = {}
    components['Link404']=()=>{
        return <Text link={{href:'http://'+getSettings('server_ip')+'/abc',target:'_blank'}}>点我访问</Text>
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
    components['BetaTag'] = () => {
        return <Tag
            color='light-blue'
            prefixIcon={<AiOutlineBug />}
            size='large'
            shape='circle'
        >
            Beta
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
## Build 2024/11/01
项目突然崩溃，导致被迫重构代码
### 🎉 优化
*优化移动端点击效果
---
## Build 2024/10/31 <BetaTag></BetaTag> <LatestTag></LatestTag>
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
## Build 2024/10/29 <BetaTag></BetaTag>
### 🔧 修复
* 修复 \`服务器检测\` 功能在正常联通服务器的情况下仍显示无法联通服务器的问题

    `
    return (
        <MarkdownRender raw={raw_source} components={components} />
    )
}



