"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputField = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const formik_1 = require("formik");
const InputField = ({ label, size: _, ...props }) => {
    const [field, { error }] = (0, formik_1.useField)(props);
    return (<react_2.FormControl isInvalid={!!error}>
      <react_2.FormLabel htmlFor={field.name}>{label}</react_2.FormLabel>
      <react_2.Input {...field} {...props} id={field.name}></react_2.Input>
      {error ? <react_2.FormErrorMessage>{error}</react_2.FormErrorMessage> : null}
    </react_2.FormControl>);
};
exports.InputField = InputField;
