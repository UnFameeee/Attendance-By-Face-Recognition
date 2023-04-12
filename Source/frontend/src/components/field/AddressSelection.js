import { Box } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import { Select, VStack, Heading, Text, HStack } from "@chakra-ui/react";
function AddressSelection({ formik, ...props }) {
  const [listCountry, setListCountry] = useState([
    { isoCode: "", name: "---" },
    ...Country.getAllCountries(),
  ]);
  const [listState, setListState] = useState(
    props?.value?.country
      ? [...State.getStatesOfCountry(props?.value?.country)]
      : [{ isoCode: "", name: "---" }]
  );
  const [listCity, setListCity] = useState(
    props?.value?.state
      ? [...City.getCitiesOfState(props?.value?.country, props?.value?.state)]
      : [{ isoCode: "", name: "---" }]
  );
  const [megaAddress, setMegaAddress] = useState(
    props?.value ? { ...props.value } : { country: "", city: "", state: "" }
  );
  const handleOnchangeMegaAddress = (e) => {
    setMegaAddress((prev) => {
      let country = prev["country"];
      let state = prev["state"];
      let city = prev["city"];
      let updateKey = prev[e.target.name];
      if (e.target.name == "country") {
        city = "";
        state = "";
        debugger
        updateKey = Country.getCountryByCode(e.target.value)?.isoCode;
        setListState([{ isoCode: "", name: "---" }]);
        setListCity([{ isoCode: "", name: "---" }]);
      } else if (e.target.name == "state") {
        city = "";
        updateKey = State.getStateByCodeAndCountry(
          e.target.value,
          country
        )?.isoCode;
      } else {
        updateKey = e.target.value;
      }
      return { city, state, country, [e.target.name]: updateKey ?? "" };
    });
  };
  useEffect(() => {
    formik?.setFieldValue(props?.name, megaAddress);
  }, [megaAddress]);
  return (
    <VStack name={props.name} spacing="10px">
      <VStack w="100%" alignItems="start">
        <Text fontSize="md" fontWeight="medium">
          Country
        </Text>
        <Select
          defaultValue={megaAddress?.country}
          name="country"
          onChange={(e) => {
            handleOnchangeMegaAddress(e);
            setListState(() => [
              { isoCode: "", name: "---" },
              ...State.getStatesOfCountry(e.target.value),
            ]);
          }}
        >
          {listCountry.map((item) => (
            <option key={item.isoCode} value={item.isoCode}>
              {item.name}{" "}
            </option>
          ))}
        </Select>
      </VStack>
      <VStack w="100%" alignItems="start">
        <Text fontSize="md" fontWeight="medium">
          State
        </Text>
        <Select
          defaultValue={megaAddress?.state}
          name="state"
          onChange={(e) => {
            handleOnchangeMegaAddress(e);
            setListCity(() => [
              { isoCode: "", name: "---" },
              ...City.getCitiesOfState(megaAddress.country, e.target.value),
            ]);
          }}
        >
          {listState.map((item) => (
            <option
              key={item.isoCode}
              value={item.isoCode}
              data-name={item.name}
            >
              {item.name}{" "}
            </option>
          ))}
        </Select>
      </VStack>
      <VStack w="100%" alignItems="start">
        <Text fontSize="md" fontWeight="medium">
          City
        </Text>
        <Select
          defaultValue={megaAddress?.city}
          name="city"
          onChange={(e) => {
            handleOnchangeMegaAddress(e);
          }}
        >
          {listCity.map((item) => (
            <option key={item.name} value={item.isoCode}>
              {item.name}{" "}
            </option>
          ))}
        </Select>
      </VStack>
    </VStack>
  );
}

export default AddressSelection;
