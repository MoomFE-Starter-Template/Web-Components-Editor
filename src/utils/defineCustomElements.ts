import { defineCustomElement } from 'vue';

/**
 * 定义自定义组件
 * @param tag 自定义组件标签名
 * @param component Vue 组件对象
 */
export function defineCustomElements(tag: string, component: any) {
  if (!customElements.get(tag))
    customElements.define(tag, defineCustomElement(component));
}
