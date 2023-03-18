import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  Textarea,
  InputLeftElement,
  InputRightElement,
  Input,
  RadioGroup,
  Stack,
  Radio,
  Select,
} from "@chakra-ui/react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Field, useField } from "formik";
import { useState } from "react";
import SearchAndSelectAddressField from "../field/SearchAndSelectAddressField";
import RadioGenderField from "../field/RadioGenderField";
function FormTextField(props) {
  const {
    leftIcon,
    rightIcon,
    isRequired,
    label,
    type,
    placeholder,
    selectionArray,
    arrayGender,
    isDateField,
    isTextAreaField,
    isGender,
    isSelectionField,
    isAddress,
    formik,
    isResize,
    isReadOnly,
    height,
    isDisabled,
  } = props;
  const [field, meta] = useField(props);
  if (isDateField) {
    return (
      <FormControl
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isInvalid={meta.error && meta.touched}
      >
        <FormLabel>{label}</FormLabel>
        <InputGroup>
          <Input {...field} type={type ?? "date"} />
        </InputGroup>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (isTextAreaField) {
    return (
      <FormControl
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isInvalid={meta.error && meta.touched}
      >
        <FormLabel>{label}</FormLabel>
        <Textarea
          {...field}
          resize={isResize ?? "none"}
          height={height ?? "none"}
          placeholder={placeholder ?? ""}
        />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (isGender) {
    return (
      <FormControl
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isInvalid={meta.error && meta.touched}
      >
        <FormLabel>{label}</FormLabel>
        <Field
          {...field}
          arrayGender={arrayGender}
          as={RadioGenderField}
          onChange={(e) => {
            formik.setFieldValue("gender", e);
          }}
          onBlur={formik.handleBlur}
        />
      </FormControl>
    );
  } else if (isSelectionField) {
    return (
      <FormControl
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isInvalid={meta.error && meta.touched}
      >
        <FormLabel>{label}</FormLabel>
        <Select {...field} placeholder={placeholder ?? ""}>
          {selectionArray &&
            selectionArray.map((item, index) => (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            ))}
        </Select>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else if (isAddress) {
    return (
      <FormControl
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isInvalid={meta.error && meta.touched}
      >
        <FormLabel>{label}</FormLabel>
        <Field
          {...field}
          onChange={(e) => {
            formik.setFieldValue("address", e);
          }}
          placeholder={placeholder ?? ""}
          onBlur={formik.handleBlur}
          as={SearchAndSelectAddressField}
        />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  } else {
    return (
      <FormControl
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isInvalid={meta.error && meta.touched}
      >
        <FormLabel>{label}</FormLabel>
        <InputGroup>
          {leftIcon && <InputLeftElement pl={2} children={leftIcon} />}
          {rightIcon && <InputRightElement pr={2} children={rightIcon} />}
          <Input
            {...field}
            type={type ?? "text"}
            placeholder={placeholder ?? ""}
          />
        </InputGroup>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    );
  }
}

export default FormTextField;
