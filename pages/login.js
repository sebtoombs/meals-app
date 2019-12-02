import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import tw from "tailwind.macro";
import Link from "next/link";

import {
  FormGroup,
  Label,
  Input,
  FormError,
  FormText
} from "../components/Form";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { MdArrowForward } from "react-icons/md";
import Button from "../components/Button";
import fetch from "isomorphic-unfetch";

const LoginPageStyled = styled.div`
  ${tw`bg-teal-700 min-h-full px-8`}
`;

function LoginPage() {
  const doLogin = async credentials => {};

  return (
    <LoginPageStyled>
      <div
        css={`
          ${tw`bg-white rounded py-4 px-12 relative`} top: 50%;
          transform: translateY(-50%);
        `}
      >
        <span css={tw`text-4xl mb-5 block`}>Welcome</span>
        <p css={tw`mb-5`}>Sign in or register to continue.</p>
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={values => {
            const errors = {};
            if (!values.email) {
              errors.email = "Your email address is required";
            }
            if (!values.password) {
              errors.password = "Your password is definitely required";
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            console.log("submit", values);
            const result = await doLogin(values);
            setSubmitting(false);
            return;
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormGroup>
                <Label>Email</Label>
                <Input as={Field} type="email" name="email" large="true" />
                <FormError as={ErrorMessage} name="email" component="span" />
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <Input
                  as={Field}
                  type="password"
                  name="password"
                  large="true"
                />
                <FormError as={ErrorMessage} name="password" component="span" />
              </FormGroup>

              <Button
                type="submit"
                disabled={isSubmitting}
                primary
                block
                size="lg"
                iconAfter={<MdArrowForward />}
                center
              >
                Sign In
              </Button>
            </Form>
          )}
        </Formik>
        <p css={tw`mt-5`}>
          Don't have an account?{" "}
          <Link href="/register">
            <a css={tw`text-indigo-600 underline`}>Register</a>
          </Link>
        </p>
      </div>
    </LoginPageStyled>
  );
}
export default LoginPage;
