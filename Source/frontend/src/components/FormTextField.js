import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  Textarea,
  InputLeftElement,
  InputRightElement,
  Input,
} from "@chakra-ui/react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Field, useField } from "formik";
import { useState } from "react";
import SearchAndSelectAddressField from "./SearchAndSelectAddressField";
function FormTextField({ ...props }) {
  const [field, meta] = useField(props);
  if (props.isDateField) {
    return (
      <FormControl isInvalid={meta.error && meta.touched}>
        <FormLabel>{props.label}</FormLabel>
        <InputGroup>
          <Input {...field} type={props.type ?? "date"} />
        </InputGroup>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (props.isTextAreaField) {
    return (
      <FormControl isInvalid={meta.error && meta.touched}>
        <FormLabel>{props.label}</FormLabel>
        <Textarea
          {...field}
          resize="none"
          placeholder={props.placeholder ?? ""}
        />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (props.isAddress) {
    return (
      <FormControl isInvalid={meta.error && meta.touched}>
        <FormLabel>{props.label}</FormLabel>
        <Field
          {...field}
          onChange={(e) => {
            props.formik.setFieldValue("address", e);
          }}
          placeholder={props.placeholder ?? ""}
          onBlur={props.formik.handleBlur}
          as={SearchAndSelectAddressField}
        />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else {
    return (
      <FormControl isRequired={props.isRequired} isInvalid={meta.error && meta.touched}>
        <FormLabel>{props.label}</FormLabel>
        <InputGroup>
          {props.leftIcon && (
            <InputLeftElement pl={2} children={props.leftIcon} />
          )}
          {props.rightIcon && (
            <InputRightElement pr={2} children={props.rightIcon} />
          )}
          <Input
            isReadOnly={props.isReadOnly}
            {...field}
            type={props.type ?? "text"}
            placeholder={props.placeholder ?? ""}
          />
        </InputGroup>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  }
}

export default FormTextField;
