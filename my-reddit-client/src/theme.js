"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@chakra-ui/react");
const theme_tools_1 = require("@chakra-ui/theme-tools");
const fonts = { mono: `'Menlo', monospace` };
const breakpoints = (0, theme_tools_1.createBreakpoints)({
    sm: "40em",
    md: "52em",
    lg: "64em",
    xl: "80em",
});
const theme = (0, react_1.extendTheme)({
    semanticTokens: {
        colors: {
            text: {
                default: "#16161D",
                //_dark: "#ad3b8",
            },
            heroGradientStart: {
                default: "#7928CA",
                // _dark: "#e3a7f9",
            },
            heroGradientEnd: {
                default: "#FF0080",
                //_dark: "#fbec8f",
            },
        },
        radii: {
            button: "12px",
        },
    },
    colors: {
    //  black: "#16111D",
    },
    fonts,
    breakpoints,
});
exports.default = theme;
