"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wrapper = void 0;
const react_1 = require("@chakra-ui/react");
const react_2 = __importDefault(require("react"));
const Wrapper = ({ children, variant = "regular", }) => {
    return (<react_1.Box mt={8} mx="auto" maxW={variant === "regular" ? "800px" : "400px"} w="100%">
      {children}
    </react_1.Box>);
};
exports.Wrapper = Wrapper;
