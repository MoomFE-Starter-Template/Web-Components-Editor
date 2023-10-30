import { uniqueKeyCustomizer } from 'mixte';

/**
 * 挂载 Naive UI 的样式到 web components 组件中
 * @param classPrefix 自定义组件的类的前缀, 默认为随机字符串
 * @example
 *
 * // js
 * const classPrefix = useNaiveStyle();
 *
 * // template
 * <n-config-provider :cls-prefix="classPrefix">
 *   <n-select />
 * </n-config-provider>
 */
export function useNaiveStyle(classPrefix = uniqueKeyCustomizer()) {
  const el = useCurrentElement();
  const selectors = `style[cssr-id^="${classPrefix}-"]`;

  onMounted(() => {
    // Naive UI 的样式是动态插入到 document.head 中的
    // 所以监听 document.head 中样式的变化, 并将同样前缀的样式其插入到组件中
    function insertStyle() {
      const shadowRoot = el.value!.parentNode!;

      shadowRoot.querySelectorAll(selectors).forEach((style) => {
        shadowRoot.removeChild(style);
      });

      Array.from(document.querySelectorAll(selectors)).forEach((style) => {
        shadowRoot.appendChild(style.cloneNode()).textContent = style.textContent;
      });
    }

    useMutationObserver(document.head, insertStyle, {
      childList: true,
    });

    insertStyle();
  });

  return classPrefix;
}
