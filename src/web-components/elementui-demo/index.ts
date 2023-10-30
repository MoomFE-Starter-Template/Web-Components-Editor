import App from './App.vue';
import { tag } from './info';
import { defineCustomElements } from '@/utils/defineCustomElements';

defineCustomElements(tag, App);
