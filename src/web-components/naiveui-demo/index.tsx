import { NConfigProvider, NNotificationProvider } from 'naive-ui';
import tailwindResetStyle from '@unocss/reset/tailwind.css?inline';
import VueComponent from './index.vue';
import { tag } from './info';
import { defineCustomElements } from '@/utils/defineCustomElements';

defineCustomElements(tag, defineComponent({
  styles: [
    tailwindResetStyle,
    ...new Set([...VueComponent.styles]),
  ],
  setup() {
    return {
      classPrefix: useNaive(),
    };
  },
  render() {
    return (
      <NConfigProvider clsPrefix={this.classPrefix} themeOverrides={commonOverrides} abstract>
        <NNotificationProvider>
          <VueComponent />
        </NNotificationProvider>
      </NConfigProvider>
    );
  },
}));
