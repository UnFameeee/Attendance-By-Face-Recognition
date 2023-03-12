import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import React, { useState } from "react";

function RadioGenderField({ name, onChange, onBlur, ...props }) {
  return (
    <RadioGroup
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      value={props.value}
      defaultValue={ props.value || props.arrayGender[0].value}
    >
      <Stack direction="row">
        {props.arrayGender &&
          props.arrayGender.map((item) => (
            <Radio key={item.value} value={item.value}>
              {item.label}
            </Radio>
          ))}
      </Stack>
    </RadioGroup>
  );
}

export default RadioGenderField;
