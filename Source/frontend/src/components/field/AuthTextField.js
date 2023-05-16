import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/input";
import { Field, useField } from "formik";
import { useState } from "react";

function AuthTextField({ ...props }) {
  const [field, meta] = useField(props);
  const [isShow, setIsShow] = useState(true);
  const handleShow = () => {
    setIsShow((prev) => !prev);
  };
  return (
    <FormControl isInvalid={meta.error && meta.touched}>
      <FormLabel>{props.label}</FormLabel>
      <InputGroup>
        <InputLeftAddon children={props.leftIcon} />
        {props.type === "password" ? (
          <Input
            {...field}
            type={!isShow ? "text" : "password"}
            placeholder={props.placeholder ?? ""}
            autoComplete="off"
          />
        ) : (
          <Input
            {...field}
            type={props.type}
            autoComplete="off"
            placeholder={props.placeholder ?? ""}
          />
        )}
        {props.rightIcon && props.hideIcon && (
          <InputRightAddon
            onClick={handleShow}
            cursor="pointer"
            children={isShow ? props.rightIcon : props.hideIcon}
          />
        )}
        {props.rightIcon && !props.hideIcon && (
          <InputRightAddon cursor="pointer" children={props.rightIcon} />
        )}
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}

export default AuthTextField;
