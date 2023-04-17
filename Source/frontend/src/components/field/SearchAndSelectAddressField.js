import React, { useState, useEffect } from "react";
import _ from "lodash";
import Select from "react-select";
import axios from "axios";

const MapQuestAPIKey = "9kbf6Okc1Bin74c7JuZmcGDgkSvAcdBe";
const debouncedSearch = _.debounce((query, callback) => {
  axios
    .get(
      `https://www.mapquestapi.com/geocoding/v1/address?key=${MapQuestAPIKey}&location=${query}`
    )
    .then((response) => {
      const options = response.data.results[0].locations.map((location) => ({
        label: `${location.street}, ${
          location.adminArea6 ? location.adminArea6 + "," : ""
        } ${location.adminArea5}`,
      }));
      callback(options);
    });
}, 500);
function SearchAndSelectAddressField({ name, onChange, onBlur,...props}) {

  const [options, setOptions] = useState([]);
  const handleInputChange = (inputValue) => {
    if (inputValue.length < 3) {
      setOptions([]);
      return;
    }
    debouncedSearch(inputValue, setOptions);
  };
  return (
    <Select
      name={name}
      defaultInputValue={props.value}
      id="address"
      onChange={onChange}
      onBlur={onBlur}
      options={options}
      onInputChange={handleInputChange}
      placeholder={props.placeholder}
    />
  );
}

export default SearchAndSelectAddressField;
