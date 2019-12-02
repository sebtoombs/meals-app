import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import tw from "tailwind.macro";
import Button from "../../Button";
import { MdClose } from "react-icons/md";
import styled from "styled-components/macro";
import { useDropzone } from "react-dropzone";

import Modal from "../index";

import { FormGroup, Label, Input, FormError, FormText } from "../../Form";
import { Formik, Form, Field, ErrorMessage } from "formik";

import Row from "../../Row";
import Col from "../../Col";

//import "../../../lib/url";

import to from "../../../utils/to";

import { addMeal, uploadImage } from "../../../lib/api";

import fetch from "isomorphic-unfetch";
//import FormData from "form-data";

export default function MealModal(props) {
  const render = ({ openModal, closeModal, data }) => {
    const [selectedImage, setSelectedImage] = useState();

    const onDrop = useCallback(acceptedFiles => {
      setSelectedImage(acceptedFiles[0]);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop
    });

    const handleUploadImage = e => {
      e.preventDefault();
      const data = new FormData();
      data.append("file", selectedImage);
      //data.append("filename", fileName);

      fetch("http://localhost:3000/api/image", {
        method: "POST",
        body: data
      })
        .then(response => response.json())
        .then(data => {
          console.log("Result: ", data);
        });
    };

    return (
      <div css={tw`p-4`}>
        <div css={tw`pb-4`}>
          <Button
            link
            icon={<MdClose />}
            onClick={closeModal}
            css={tw`ml-auto mr-0`}
          >
            Cancel
          </Button>
        </div>

        <Button onClick={handleUploadImage}>Upload</Button>

        <Formik
          initialValues={{ name: "", name_extra: "" }}
          validate={values => {
            const errors = {};
            /*if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }*/
            if (!values.name) {
              errors.name = "Required";
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            console.log("submit", values);
            const meal = await addMeal({ ...values });
            console.log("Added: ", meal);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormGroup>
                <Label>Meal Name</Label>
                <Input as={Field} type="text" name="name" large="true" />
                <FormError as={ErrorMessage} name="name" component="span" />
              </FormGroup>
              <FormGroup>
                <Label isOptional>Name Extra</Label>
                <Input as={Field} type="text" name="name_extra" />
                <FormText>
                  Give an extended bit of name information. E.g. "with Slaw &
                  Sweet Potato Fries"
                </FormText>
              </FormGroup>
              <FormGroup>
                <Label isOptional>Image</Label>
                <div css={tw`mt-3`}>
                  {selectedImage ? (
                    <div css={tw`relative`}>
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        css={tw`rounded w-full h-auto`}
                      />
                      <button
                        css={`
                          ${tw`absolute text-red-600 text-3xl bg-red-100 p-1`} right: 10px;
                          top: 10px;
                        `}
                        onClick={() => setSelectedImage(null)}
                      >
                        <MdClose />
                      </button>
                    </div>
                  ) : (
                    <div
                      {...getRootProps()}
                      css={tw`rounded text-center cursor-pointer border-2 border-dashed border-gray-400 bg-gray-200 p-4 text-gray-700`}
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? <p>Drop image</p> : <p>Select image</p>}
                    </div>
                  )}
                </div>
              </FormGroup>

              <Button
                type="submit"
                disabled={isSubmitting}
                primary
                block
                size="lg"
              >
                Create Meal
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    );
  };

  return <Modal name="add_meal" render={render}></Modal>;
}
