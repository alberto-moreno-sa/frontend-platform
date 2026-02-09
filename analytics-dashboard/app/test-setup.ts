import { TextEncoder, TextDecoder } from "util";

Object.assign(globalThis, { TextEncoder, TextDecoder });

import "@testing-library/jest-dom";
import "./test-utils/i18n-test-helper";
