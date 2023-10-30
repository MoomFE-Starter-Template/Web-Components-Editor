/* eslint-disable @typescript-eslint/indent */

import elementPlusStyle from 'element-plus/theme-chalk/src/index.scss?inline';

/**
 * 挂载 Element Plus UI 的样式到 web components 组件中
 */
export function useElementStyle() {
  const el = useCurrentElement();

  onMounted(() => {
    const shadowRoot = el.value!.parentNode!;
    const style = document.createElement('style');
          style.setAttribute('namespace', 'st');

    // 添加 element-plus 的样式到组件中
    shadowRoot.appendChild(style).textContent = elementPlusStyle;

    // 添加 element-plus 的样式到 document.head 中
    // 因为 MessageBox、Notification 等组件是挂载在 document.body 上的, 否则样式不生效
    document.querySelector('style[namespace="st"]') || (document.head.appendChild(style.cloneNode()).textContent = elementPlusStyle);
  });
}
