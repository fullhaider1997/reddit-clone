"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@chakra-ui/react");
//In next.js each created componet is route
const formik_1 = require("formik");
const Wrapper_1 = require("../../components/Wrapper");
const InputField_1 = require("../../components/InputField");
const toErrorMap_1 = require("../../../utils/toErrorMap");
const router_1 = require("next/router");
const NavBar_1 = require("../../components/NavBar");
const graphql_1 = require("../../generated/graphql");
const ChangePassword = ({ token }) => {
    const router = (0, router_1.useRouter)();
    const [changePassword] = (0, graphql_1.useChangePasswordMutation)();
    const [tokenError, setTokenError] = (0, react_1.useState)("");
    return (<>
      <NavBar_1.NavBar />
      <Wrapper_1.Wrapper variant="small">
        <formik_1.Formik initialValues={{ newPassword: "" }} onSubmit={async (values, { setErrors }) => {
            var _a, _b;
            const response = await changePassword({
                newPassword: values.newPassword,
                token: token,
            });
            console.log(response);
            if ((_a = response.data) === null || _a === void 0 ? void 0 : _a.changePassword.errors) {
                const errorMap = (0, toErrorMap_1.toErrorMap)(response.data.changePassword.errors);
                if ("token" in errorMap) {
                    setTokenError(errorMap.token);
                }
                setTokenError(errorMap.token);
            }
            else if ((_b = response.data) === null || _b === void 0 ? void 0 : _b.changePassword.user) {
                router.push("/");
            }
        }}>
          {({ isSubmitting }) => (<formik_1.Form>
              <react_2.Box>
                <InputField_1.InputField name="New Password" label="new Password" type="password"/>
              </react_2.Box>
              <react_2.Box mt={8}>
                {tokenError ? <react_2.Box color="red">{tokenError}</react_2.Box> : null}
                <react_2.Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                  {" "}
                  Submit password
                </react_2.Button>
              </react_2.Box>
            </formik_1.Form>)}
        </formik_1.Formik>
      </Wrapper_1.Wrapper>
    </>);
};
ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token,
    };
};
exports.default = ChangePassword;
