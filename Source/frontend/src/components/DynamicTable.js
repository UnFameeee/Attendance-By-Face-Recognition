import React, { useEffect, useState } from "react";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import {
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Thead,
  TableContainer,
  Box,
  Icon,
  Button,
  Text,
  HStack,
  IconButton,
  Checkbox,
  Avatar,
  Badge,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  Stack,
  Flex,
  Input,
  Select,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { FiMoreVertical } from "react-icons/fi";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { AiFillFilter } from "react-icons/ai";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import debounce from "lodash/debounce";
import ChakraAlertDialog from "./ChakraAlertDialog";
import { Helper } from "../Utils/Helper";
import IndeterminateCheckbox from "./IndeterminateCheckbox";
import NoDataToDisplay from "./NoDataToDisplay";
const sortType = [{ asc: 0 }, { dsc: 1 }, { def: 2 }];
const numberType = [
  "Is Greater Than Or Equal To",
  "Is Greater Than",
  "Is Less Than Or Equal To",
  "Is Less Than",
  "Is Equal To",
  "Is Not Equal To",
];
const textType = ["Start With", "End With"];
const dateTimeType = [
  "Is Before Or Equal To",
  "Is Before",
  "Is After Or Equal To",
  "Is After",
];
const defaultType = [
  "Contains",
  "Does Not Contains",
  "Is Empty",
  "Is Not Empty",
];
export const FilterType = {
  Number: {
    type: "number",
    array: numberType,
  },
  Text: {
    type: "text",
    array: textType,
  },
  DateTime: {
    type: "dateTime",
    array: dateTimeType,
  },
  Default: {
    type: "text",
    array: defaultType,
  },
};
function DynamicTable(props) {
  const { data, columns, handleDeleteRange, onAddEditOpen, tableRowAction } =
    props;
 
  const {
    isOpen: isDeleteRangeOpen,
    onOpen: onDeleteRangeOpen,
    onClose: onDeleteRangeClose,
  } = useDisclosure();
  const handleDeleteRangeAlertAccept = () => {
    onDeleteRangeClose();
    handleDeleteRange(selectedFlatRows);
  };
  const {
    headerGroups,
    rows,
    page,
    selectedFlatRows,
    nextPage,
    previousPage,
    gotoPage,
    canNextPage,
    canPreviousPage,
    pageCount,
    setPageSize,
    state: { pageIndex, pageSize },
    getTableProps,
    getTableBodyProps,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 25 },
      manualSortBy: true,
      disableMultiSort: false,
      manualPagination: false
    },
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "action",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <Flex gap="5px">
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              <Text color="white" fontWeight="normal" fontSize="1.2rem">
                Action
              </Text>
            </Flex>
          ),
          Cell: ({ row }) => (
            <HStack>
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps()}
                type="checkbox"
              />
              <Box>
                <Menu>
                  <MenuButton colorScheme="blue" variant="outline" as={Button}>
                    <Icon as={FiMoreVertical} />
                  </MenuButton>
                  <MenuList>
                    {tableRowAction.map((item) => {
                      return (
                        <MenuItem
                          key={item.actionName}
                          onClick={() =>
                            item.func(row?.values, item.actionName)
                          }
                        >
                          {item.actionName}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Menu>
              </Box>
            </HStack>
          ),
        },
        ...columns,
      ]);
    },
    useSortBy,
    usePagination,
    useRowSelect
  );

  const initialData = columns.reduce((col, curr) => {
    const { accessor, haveFilter } = curr;
    if (!haveFilter) return { ...col };
    const filterType = haveFilter?.filterType.type || "default";
    const initialValue = filterType === "number" ? -1 : "";
    return {
      ...col,
      [accessor]: {
        value: initialValue,
        sorterType: "",
        filterType: haveFilter?.filterType.array[0],
      },
    };
  }, {});
  const [pagingObject, setPagingObject] = useState({
    paging: {
      pageSize: pageSize,
      pageNumber: pageIndex + 1,
      totalElements:999,
    },
    filterAndSorter: initialData,
  });
  const handleFilter = (sortAndFilterValue, accessor, value) => {
    // console.log("sortAndFilterValue,accessor,action", sortAndFilterValue, accessor, action);
    if (
      Object.is(
        pagingObject.filterAndSorter[accessor].filterType,
        sortAndFilterValue
      )
    ) {
      return;
    }
    setPagingObject((prev) => {
      const updatedFilterAndSorter = { ...prev.filterAndSorter };
      // updatedFilterAndSorter[accessor].value=value
      updatedFilterAndSorter[accessor].filterType = sortAndFilterValue;
      return { ...prev, filterAndSorter: updatedFilterAndSorter };
    });
  };
  const debouncedGotoPage = debounce((value) => {
    const pageNumber = value && Number(value)  && value > 0 ? value -1 : 0
    gotoPage(pageNumber);
    // setPagingObject((prev) => {
    //   const updatedFilterAndSorter = { ...prev.paging };
    //   updatedFilterAndSorter.pageNumber = pageNumber;
    //   return { ...prev, paging: updatedFilterAndSorter };
    // });
  }, 500);
  const handleSort = (column, value) => {
    setPagingObject((prev) => {
      let updatedFilterAndSorter = { ...prev.filterAndSorter };
      // updatedFilterAndSorter[accessor].value=value
      column.toggleSortBy();
      for (let key in updatedFilterAndSorter) {
        if (updatedFilterAndSorter[key].sorterType != "") {
          updatedFilterAndSorter[key].sorterType = "";
        }
      }
      updatedFilterAndSorter[column.id].sorterType = value;
      return { ...prev, filterAndSorter: updatedFilterAndSorter };
    });
  };
  const handleOnBlurInputHeaderField = (column, value) => {
    if (Object.is(pagingObject.filterAndSorter[column.id].value, value)) {
      return;
    }
    setPagingObject((prev) => {
      let updatedFilterAndSorter = { ...prev.filterAndSorter };
      updatedFilterAndSorter[column.id].value = value;
      return { ...prev, filterAndSorter: updatedFilterAndSorter };
    });
  };
  const handleReset = () => {
    setPagingObject({
      paging: {
        pageSize: pageSize,
        pageNumber: pageIndex + 1,
      },
      filterAndSorter: initialData,
    });
    setPageSize(25)
    gotoPage(0)
  };
  useEffect(() => {
    console.log("paging pageIndex", pageIndex);
    setPagingObject((prev) => {
      let updatedFilterAndSorter = { ...prev.paging };
      updatedFilterAndSorter.pageNumber = pageIndex;
      return { ...prev, paging: updatedFilterAndSorter };
    });
  }, [pageIndex]);
  useEffect(() => {
    console.log("paging pageSize", pageSize);
    setPagingObject((prev) => {
      let updatedFilterAndSorter = { ...prev.paging };
      updatedFilterAndSorter.pageSize = pageSize;
      return { ...prev, paging: updatedFilterAndSorter };
    });
  }, [pageSize]);
  useEffect(() => {
    console.log("paging obj", pagingObject);
  }, [pagingObject]);

  return (
    <Stack marginTop="0px !important">
      <HStack
        display="flex"
        width="100%"
        className="tool-bar"
        flexDirection={{
          base: "column",
          sm: "column",
          md: "column",
          lg: "column",
          xl: "row",
        }}
        gap="10px"
        alignItems="flex-start"
      >
        <HStack flex="1">
          <Button colorScheme="blue" onClick={onAddEditOpen}>
            Add New
          </Button>
          <Button colorScheme="blue" onClick={handleReset}>
            Reset
          </Button>
          <Button
            onClick={onDeleteRangeOpen}
            isDisabled={selectedFlatRows.length < 2}
            colorScheme="blue"
          >
            Delete Range
          </Button>
          <ChakraAlertDialog
            isOpen={isDeleteRangeOpen}
            onClose={onDeleteRangeClose}
            onAccept={handleDeleteRangeAlertAccept}
            title={`Delete ${
              rows.length === selectedFlatRows.length ? "All" : ""
            } ${selectedFlatRows.length} items`}
          />
        </HStack>
        <HStack
          spacing="10px"
          display="flex"
          gap="10px"
          flex="1"
          marginLeft="0px !important"
          alignItems="flex-start"
          flexDirection={{
            base: "column",
            sm: "column",
            md: "row",
            lg: "row",
            xl: "row",
          }}
          justifyContent={{
            base: "flex-start",
            sm: "flex-start",
            md: "flex-end",
            lg: "flex-end",
            xl: "flex-end",
          }}
        >
          <HStack>
            <Button
              colorScheme="blue"
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
            >
              <Icon as={MdSkipPrevious} />
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => previousPage()}
              isDisabled={!canPreviousPage}
            >
              Previous
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => nextPage()}
              isDisabled={!canNextPage}
            >
              Next
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
            >
              <Icon as={MdSkipNext} />
            </Button>
          </HStack>
          <HStack>
            <Flex alignItems="center">
              <Text fontWeight="semibold">
                {pageIndex + 1}/{pageCount} {pageCount > 1 ? "pages" : "page"}
              </Text>
            </Flex>
            <Flex alignItems="center" gap="5px">
              <Text fontWeight="semibold">Go to</Text>
              <Input
                type="number"
                flex="1"
                background="white"
                width="70px"
                onChange={(e) => {
                  debouncedGotoPage(e.target.value);
                }}
                defaultValue={pageIndex + 1}
                min={1}
              />
            </Flex>
            <Select
              width="150px"
              value={pageSize}
              background="white"
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[25, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
              <option key={data.length} value={data.length}>
                Show All
              </option>
            </Select>
          </HStack>
        </HStack>
      </HStack>
      <TableContainer rounded="lg">
        <Table variant="simple" {...getTableProps()}>
          <Thead bgColor="#224562">
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => {
                  // console.log("column", column);
                  if (index !== 0) {
                    return (
                      <Th
                        textTransform="capitalize"
                        fontSize="lg"
                        color="white"
                        {...column.getHeaderProps()}
                      >
                        <Flex alignItems="center" gap="5px">
                          {column?.haveFilter && (
                            <Menu>
                              <MenuButton>
                                <Icon
                                  color="white"
                                  boxSize="20px"
                                  as={AiFillFilter}
                                />
                              </MenuButton>
                              <MenuList color="black">
                                {column?.haveFilter?.filterType?.array.map(
                                  (selectValue, index) => (
                                    <MenuItem
                                      key={index}
                                      background={
                                        pagingObject.filterAndSorter[column.id]
                                          .filterType == selectValue
                                          ? "antiquewhite"
                                          : "none"
                                      }
                                      onClick={() =>
                                        handleFilter(
                                          selectValue,
                                          column.id,
                                          null
                                        )
                                      }
                                    >
                                      {selectValue}
                                    </MenuItem>
                                  )
                                )}
                              </MenuList>
                            </Menu>
                          )}
                          {column?.haveSort && column?.haveFilter ? (
                            column?.haveFilter?.filterType?.type ==
                            "dateTime" ? (
                              <Input
                                _placeholder={{
                                  color: "white",
                                  fontWeight: "normal",
                                  fontSize: "1.2rem",
                                }}
                                variant="flushed"
                                type="date"
                                onChange={(e) => {
                                  handleOnBlurInputHeaderField(
                                    column,
                                    e.target.value
                                  );
                                }}
                                placeholder={column.render("Header")}
                              />
                            ) : (
                              <Input
                                _placeholder={{
                                  color: "white",
                                  fontWeight: "normal",
                                  fontSize: "1.2rem",
                                }}
                                variant="flushed"
                                onBlur={(e) => {
                                  handleOnBlurInputHeaderField(
                                    column,
                                    e.target.value
                                  );
                                }}
                                placeholder={column.render("Header")}
                              />
                            )
                          ) : (
                            <Text
                              color="white"
                              fontWeight="normal"
                              fontSize="1.2rem"
                            >
                              {column.Header}
                            </Text>
                          )}

                          {column?.haveSort && (
                            <Flex
                              color="white"
                              cursor="pointer"
                              flexDirection="column"
                            >
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <Icon
                                    onClick={(e) => {
                                      column.getSortByToggleProps();

                                      handleSort(column, "");
                                    }}
                                    boxSize="20px"
                                    as={FaSortDown}
                                  />
                                ) : (
                                  <Icon
                                    onClick={(e) => {
                                      column.getSortByToggleProps();
                                      handleSort(column, "des");
                                    }}
                                    boxSize="20px"
                                    as={FaSortUp}
                                  />
                                )
                              ) : (
                                <Icon
                                  onClick={(e) => {
                                    column.getSortByToggleProps();
                                    handleSort(column, "asc");
                                  }}
                                  boxSize="20px"
                                  as={FaSort}
                                />
                              )}
                            </Flex>
                          )}
                        </Flex>
                      </Th>
                    );
                  }
                  return (
                    <Th
                      textTransform="capitalize"
                      fontSize="lg"
                      color="white"
                      {...column.getHeaderProps()}
                    >
                      {column.render("Header")}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody width="100%" bgColor="white" {...getTableBodyProps()}>
            {rows?.length > 0 &&
              rows?.map((row, index) => {
                prepareRow(row);
                return (
                  <Tr
                    bg={!Helper.isOdd(index) ? "#e1e8ef" : "none"}
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <Td {...cell.getCellProps()}>
                          <Box
                            width={
                              cell.column.cellWidth
                                ? cell.column.cellWidth
                                : "none"
                            }
                            textOverflow="ellipsis"
                            overflow="hidden"
                          >
                            {cell.render("Cell")}
                          </Box>
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default DynamicTable;
