import { httpClient } from './httpClient';
import {
  isMockApiEnabled,
  isTestEnvironment,
} from '../config/apiEnvironment';
import { applyMockAdapter } from './mock/applyMockAdapter';

if (isMockApiEnabled() && !isTestEnvironment()) {
  applyMockAdapter(httpClient);
}
