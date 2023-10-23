import { uniqueKeyCustomizer } from 'mixte';

/**
 * 使 web components 中可以使用 Naive UI 的组件
 * @param classPrefix 自定义组件的类的前缀, 默认为随机字符串
 * @example
 *
 * // js
 * const classPrefix = useNaive();
 *
 * // template
 * <n-config-provider :cls-prefix="classPrefix">
 *   <n-select />
 * </n-config-provider>
 */
export function useNaive(classPrefix = uniqueKeyCustomizer()) {
  const el = useCurrentElement();
  const selectors = `style[cssr-id^="${classPrefix}-"]`;

  onMounted(() => {
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
