import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { Form, Input } from "antd";
import { Field, useField, useFormikContext } from "formik";
import { useState } from "react";
function AntDFormField({ name, formik, ...props }) {
  const [field, meta] = useField(name);
  const { Item } = Form;
  const { setFieldValue } = useFormikContext();
  const handleChange = (e) => {
    setFieldValue(name, e.target.value);
  };
  if (props.isSelection) {
    return (
      <FormControl >
        <FormLabel>Country</FormLabel>
        <Select placeholder="Select country">
          <option>United Arab Emirates</option>
          <option>Nigeria</option>
        </Select>
      </FormControl>
    );
  } else {
    return (
      <Item
        {...field}
        label={props.label}
        validateStatus={meta.error && meta.touched ? meta.error : ""}
        help={meta.error && meta.touched ? meta.error : ""}
      >
        <Input
          className={meta.error && meta.touched ? "ant-input-status-error" : ""}
          {...field}
          {...props}
          onChange={handleChange}
        />
      </Item>
    );
  }
}

export default AntDFormField;
