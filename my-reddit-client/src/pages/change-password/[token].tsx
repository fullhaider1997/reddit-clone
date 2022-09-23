import { NextPage } from "next";
import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Box,
  Button,
} from "@chakra-ui/react";
//In next.js each created componet is route

import { Formik, Form, validateYupSchema } from "formik";
import { Wrapper } from "../../components/Wrapper";
import { InputField } from "../../components/InputField";
import { toErrorMap } from "../../../utils/toErrorMap";
import { useRouter } from "next/router";
import { NavBar } from "../../components/NavBar";
import { useChangePasswordMutation } from "../../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../../utils/createUrqlClient";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");

  return (
    <>
      <NavBar />
      <Wrapper variant="small">
        <Formik
          initialValues={{ newPassword: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await changePassword({
              token: token,
              newPassword: values.newPassword,
            });

            console.log(response);

            if (response.data?.changePassword.errors) {
              const errorMap = toErrorMap(response.data.changePassword.errors);

              if ("token" in errorMap) {
                setTokenError(errorMap.token);
              }

              setTokenError(errorMap.token);
            } else if (response.data?.changePassword.user) {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box>
                <InputField
                  name="New Password"
                  label="new Password"
                  type="password"
                />
              </Box>
              <Box mt={8}>
                {tokenError ? <Box color="red">{tokenError}</Box> : null}
                <Button
                  type="submit"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                >
                  {" "}
                  Submit password
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
