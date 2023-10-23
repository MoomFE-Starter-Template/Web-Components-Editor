import tailwindResetStyle from '@unocss/reset/tailwind.css?inline';
import elementPlusStyle from 'element-plus/theme-chalk/src/index.scss?inline';
import { ElConfigProvider } from 'element-plus';
import VueComponent from './index.vue';
import { tag } from './info';
import { defineCustomElements } from '@/utils/defineCustomElements';

defineCustomElements(tag, defineComponent({
  styles: [
    tailwindResetStyle,
    elementPlusStyle,
    ...new Set([...VueComponent.styles]),
  ],
  render() {
    return (
      <ElConfigProvider namespace="st">
        <VueComponent />
      </ElConfigProvider>
    );
  },
}));

// 因为 MessageBox、Notification 等组件的元素是插入到 body 中的
// 所以需要添加 element-plus 的样式至 document.head, 否则组件样式会出现问题
document.head.appendChild(document.createElement('style')).innerHTML = elementPlusStyle;
