"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@chakra-ui/react");
const theme_1 = __importDefault(require("../theme"));
function MyApp({ Component, pageProps }) {
    return (<react_1.ChakraProvider theme={theme_1.default}>
      <Component {...pageProps}/>
    </react_1.ChakraProvider>);
}
exports.default = MyApp;
