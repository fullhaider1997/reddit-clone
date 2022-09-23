"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
//In next.js each created componet is route
const formik_1 = require("formik");
const Wrapper_1 = require("../components/Wrapper");
const InputField_1 = require("../components/InputField");
const graphql_1 = require("../generated/graphql");
const toErrorMap_1 = require("../../utils/toErrorMap");
const router_1 = require("next/router");
const NavBar_1 = require("../components/NavBar");
const Register = ({}) => {
    const router = (0, router_1.useRouter)();
    const [, register] = (0, graphql_1.useRegisterMutation)();
    return (<>
      <NavBar_1.NavBar />
      <Wrapper_1.Wrapper variant="small">
        <formik_1.Formik initialValues={{ email: "", username: "", password: "" }} onSubmit={async (values, { setErrors }) => {
            var _a, _b;
            console.log();
            const response = await register({ options: values });
            console.log(values);
            if ((_a = response.data) === null || _a === void 0 ? void 0 : _a.register.errors) {
                setErrors((0, toErrorMap_1.toErrorMap)(response.data.register.errors));
            }
            else if ((_b = response.data) === null || _b === void 0 ? void 0 : _b.register.user) {
                //
                router.push("/");
            }
        }}>
          {({ isSubmitting }) => (<formik_1.Form>
              <InputField_1.InputField name="username" label="username"/>
              <react_2.Box mt={4}>
                <InputField_1.InputField name="email" label="email"/>
              </react_2.Box>
              <react_2.Box mt={4}>
                <InputField_1.InputField name="password" label="password" type="password"/>
              </react_2.Box>
              <react_2.Box mt={6}>
                <react_2.Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                  {" "}
                  Register
                </react_2.Button>
              </react_2.Box>
            </formik_1.Form>)}
        </formik_1.Formik>
      </Wrapper_1.Wrapper>
    </>);
};
exports.default = Register;
