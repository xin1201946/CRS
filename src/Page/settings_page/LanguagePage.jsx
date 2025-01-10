import {Card, Radio, RadioGroup} from "@douyinfe/semi-ui";
import {get_language, set_language} from "../../code/language.js";

export function LanguagePage() {
    return (
        <>
            <Card>
                <RadioGroup  type='pureCard' direction="vertical" aria-label="LanguageSelect" name="LanguageRadio" defaultValue={get_language()} onChange={(event)=>set_language(event.target.value)}>
                    <Radio extra={'zh-CN'} value={1}>中文</Radio>
                    <Radio extra={'en-US'} value={2}>English</Radio>
                </RadioGroup>
            </Card>
        </>
    )
}